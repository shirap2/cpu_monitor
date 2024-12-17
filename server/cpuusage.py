import boto3
from flask import Flask, request
from flask_restful import Api, Resource
from datetime import datetime
import botocore.exceptions


class AWSCpuUsage(Resource):
    def get(self):

        params = self._parse_and_validate_params(request.args)
        if "error" in params:
            print(params)

            return params, 400
        instance_id_response = self._translate_ip_to_instance_id(params["ip_address"])
        if "error" in instance_id_response:
            print(instance_id_response)
            return instance_id_response, 400

        # get CPU usage from CloudWatch
        response = self._get_cpu_usage(
            instance_id=instance_id_response,
            start_time=params["start_time"],
            end_time=params["end_time"],
            period=params["period"],
        )

        if "error" in response:
            return response, 500

        return response, 200

    @staticmethod
    def _parse_and_validate_params(args):
        ip_address = args.get("ip_address")
        start_time = args.get("start_time")
        end_time = args.get("end_time")
        period = int(args.get("period", 300))

        if not all([ip_address, start_time, end_time]):  # check parameters
            return {"error": "Missing required parameters (ip_address, start_time, end_time)."}

        try:  # format date and time
            start_time = datetime.fromisoformat(start_time)
            end_time = datetime.fromisoformat(end_time)
        except ValueError:
            return {"error": "Invalid time format. Use ISO 8601 (e.g., 2024-12-15T10:00:00Z)."}

        return {
            "ip_address": ip_address,
            "start_time": start_time,
            "end_time": end_time,
            "period": period,
        }

    @staticmethod
    def _get_cpu_usage(instance_id, start_time, end_time, period):
        cloudwatch = boto3.client("cloudwatch", region_name="us-east-1")

        try:
            response = cloudwatch.get_metric_statistics(
                Namespace="AWS/EC2",
                MetricName="CPUUtilization",
                Dimensions=[
                    {"Name": "InstanceId", "Value": instance_id},
                ],
                StartTime=start_time,
                EndTime=end_time,
                Period=period,
                Statistics=["Average"],
            )
        except botocore.exceptions.ClientError as e:
            return {"error": f"AWS ClientError: {str(e)}"}

        data_points = response.get("Datapoints", [])
        data = [
            {"timestamp": dp["Timestamp"].isoformat(), "average_cpu": dp["Average"]}
            for dp in sorted(data_points, key=lambda x: x["Timestamp"])
        ]
        return {"instance_id": instance_id, "cpu_usage": data}

    @staticmethod
    def _translate_ip_to_instance_id(ip_address):
        ec2 = boto3.client('ec2', region_name="us-east-1")
        try:
            response = ec2.describe_instances(
                Filters=[{
                    'Name': 'private-ip-address',
                    'Values': [ip_address]
                }]

            )
            reservations = response.get("Reservations", [])
            if not reservations or not reservations[0].get("Instances"):
                return {"error": f"No instance found for IP address {ip_address}."}

            instance_id = reservations[0]["Instances"][0]["InstanceId"]
            return instance_id
        except botocore.exceptions.ClientError as e:
            return {"error": f"AWS ClientError: {str(e)}"}

from flask_cors import CORS
from flask import Flask
from flask_restful import Api

from cpuusage import AWSCpuUsage

app = Flask(__name__)
CORS(app)
api = Api(app)

api.add_resource(AWSCpuUsage, "/cpu-usage/")

if __name__ == "__main__":
    app.run(debug=True)

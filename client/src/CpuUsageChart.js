
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend
);

function CpuUsageChart({ dataPoints }) {
  if (!dataPoints || dataPoints.length === 0) {
    return <p>No data to display</p>;
  }

  const maxCpuUsage = Math.max(...dataPoints.map((dp) => dp.average_cpu));
  const minCpuUsage = Math.min(...dataPoints.map((dp) => dp.average_cpu));


  const maxYAxisValue = Math.ceil(maxCpuUsage);
  const minYAxisValue= Math.floor(minCpuUsage)

  const chartData = {
    labels: dataPoints.map((dp) => new Date(dp.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "CPU Utilization (%)",
        data: dataPoints.map((dp) => dp.average_cpu),
        borderColor: "rgb(46, 192, 92)",
        tension: 0.4, 
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
        type: 'category',  
      },
      y: {
        title: {
          display: true,
          text: "CPU Utilization (%)",
        },
        beginAtZero: true,
        max: maxYAxisValue,  
        min:minYAxisValue,
        type: 'linear', 
      },
    },
  };

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}

export default CpuUsageChart;


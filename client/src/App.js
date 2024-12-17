import React, { useState } from "react";
import CpuUsageChart from "./CpuUsageChart";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

function App() {
  const [ipAddress, setIpAddress] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [period, setPeriod] = useState(300); // Default to 5 minutes
  const [dataPoints, setDataPoints] = useState([]);
  const formatDate = (date) => {
        if (!date) return "";
        return date.toISOString().slice(0, -1); // Remove 'Z' 
      };
  const fetchCpuUsage = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/cpu-usage/?ip_address=${ipAddress}&start_time=${formatDate(startTime)}&end_time=${formatDate(endTime)}&period=${period}`
      );
      if (!response.ok) throw new Error("Failed to fetch CPU usage data.");
      const data = await response.json();
      setDataPoints(data.cpu_usage);
    } catch (error) {
      console.error("Error fetching CPU usage:", error);
    }
  };

  return (
    <div className="App">
      <h1>AWS CPU Monitor</h1>
      <div>
      <form>
     
        <label>
          IP Address:
          <input
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
          />
        
        </label>
 
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <label>
            Start Time:
            <DateTimePicker
              inputFormat="yyyy-MM-dd'T'HH:mm:ss"
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
              renderInput={(params) => <input {...params} />}
            />
          </label>
        </LocalizationProvider>
  
     
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <label>
            End Time:
            <DateTimePicker
              inputFormat="yyyy-MM-dd'T'HH:mm:ss"
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
              renderInput={(params) => <input {...params} />}
            />
          </label>
        </LocalizationProvider>

        <label>
          Period (seconds):
          <input
            type="number"
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
          />
        </label>
        </form>
        <button onClick={fetchCpuUsage}>Fetch CPU Usage</button>
      </div>
      <CpuUsageChart dataPoints={dataPoints} />
    </div>
  );
}

export default App;
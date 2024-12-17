# AWS CPU Monitor
This project implements an AWS CPU usage monitor. It fetches CPU usage metrics for an AWS instance and displays the usage over time in a chart. 
The input is an IP address, interval period between samples, start and end time for the monitor. 




![image](https://github.com/user-attachments/assets/561a3f2e-267d-4783-927d-ff17c7b535ed)


## Components:
1. Backend Server- handles requests from the client, gets the CPU usage using AWS cloudwatch, sends the requested data back to the client
2. Web UI- receives user input, displays CPU usage chart

## Built With:
* Python
* Flask
* Boto3 (AWS SDK for Python)
* React
* Chart.js

## Executing Program
#### Run Backend:
Start the backend server:
```python 
python main.py
```
The backend will be accessible at http://127.0.0.1:5000/cpu-usage/.
#### Run Frontend
* Navigate to the client directory.
* Install dependencies: ```npm install```
* Run the React app: `npm start`

The frontend will be available at http://localhost:3000.
## Usage Steps
* Open the frontend in your browser.
* Enter the following inputs:
IP Address (AWS instance IP),
Start Time,
End Time,
Period (seconds).
* Click _Fetch CPU Usage_ button to display chart.

Make sure AWS credentials are correctly configured in your environment.

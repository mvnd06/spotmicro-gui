import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { w3cwebsocket as WebSocket } from 'websocket';

// Create WebSocket connection
const ws = new WebSocket('ws://localhost:8080/');

function App() {
  const [status, setStatus] = useState('');
  const [sensors, setSensors] = useState('');
  const [cmdVel, setCmdVel] = useState({ linear: { x: 0, y: 0, z: 0 }, angular: { x: 0, y: 0, z: 0 } });

  useEffect(() => {
    // Listen for WebSocket messages
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'status') {
        setStatus(data.data);
      } else if (data.type === 'sensors') {
        setSensors(data.data);
      }
    };
  }, []);

  const handleCmdVel = (direction) => {
    let linear = { x: 0, y: 0, z: 0 };
    let angular = { x: 0, y: 0, z: 0 };

    if (direction === 'forward') {
      linear.x = 1;
    } else if (direction === 'backward') {
      linear.x = -1;
    } else if (direction === 'left') {
      angular.z = 1;
    } else if (direction === 'right') {
      angular.z = -1;
    }

    setCmdVel({ linear, angular });

    ws.send(JSON.stringify({
      type: 'cmd_vel',
      data: {
        linear,
        angular
      }
    }));
  };

  return (
    <div>
      <h1>Robot Monitoring Web Application</h1>
      <div>
        <h2>Robot Status</h2>
        <p>{status}</p>
      </div>
      <div>
        <h2>Sensor Data</h2>
        <p>{sensors}</p>
      </div>
      <div>
        <h2>Motor Control</h2>
        <button onClick={() => handleCmdVel('forward')}>Forward</button>
        <button onClick={() => handleCmdVel('backward')}>Backward</button>
        <button onClick={() => handleCmdVel('left')}>Left</button>
        <button onClick={() => handleCmdVel('right')}>Right</button>
        <button onClick={() => handleCmdVel('stop')}>Stop</button>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const ROSLIB = require('roslib');

// Initialize ROS connection
const ros = new ROSLIB.Ros({
  url: 'ws://192.168.5.90:9090'
});

ros.on('connection', () => {
  console.log('Connected to ROS');
});

ros.on('error', (error) => {
  console.log('Error connecting to ROS:', error);
});

ros.on('close', () => {
  console.log('Disconnected from ROS');
});

// Create WebSocket server
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Initialize status variables
const status = {
  motion: true,
  display: true,
  gui: true
};

// Load resources
app.use(express.static('public'));

// Serve the status-bar.js file to the client
app.get('/status-bar.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'status-bar.js'));
});

wss.on('connection', (socket) => {
    console.log('WebSocket connected');

    // Subscribe to ROS topics
    const ultrasonicDataListener = new ROSLIB.Topic({
        ros: ros,
        name: '/ultrasonic_data',
        messageType: 'std_msgs/Int32MultiArray'
    });

    // When a message is received on the "ultrasonic_data" topic, send the data to the front-end
    ultrasonicDataListener.subscribe((message) => {
        const ultrasonicData = {
            topic: ultrasonicDataListener.name,
            data: message.data
          };          
        socket.send(JSON.stringify(ultrasonicData));
    });

    // Send initial status on connection
    const statusData = {
      topic: 'status',
      data: status
    }
    socket.send(JSON.stringify(statusData));
});

// Start server
server.listen(8080, 'localhost', () => {
  console.log('Server started on localhost:8080');
});

// Get the status of each service
function getStatus() {
  // const motion = spawn('systemctl', ['is-active', 'motion']);
  // motion.stdout.on('data', (data) => {
  //   motionStatus = data.toString().trim() === 'active';
  // });

  // const display = spawn('systemctl', ['is-active', 'display']);
  // display.stdout.on('data', (data) => {
  //   displayStatus = data.toString().trim() === 'active';
  // });

  // const gui = spawn('systemctl', ['is-active', 'gui']);
  // gui.stdout.on('data', (data) => {
  //   guiStatus = data.toString().trim() === 'active';

  //   // Emit status update over WebSocket connection
  //   wss.clients.forEach((client) => {
  //     client.send(JSON.stringify({
  //       type: 'status',
  //       motion: motionStatus,
  //       display: displayStatus,
  //       gui: guiStatus
  //     }));
  //   });
  // });
}

// Get status on startup
getStatus();

// Poll for status updates every 5 seconds
setInterval(() => {
  getStatus();
}, 5000);
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
var status = {
  motion: 0,
  display: 0,
  rosbridge: 0
};

// Load resources
app.use('/public', express.static(__dirname + '/public'));

// Serve the status-bar.js file to the client
app.get('/status-bar.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'status-bar.js'));
});

wss.on('connection', (socket) => {
    console.log('WebSocket connected');

    // Subscribe to ROS topics
    const displayServiceStatusListener = new ROSLIB.Topic({
      ros: ros,
      name: '/display_status',
      messageType: 'std_msgs/Int32'
    });

    const motionServiceStatusListener = new ROSLIB.Topic({
      ros: ros,
      name: '/motion_status',
      messageType: 'std_msgs/Int32'
    });

    const rosbridgeServiceStatusListener = new ROSLIB.Topic({
      ros: ros,
      name: '/rosbridge_status',
      messageType: 'std_msgs/Int32'
    });

    const ultrasonicDataListener = new ROSLIB.Topic({
      ros: ros,
      name: '/ultrasonic_data',
      messageType: 'std_msgs/Int32MultiArray'
    });
    
    // Listeners.

    displayServiceStatusListener.subscribe((message) => {
      if (message.data != status.display) {
        status.display = message.data;
        updateStatus(socket, status);
      }
    });

    motionServiceStatusListener.subscribe((message) => {
      if (message.data != status.motion) {
        status.motion = message.data;
        updateStatus(socket, status);
      }
    });

    rosbridgeServiceStatusListener.subscribe((message) => {
      if (message.data != status.rosbridge) {
        status.rosbridge = message.data;
        updateStatus(socket, status);
      }
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
    updateStatus(socket, status)
});

// Start server
server.listen(8080, 'localhost', () => {
  console.log('Server started on localhost:8080');
});

// Helpers

function updateStatus(socket, data) {
  const statusData = {
    topic: 'status',
    data: data
  }
  socket.send(JSON.stringify(statusData));
}
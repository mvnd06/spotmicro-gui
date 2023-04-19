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
        const data = {
            topic: ultrasonicDataListener.name,
            values: message.data
          };          
        socket.send(JSON.stringify(data));
    });
});

// Start server
server.listen(8080, 'localhost', () => {
  console.log('Server started on localhost:8080');
});

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const ROSLIB = require('roslib');

// Initialize ROS connection
const ros = new ROSLIB.Ros({
  url: '192.168.5.90:11311'
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

wss.on('connection', (ws) => {
  console.log('WebSocket connected');

  // Subscribe to ROS topics
  const statusTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/robot/status',
    messageType: 'std_msgs/String'
  });

  statusTopic.subscribe((message) => {
    ws.send(JSON.stringify({
      type: 'status',
      data: message.data
    }));
  });

  const sensorsTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/robot/sensors',
    messageType: 'std_msgs/String'
  });

  sensorsTopic.subscribe((message) => {
    ws.send(JSON.stringify({
      type: 'sensors',
      data: message.data
    }));
  });

  // Listen for commands from front-end
  ws.on('message', (message) => {
    const command = JSON.parse(message);

    if (command.type === 'cmd_vel') {
      const cmdVelTopic = new ROSLIB.Topic({
        ros: ros,
        name: '/robot/cmd_vel',
        messageType: 'geometry_msgs/Twist'
      });

      const twist = new ROSLIB.Message({
        linear: {
          x: command.data.linear.x,
          y: command.data.linear.y,
          z: command.data.linear.z
        },
        angular: {
          x: command.data.angular.x,
          y: command.data.angular.y,
          z: command.data.angular.z
        }
      });

      cmdVelTopic.publish(twist);
    }
  });
});

// Start server
server.listen(8080, () => {
  console.log('Server started on port 8080');
});

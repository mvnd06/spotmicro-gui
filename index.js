// Create a WebSocket connection to the server
const socket = new WebSocket('ws://localhost:8080');

// When a message is received on the WebSocket connection, update the visualization
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.topic == 'status') {
    processStatusMessage(message.data)
  }
});

function processStatusMessage(statusData) {
  console.log('status received')
  console.log(statusData)
  const motionStatus = statusData.motion
  const displayStatus = statusData.display
  const bridgeStatus = statusData.rosbridge

  const motionBadge = document.getElementById('motion-status-label');
  const displayBadge = document.getElementById('display-status-label');
  const bridgeBadge = document.getElementById('rosbridge-status-label');

  motionBadge.style.backgroundColor = motionStatus ? 'green' : 'red';
  displayBadge.style.backgroundColor = displayStatus ? 'green' : 'red';
  bridgeBadge.style.backgroundColor = bridgeStatus ? 'green' : 'red';
}
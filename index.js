// Create a WebSocket connection to the server
const socket = new WebSocket('ws://localhost:8080');

// When a message is received on the WebSocket connection, update the visualization
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  // console.log(data);
  if (message.topic == 'status') {
    processStatusMessage(message.data)
  }
});

function processStatusMessage(statusData) {
  console.log('status received')
  console.log(statusData)
  const motionStatus = statusData.motion ? 'running' : 'stopped';
  const displayStatus = statusData.display ? 'running' : 'stopped';
  const guiStatus = statusData.gui ? 'running' : 'stopped';

  const motionCircle = document.getElementById('motion-status-label');
  const displayCircle = document.getElementById('display-status-label');
  const guiCircle = document.getElementById('gui-status-label');

  if (motionStatus === 'running') {
    motionCircle.style.backgroundColor = 'green';
  } else {
    motionCircle.style.backgroundColor = 'red';
  }

  if (displayStatus === 'running') {
    displayCircle.style.backgroundColor = 'green';
  } else {
    displayCircle.style.backgroundColor = 'red';
  }

  if (guiStatus === 'running') {
    guiCircle.style.backgroundColor = 'green';
  } else {
    guiCircle.style.backgroundColor = 'red';
  }
}
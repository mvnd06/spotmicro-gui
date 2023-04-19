// Create a WebSocket connection to the server
const socket = new WebSocket('ws://localhost:8080');

// When a message is received on the WebSocket connection, update the visualization
socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
});

import { entrypoints } from 'uxp';
import { io } from 'socket.io-client';
import { updateConnectionStatus } from './utils';

entrypoints.setup({
  plugin: {
    create(plugin) {
      console.log('Plugin created successfully.', plugin);
    },
    panels: {
      plugin: this, 
    },
  }
});

let socket = io('http://localhost:4040');

// Attempt to reconnect if server isn't running
socket.on('connect_error', () => {
  updateConnectionStatus(false);
  socket.emit('reconnect', true);
});

socket.on('uxp-connected', (connection) => {
  updateConnectionStatus(connection);
});

let message;
document.querySelector('#textField').addEventListener('change', (e) => {
  message = e.target.value;
});

let button = document.getElementById('sendButton'); 
button.addEventListener('click', () => {
  if (message) {
    socket.emit('message', message);
  }
});
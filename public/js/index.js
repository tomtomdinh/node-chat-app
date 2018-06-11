// makes a socket client request to the server
var socket = io();
// can make a connection event on the clientside
socket.on('connect', function () {
  console.log('Connected to server');

  socket.emit('createMessage', {
    from: 'tom',
    text: 'hey'
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

// custom listener
socket.on('newMessage', function (message) {
  console.log('New message', message);
});

// makes a socket client request to the server
var socket = io();
// can make a connection event on the clientside
socket.on('connect', function () {
  console.log('Connected to server');

});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

// custom listener
socket.on('newMessage', function (message) {
  console.log('New message', message);
  var li = document.createElement("LI");
  var text = document.createTextNode(`${message.from} : ${message.text}`);

  li.appendChild(text);
  document.getElementById('messages').appendChild(li);
});

window.onload = function() {
  var form = document.getElementById('message-form');
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    socket.emit('createMessage', {
      from: 'User',
      text: form[0].value
    }, function () {

    });
  });
};

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
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = document.getElementById('message-template').innerHTML;
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  document.getElementById('messages').innerHTML += html

  // var li = document.createElement("LI");
  // var text = document.createTextNode(`${message.from} ${formattedTime}: ${message.text}`);
  //
  // li.appendChild(text);
  // document.getElementById('messages').appendChild(li);

});

socket.on('newLocationMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = document.getElementById('location-message-template').innerHTML;
  var html = Mustache.render(template, {
    from: message.from,
    createdAt: formattedTime,
    url: message.url
  });
  document.getElementById('messages').innerHTML += html
});

window.onload = function() {
  // sending message form
  var form = document.getElementById('message-form');
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    socket.emit('createMessage', {
      from: 'User',
      text: form[0].value
    }, function () {
      //acknowledgement callback
      form[0].value = '';
    });
  });
};

// location button event listener
var locationButton = document.getElementById('send-location');
locationButton.addEventListener('click', function () {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  locationButton.disabled = true;
  locationButton.innerHTML = 'Sending location...';

  navigator.geolocation.getCurrentPosition(function(position) {
    locationButton.disabled = false;
    locationButton.innerHTML = 'Send location';
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });

  }, function () {
    locationButton.disabled = false;
    locationButton.innerHTML = 'Send location';
    alert('Unable to fetch location.');
  });

});

// makes a socket client request to the server
var socket = io();

function scrollToBottom() {
  const messageList = document.getElementById('messages');
  const newMessage = messageList.lastElementChild;
  const prevMessage = newMessage.previousElementSibling;

  const clientHeight = messageList.clientHeight;
  const scrollTop = messageList.scrollTop;
  const scrollHeight = messageList.scrollHeight;

  const newMessageStyle = window.getComputedStyle(newMessage, null);
  const newMessageHeight = parseInt(newMessageStyle.getPropertyValue("height"));
  let prevMessageHeight = 0;
  if (prevMessage) {
    const prevMessageStyle = window.getComputedStyle(prevMessage, null);
    prevMessageHeight = parseInt(prevMessageStyle.getPropertyValue("height"));
  }

  if ((clientHeight + scrollTop + newMessageHeight + prevMessageHeight) >= scrollHeight) {
    messageList.scrollTop = scrollHeight;
  }
}
// can make a connection event on the clientside
socket.on('connect', function () {
  console.log('Connected to server');

  var params = new URLSearchParams(window.location.search);

  var objParam = {
    name: params.get("name"),
    room: params.get("room")
  }

  socket.emit('join',objParam, function(err) {
    if(err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });

});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
  var ol = document.createElement('ol');
  console.log(users);
  users.forEach(function(user) {
    var li = document.createElement('li');
    var text = document.createTextNode(user);
    li.appendChild(text);
    ol.appendChild(li);
  });
  // clears the list first then readds
  document.getElementById('users').innerHTML = '';
  document.getElementById('users').appendChild(ol);
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
  document.getElementById('messages').innerHTML += html;
  scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = document.getElementById('location-message-template').innerHTML;
  var html = Mustache.render(template, {
    from: message.from,
    createdAt: formattedTime,
    url: message.url
  });
  document.getElementById('messages').innerHTML += html;
  scrollToBottom();
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

//built in modules in node
const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '..', '/public');
const port = process.env.PORT || 3000;

var app = express();
// http.createServer is used behind the scenes when calling app.listen()
var server = http.createServer(app);
// returns a websocket server
var io = socketIO(server);

app.use(express.static(publicPath));

// listens for a new connection
// 'socket' represents an individual connection
// keeps a connection up between server and client
io.on('connection', (socket) => {
  console.log('New user connected');

  // emits to the individual socket that you have joined the app
  socket.emit('newMessage', generateMessage(`Admin`, `Welcome to the chat app`));

  // broadcasts to everyone except the individual socket that a new user joined
  socket.broadcast.emit('newMessage', generateMessage(`Admin`, `New user joined`));

  // listens for a new message
  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    // emits the message to every single connected client
    io.emit('newMessage', generateMessage(message.from, message.text));
    // server calls the callack from index.js for event acknowledgement
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  // listens for the user disconnecting from server
  socket.on('disconnect', ()=>{
    console.log('User was disconnected');
  });
});



server.listen(port,()=>{
  console.log(`Server is up on port ${port}`);
});

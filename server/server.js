//built in modules in node
const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message.js');
const {Users} = require('./utils/users.js');
const {isRealString} = require('./utils/validation.js');
const publicPath = path.join(__dirname, '..', '/public');
const port = process.env.PORT || 3000;

var app = express();
// http.createServer is used behind the scenes when calling app.listen()
var server = http.createServer(app);
// returns a websocket server
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

// listens for a new connection
// 'socket' represents an individual connection
// keeps a connection up between server and client
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params,callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room);
    // socket.leave('The Office Fans');

    // io.emit -> io.to('The Office Fans').emit <- emits to only a specific room
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    // socket.broadcast.emit -> socket.broadcast.to('The Office Fans').emit
    // socket.emit

    // emits to the individual socket that you have joined the app
    socket.emit('newMessage', generateMessage(`Admin`, `Welcome to the chat app`));

    // broadcasts to everyone except the individual socket that a new user joined
    socket.broadcast.to(params.room).emit('newMessage', generateMessage(`Admin`, `${params.name} has joined`));
    callback();
  });

  // listens for a new message
  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);

    if(user && isRealString(message.text)) {
      // emits the message to every single connected client
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    // server calls the callack from index.js for event acknowledgement
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);

    if(user) {
      // emits the message to every single connected client
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  // listens for the user disconnecting from server
  socket.on('disconnect', ()=>{
    console.log('User was disconnected');
    var user = users.removeUser(socket.id);
    if(user) {
      // only emits specific to this room
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });
});



server.listen(port,()=>{
  console.log(`Server is up on port ${port}`);
});

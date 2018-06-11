//built in modules in node
const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

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
  socket.emit('newMessage', {
    from: 'Admin',
    text: `Welcome to the chat app`
  });

  // broadcasts to everyone except the individual socket that a new user joined
  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: `New user joined`,
    createdAt: new Date().getTime()
  });

  // listens for a new message
  socket.on('createMessage', (message) => {
    console.log('createMessage', message);
    // emits the message to every single connected client
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });

    // sends the event to everyone except this socket, so basically yourself
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });
  // listens for the user disconnecting from server
  socket.on('disconnect', ()=>{
    console.log('User was disconnected');
  });
});



server.listen(port,()=>{
  console.log(`Server is up on port ${port}`);
});

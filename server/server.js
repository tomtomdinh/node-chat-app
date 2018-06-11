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

  // specify an object to be sent to the client
  socket.emit('newMessage', {
    from: 'bob',
    text: 'hey what is going on',
    createdAt: 123
  });

  // listens for a new message
  socket.on('createMessage', (message) => {
    console.log('createMessage', message);
  });
  // listens for the user disconnecting from server
  socket.on('disconnect', ()=>{
    console.log('User was disconnected');
  });
});



server.listen(port,()=>{
  console.log(`Server is up on port ${port}`);
});

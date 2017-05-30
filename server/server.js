const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/message');

const publicPath = path.join(__dirname,'../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', {
    from : 'admin',
    text : 'welcome to the chat app',
    createdAt : new Date().getTime()
  });

  socket.broadcast.emit('newMessage', {
    from : 'admin',
    text : 'new user join',
    createdAt : new Date().getTime()
  })

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage ', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('This is from the server');
  });

  socket.on('createLocationMessage', (coords) => {
    console.log('createLocation', coords);
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  })

  socket.on('disconnect', () => {
    console.log('user disconnect');
  })
})

server.listen(3000, () => {
  console.log('server is up');
})

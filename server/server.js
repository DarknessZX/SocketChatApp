const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const publicPath = path.join(__dirname,'../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, test, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room are required');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    console.log(users);
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} join`));
    callback()
  });

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
    var user = users.removeUser(socket.id);
    console.log('disconnect ',user);
    if (user) {
      console.log('start emit');
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`));
      //io.to(user.room).emit('updateUserList', users.getUserList(user.room));
    }
  })
})

server.listen(3000, () => {
  console.log('server is up');
})

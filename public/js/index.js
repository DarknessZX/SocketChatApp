var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function() {
  console.log('Unable to connect');
});

socket.on('newMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var li = $('<li></li>');
  li.text(`${message.from} ${formattedTime}: ${message.text}`);

  $('#message').append(li);
})

socket.on('newLocationMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var li = $('<li></li>');
  var a = $('<a target="_blank">My current location</a>');

  li.text(`${message.from} ${formattedTime}:`);
  a.attr('href', message.url);
  li.append(a);
  $('#message').append(li);
})

$('#message-form').on('submit', function(e) {
  e.preventDefault();
  var messageTextbox = $('[name=message]');

  socket.emit('createMessage', {
    from : 'User',
    text : messageTextbox.val()
  }, function() {
    messageTextbox.val('');
  });
})

var locationButton = $('#send-location');

locationButton.on('click', function() {
  console.log('click');
  if (!navigator.geolocation) {
    return alert('Geolocation not support by your browser');
  }

  locationButton.attr('disabled','disabled');

  navigator.geolocation.getCurrentPosition(function (position) {
    console.log(position);
    socket.emit('createLocationMessage', {
      latitude : position.coords.latitude,
      longitude : position.coords.longitude
    })
  }, function() {
    return alert('Unable to get location');
  })
});

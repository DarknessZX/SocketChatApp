var socket = io();

function scrollToBottom() {
}

socket.on('connect', function () {
  var params = $.deparam(window.location.search);

  socket.emit('join', params, 'test', function(err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('no err');
    }
  });
  console.log('Connected to server');
});

socket.on('disconnect', function() {
  console.log('Unable to connect');
});

socket.on('updateUserList', function(users) {
  console.log('Users list ', users);
});

socket.on('newMessage', function(message) {
  console.log('got new message');
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = $('#message-template').html();
  var html = Mustache.render(template, {
    text : message.text,
    from : message.from,
    createdAt : formattedTime
  });

  $('#message').append(html);
  scrollToBottom();
})

socket.on('updateUserList', function(users) {
  console.log(users);
})

socket.on('newLocationMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = $('#location-message-template').html();
  var html = Mustache.render(template, {
    url : message.url,
    from : message.from,
    createdAt : formattedTime
  })

  $('#message').append(html);
  scrollToBottom();
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
    locationButton.attr('disabled','');
  }, function() {
    locationButton.attr('disabled','');
    return alert('Unable to get location');
  })
});

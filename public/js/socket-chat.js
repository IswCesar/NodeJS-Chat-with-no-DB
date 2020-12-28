var socket = io();

var params = new URLSearchParams(window.location.search)

if (!params.has('name') || !params.has('room')) {
    window.location = "index.html"
    throw new Error('Name / room needed')
}

let user = {
    name: params.get('name'),
    room: params.get('room')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('enterChat', user, function(resp) {
        renderUsers(resp)
    })
});

socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Escuchar información
socket.on('createMessage', function(mensaje) {

    renderMessages(mensaje, false)
    scrollBottom()
});

// Listening when a user leave or enter to room chat
socket.on('listPersons', function(persons) {
    renderUsers(persons)
})

socket.on('privateMessage', function(message) {
    console.log(message);
})
var params = new URLSearchParams(window.location.search)
var name = params.get('name')
var room = params.get('room')


//Jquery refs

let divUsers = $('#divUsuarios')
let formEnviar = $('#formEnviar')
let txtMensaje = $('#txtMensaje')
let divChatbox = $('#divChatbox')

// functions to render users
function renderUsers(persons) {
    console.log(persons)
    let html = ''

    html += '<li>'
    html += '   <a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('room') + '</span></a>'
    html += '</li>'


    for (let index = 0; index < persons.length; index++) {
        html += '<li>'
        html += '    <a data-id="' + persons[index].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + persons[index].name + '<small class="text-success">online</small></span></a>'
        html += '</li>'
    }

    divUsers.html(html)
}


function renderMessages(message, mine) {
    let html = ''
    let date = new Date(message.date)
    let hour = date.getHours() + ':' + date.getMinutes()
    let adminClass = 'info'
    if (message.name === 'Admin') {
        adminClass = 'danger'
    }

    if (mine) {
        html += '<li class="reverse">'
        html += '    <div class="chat-content">'
        html += '        <h5>' + message.name + '</h5>'
        html += '        <div class="box bg-light-inverse">' + message.message + '</div>'
        html += '    </div>'
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>'
        html += '    <div class="chat-time">' + hour + '</div>'
        html += '</li>'
    } else {
        html += '<li class="animated fadeIn">'

        if (message.name !== 'Admin') {
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>'
        }
        html += '    <div class="chat-content">'
        html += '        <h5>' + message.name + '</h5>'
        html += '        <div class="box bg-light-' + adminClass + '">' + message.message + '</div>'
        html += '    </div>'
        html += '    <div class="chat-time">' + hour + '</div>'
        html += '</li>'
    }





    divChatbox.append(html)
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

// Listeners

divUsers.on('click', 'a', function() {
    let id = $(this).data('id')
    if (id) {
        console.log(id)
    }
})

formEnviar.on('submit', function(e) {
    e.preventDefault();
    if (txtMensaje.val().trim().length === 0) {
        return
    }


    let user = {
        name: params.get('name'),
        message: txtMensaje.val()
    }

    socket.emit('createMessage', user, function(message) {
        txtMensaje.val('').focus()
        renderMessages(message, true)
        scrollBottom()
    });
})
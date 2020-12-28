const { io } = require('../server');
const { Users } = require('../classes/users')
const { createMessage } = require('../utils/utils')

const users = new Users()

io.on('connection', (client) => {

    client.on('enterChat', (data, callback) => {

        if (!data.name || !data.room) {
            return callback({
                error: true,
                message: 'Name / room needed'
            })
        }

        // Connect user to room
        client.join(data.room)

        users.addPerson(client.id, data.name, data.room)
        client.broadcast.to(data.room).emit('listPersons', users.getPersonsByRoom(data.room))
        client.broadcast.to(data.room).emit('createMessage', createMessage('Admin', `${data.name} joins the chat`))

        callback(users.getPersonsByRoom(data.room))
    })

    client.on('createMessage', (data, callback) => {
        let person = users.getPerson(client.id)
        let message = createMessage(person.name, data.message)
        client.broadcast.to(person.room).emit('createMessage', message)

        callback(message)
    })

    client.on('disconnect', () => {
        let person = users.deletePerson(client.id)

        client.broadcast.to(person.room).emit('createMessage', createMessage('Admin', `${person.name} leaves the chat`))
        client.broadcast.to(person.room).emit('listPersons', users.getPersonsByRoom(person.room))
    })

    // Private messages
    client.on('privateMessage', data => {
        let person = users.deletePerson(client.id)
        client.broadcast.to(data.to).emit('privateMessage', createMessage(person.name, data.message))
    })
});
var express = require('express');
var router = express.Router();

/* 
const chat  = {
  id: {
    users: [
      {
        id: '1',
        ...other
      }
    ],
    msgs: [
      {
        userId: 1,
        text: ''
      }
    ]
  }
}

*/

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


function Room(id) {
  this.id = id
  this.name = ''
  this.users = []
  this.messages = []

  this.join = function(user) {
    this.users.push(user)
  }

  this.out = function(user) {
    const idx =  this.users.findIndex(u => user.id === u.id)
    if(idx > -1) {
      this.users.splice(idx, 1)
    }
  }
}


let counter = 1

function Store() {

  this.rooms = []
  this.users = []

  this.findRoom = function(roomId) {
    const idx = this.rooms.findIndex(r => r.id === roomId)
    const room = this.rooms[idx] || this.createRoom(roomId)
    if(idx === -1) {
      this.rooms.push(room)
    }
    return room
  }

  this.createRoom = function(id) {
    return new Room(id)
  }

  this.closeRoom = function(room) {
    const idx =  this.rooms.findIndex(r => room.id === r.id)
    if(idx > -1) {
      this.rooms.splice(idx, 1)
    }
  }

  this.createUser = function(name) {

    const user = {
      id: uuidv4(),
      name: name || `user${counter++}`
    }

    this.users.push(user)
    return user
  }

}

const store = new Store()

const notFilterSelf = true
/* GET chat */
router.ws('/:chatRoomId', function(ws, req, next) {


  const { chatRoomId } = req.params

  const room = store.findRoom(chatRoomId) 
  const user = store.createUser()

  room.join(user)

  const aWss = req.ews.getWss('/chat/:chatRoomId')

  aWss.clients.forEach((client) => {
    client.send(JSON.stringify({
      users: room.users,
      messages: room.messages,
    }))
  })

  ws.on('message', function(msg) {

    room.messages.push({
      sender: user,
      text: msg
    })

    aWss.clients.forEach((client) => {
      if(notFilterSelf || client !== ws) {
        client.send(JSON.stringify({
          users: room.users,
          messages: room.messages,
        }))
      }
    })
  })

  ws.on('close', function() {
     room.out(user)
  })

});

module.exports = router;

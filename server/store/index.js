function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

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

function User(id, name) {
    this.id = id;
    this.name = name;
}

function Room(id) {
    this.id = id;
    this.name = '';
    this.users = [];
    this.messages = [];

    this.join = function (user) {
        this.users.push(user);
    };

    this.out = function (user) {
        const idx = this.users.findIndex((u) => user.id === u.id);
        if (idx > -1) {
            this.users.splice(idx, 1);
        }
    };
}

function Store() {
    this.counter = 1;
    this.rooms = [];
    this.users = [];

    this.findOrCreateRoom = function (roomId) {
        const idx = this.rooms.findIndex((r) => r.id === roomId);
        const room = this.rooms[idx] || this.createRoom(roomId);
        if (idx === -1) {
            this.rooms.push(room);
        }
        return room;
    };

    this.createRoom = function (id) {
        return new Room(id);
    };

    this.closeRoom = function (room) {
        const idx = this.rooms.findIndex((r) => room.id === r.id);
        if (idx > -1) {
            this.rooms.splice(idx, 1);
        }
    };

    this.createUser = function (name) {
        const id = uuidv4();
        const username = name || `user${this.counter++}`;
        const user = new User(id, username);
        this.users.push(user);
        return user;
    };
}

module.exports = new Store();

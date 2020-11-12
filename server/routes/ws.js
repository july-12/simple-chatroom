var express = require('express');
var router = express.Router();
var Store = require('../store');

const store = new Store();

const notFilterSelf = true;

/* GET chat */
router.ws('/:chatRoomId', function (ws, req, next) {
    const { chatRoomId } = req.params;

    const room = store.findOrCreateRoom(chatRoomId);
    const user = store.createUser();

    room.join(user);

    const aWss = req.ews.getWss('/chat/:chatRoomId');

    aWss.clients.forEach((client) => {
        client.send(
            JSON.stringify({
                users: room.users,
                messages: room.messages
            })
        );
    });

    ws.on('message', function (msg) {
        room.messages.push({
            sender: user,
            text: msg
        });

        aWss.clients.forEach((client) => {
            if (notFilterSelf || client !== ws) {
                client.send(
                    JSON.stringify({
                        users: room.users,
                        messages: room.messages
                    })
                );
            }
        });
    });

    ws.on('close', function () {
        room.out(user);
    });
});

module.exports = router;

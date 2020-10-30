const http = require('http')
const express = require('express')
const expressWs = require('express-ws')

const app = express()
const server = http.createServer(app)
const wss = expressWs(app, server)

const wsRouter = require('./routes/ws')

app.get('/', function(req, res) {
  return res.send({ hello: 'express app'})
})

var aWss = wss.getWss('/chat');

console.log(aWss.clients);

app.use('/chat', wsRouter)

// app.ws('/chat/:id', function(ws, req) {
//   ws.on('message', function(msg) {
//   console.log('received msg: ', msg);
//   aWss.clients.forEach((client) => {
//     client.send(`hello from a, newMsg: ${msg}`)
//   })
//   })
// })

const port = 3002


server.listen(port, function(){
  console.log(`Server running at ${port}`);
})

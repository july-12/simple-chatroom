const http = require('http')
const parser = require('url')

function listenHandler(req, res) {

console.log(req.url);
// console.log(res);
  const url = parser.parse(req.url)

  res.statusCode = 200
  res.setHeader("Content-Type", 'text/plain')
  res.end("hello node")
}

const server = http.createServer(listenHandler)

const port = 3008
const hostname = '127.0.0.1'

server.listen(port, hostname, function() {
  console.log(`Server running at ${hostname}:${port}.`);
})




//server.js
var http = require('http');

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('server responsed! hello client!!');
  console.log(req.headers)
});

console.log("server ready!!")
//Server监听端口
server.listen(8088)
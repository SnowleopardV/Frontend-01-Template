//server.js
var http = require('http');

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`<html width=100>
  <head height="300" width="600">
      <style>
  body div #myid{
      width:100px;
      background-color: #ff5000;
  }
  body div img{
      width:30px;
      background-color: #ff1111;
  }
  .container {
    width: 500px;
    height: 500px;
    background: red
  }
  #inner {
    color: blue
  }
      </style>
  </head>
  <body class="container">
      <div id="inner">
          <img id="myid"/>
          <img class="next"/>
      </div>
  </body>
  </html>`);
  console.log(req.headers)
});

console.log("server ready!!")
//Server监听端口
server.listen(8080)
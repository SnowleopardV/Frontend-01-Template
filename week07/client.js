//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// const net = require('net');
// const client = net.createConnection({ 
//     host: '127.0.0.1',
//     port: 8088 }, () => {
//   // 'connect' listener.
//   console.log('connected to server!');
//   client.write(`
// POST / HTTP/1.1\r
// Content-Type: application/x-www-form-urlencoded\r
// Content-Length: 9\r
// \r
// name=jack`);
// });
// console.log('request start!')
// client.on('data', (data) => {
//   console.log(data.toString());
//   client.end();
// });
// client.on('end', () => {
//   console.log('disconnected from server');
// });



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// class Request {
//     constructor (options) {
//         this.method = options.method || GET;
//         this.path = options.path || '/';
//         this.host = options.host || '172.0.0.1';
//         this.port = options.port || 8088;
//         this.headers = options.headers || {};
//         if (!this.headers["Content-Type"]) {
//             this.headers["Content-Type"] = "application/x-www-form-urlencoded"
//         }
//         if (this.headers["Content-Type"] == "application/x-www-form-urlencoded") {
//             this.body = Object.keys(options.body).map(key => `${key}: ${options.body[key]}`).join("&")
//         }
//         else if (this.headers["Content-Type"] == "application/json") {
//             this.body = JSON.stringify(options.body)
//         }
//         this.headers['Content-Length'] = this.body.length;
//     }
//     toString() {
//         return `${this.method}  ${this.path} HTTP/1.1\r
// ${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
// \r
// ${this.body}`}
// }

// const net = require('net');
// const client = net.createConnection({ 
//     host: '127.0.0.1',
//     port: 8088 }, () => {
//     console.log('connected to server!');
//     let request = new Request({
//         host: "127.0.0.1",
//         port: 8088,
//         method: 'GET',
//         path: "/",
//         headers: {
//             ['give-head']: 111
//         },
//         body: {
//             name: 'jack'
//         }
//     })
//     console.log(request.toString())
//     client.write(request.toString());
// });
// console.log('request start!')
// client.on('data', (data) => {
//   console.log(data.toString());
//   client.end();
// });
// client.on('end', () => {
//   console.log('disconnected from server');
// });


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const net = require('net');
const parser = require('./htmlparse.js');
const render = require('./render')

class Request {
    constructor (options) {
        this.method = options.method || GET;
        this.path = options.path || '/';
        this.host = options.host || '172.0.0.1';
        this.port = options.port || 8088;
        this.headers = options.headers || {};
        if (!this.headers["Content-Type"]) {
            this.headers["Content-Type"] = "application/x-www-form-urlencoded"
        }
        if (this.headers["Content-Type"] == "application/x-www-form-urlencoded") {
            this.body = Object.keys(options.body).map(key => `${key}: ${options.body[key]}`).join("&")
        }
        else if (this.headers["Content-Type"] == "application/json") {
            this.body = JSON.stringify(options.body)
        }
        this.headers['Content-Length'] = this.body.length;
    }
    toString() {
        return `${this.method}  ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.body}`}
    send(connection) {
        return new Promise ((res, rej) => {
            if (connection) {
                connection.write(this.toString())
            } else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port 
                }, () => {
                    connection.write(this.toString())
                })
            }
            //console.log('request start!')
            connection.on('data', (data) => {
                // console.log(data);
                // console.log(data.toString());
                // 这里的data是buffer数据, 需要使用toString()方法转为字符串
                
                let chunkdata = data.toString();
                // 用来打印每一个data的字符, 包括/r, /n
                // for (var i = 0; i < chunkdata.length; i++) {
                //     if (chunkdata[i] == "\r") {
                //         console.log("\\r");
                //     }
                //     else if (chunkdata[i] == "\n") {
                //         console.log("\\n");
                //     }
                //     else {
                //         console.log(chunkdata[i]);
                //     }
                // }
                let rpp = new ResponseParse();
                // if (rpp.bodyParser.) {

                // }
                rpp.receive(data.toString());
                if (rpp.isFinished) {
                    //console.log(rpp.isFinished, rpp.response);
                    res(rpp.response)
                }
                //res(data.toString());
                connection.end();
            });
            connection.on('error', () => {
                //console.log('disconnected from server');
                rej(err);
            });
        })   
    }
}

void async function() {
    let request = new Request({
        host: "127.0.0.1",
        port: 8080,
        method: 'GET',
        path: "/",
        headers: {
            ['give-head']: 111
        },
        body: {
            name: 'jack'
        }
    })
    let response = await request.send();
    parser.parserHTML(response.body);

    const viewport = images(1920, 1080)
	render(viewport, dom)
	viewport.save('toy-browser.jpg')
    //console.log(response.toString())
}()

/*
HTTP/1.1 200 OK
Content-Type: text/plain
X-Foo: bar
Date: Wed, 13 May 2020 15:28:38 GMT
Connection: keep-alive
Transfer-Encoding: chunked

20
server responsed! hello client!!
0


HTTP/1.1 200 OK\r\n
Content-Type: text/plain\r\n
X-Foo: bar\r\n
Date: Wed, 13 May 2020 15:28:38 GMT\r\n
Connection: keep-alive\r\n
Transfer-Encoding: chunked\r\n
\r\n
20\r\n
server responsed! hello client!!\r\n
0\r\n
\r\n
*/
class ResponseParse {
    constructor() {
        this.NOW_STATUS_LINE = 0;
        this.NOW_HEAD_KEY = 1;
        this.NOW_HEAD_SPACE = 2;
        this.NOW_HEAD_HEAD_END = 3;
        this.NOW_BODY = 4;

        this.current = this.NOW_STATUS_LINE;
        this.statusLine = "";
        this.headers = {};
        this.headKey = "";
        this.headValue = "";
        this.body = "";
        this.bodyParser = null;
    }
    receive(string) {
        for (var i = 0; i < string.length; i++) {
            this.receiveChar(string.charAt(i))
        }
        //console.log(this.statusLine);
        //console.log(this.headKey);
        //console.log(this.headValue);
        //console.log(this.headers)
        //console.log("body", this.body)
    }
    get isFinished () {
        return this.bodyParser && this.bodyParser.finished;
    }
    get response () {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
        return {
            codeStatus: RegExp.$1, 
            status: RegExp.$2,
            headers: this.headers,
            body: this.body
        }
    }
    receiveChar(char) {
        // this.current 为当前的解析所在的状态
        // console.log(this.current)
        
        // 一.解析statusLine
        // 如果结束, 进入下一状态
        if (this.current == this.NOW_STATUS_LINE) {
            if (char == "\n") {
                this.current = this.NOW_HEAD_KEY
            }
            else if (char != "\r") {
                this.statusLine += char;
            }
        }
        
        // 二.解析Headers,伴随这循环解析过程
        // 2.1 解析Headers中的key,解析的字符为\r, 则表示Headers解析结束, 否则未结束
        else if (this.current == this.NOW_HEAD_KEY) {
            if (char == "\r") {
                this.current = this.NOW_HEAD_HEAD_END;
            } else {
                this.headKey += char!==":"?char:"";
                if (char == ":") {
                    this.current = this.NOW_HEAD_SPACE;
                }
            }
        }

        // 2.2 解析Headers中的value
        else if (this.current == this.NOW_HEAD_SPACE) {
            this.headValue += (char!=="\r" && char!=="\n" && char!==" ")?char:"";
            if (char == "\n") {
                this.current = this.NOW_HEAD_KEY;
                this.headers[this.headKey] = this.headValue;
                this.headKey = "";
                this.headValue = "";
            }
        }

        // 三. body的解析
        // 3.1 body的内容以/r开头
        else if (this.current == this.NOW_HEAD_HEAD_END) {
            this.body += char;
            this.current = this.NOW_BODY;
            //console.log(this.headers, this.headers['Transfer-Encoding'])
            if (this.headers['Transfer-Encoding'] == 'chunked') {
                this.bodyParser = new TrunkedBodyParser();
            }
        }

        //3.2 body后续内容
        else if (this.current == this.NOW_BODY) {
            if (this.bodyParser && this.bodyParser.finished) {
                //console.log(this.bodyParser.chunkContent);
                this.body = this.bodyParser.chunkContent.join("");
                //console.log(this.body);
            }
            this.body += char!="\n"?char:"";
            this.bodyParser.receiveChar(char);
        }

    }
}

class TrunkedBodyParser {
    constructor() {
        this.GET_CHUNK_LENGTH = 0;
        this.GET_CHUNK_CONTENT_LINE = 1;
        this.WAIT_CHUNK_CONTENT_LINEEND = 2;
        this.GET_CHUNK_CONTENT_END = 3;

        this.current = this.GET_CHUNK_LENGTH;
        this.thunkLength = 0;
        this.chunkContent = [];
        this.finished = false;
    }
    receiveChar(char) {
       // console.log(this.current)
       if (this.current == this.GET_CHUNK_LENGTH) {
                if (char == '\n') {
                    this.current = this.GET_CHUNK_CONTENT_LINE;
                } else if (char == '0') {
                    this.current = this.GET_CHUNK_CONTENT_END
                } else if (char != "\r") {
                    this.thunkLength = this.thunkLength * 16;
                    this.thunkLength += parseInt(char, 16);
                }
        }
        else if (this.current == this.GET_CHUNK_CONTENT_LINE) {
            this.chunkContent.push(char);
            this.thunkLength --;
            //console.log(this.thunkLength, char)
            if (this.thunkLength == 0) {
                this.current = this.WAIT_CHUNK_CONTENT_LINEEND
            }
        }
        else if (this.current == this.WAIT_CHUNK_CONTENT_LINEEND) {
            //console.log("WAIT_CHUNK_CONTENT_LINEEND")
            if (char == '\n'){
                this.current = this.GET_CHUNK_LENGTH
            }
        }
        else if (this.current == this.GET_CHUNK_CONTENT_END) {
            this.finished = true
        }
    }
}
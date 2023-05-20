require('dotenv').config()
const express = require('express');
const app = express();
const http = require('http');
const SocketServer = require('./SECURE/socketServer')

const server = http.createServer(app)

SocketServer(server);

  
require('./DataAccessLayer/connection')
const port = process.env.SERVER_PORT || 8080


require('./Middlewares/userpageMw')(app)
require('./Middlewares/registerMw')(app)
require('./Middlewares/completeRegisterMw')(app)
require('./Middlewares/loginMw')(app)
require('./Middlewares/forgetPassMw')(app)
require('./Middlewares/resetPassMw')(app)
require('./Middlewares/lessonMw')(app)
require('./Middlewares/profileMw')(app)
require('./Middlewares/contactMw')(app)
require('./Middlewares/chatMw')(app)
require('./Middlewares/pictureMw')(app)
require('./Middlewares/MachineMw')(app)

server.listen(port, () => {
    console.log(`Codingo Server ${port} portu üzerinden çalışıyor..\nhttp://localhost:${port}/`)
})
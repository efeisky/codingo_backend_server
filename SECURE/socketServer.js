// socketServer.js

const { Server } = require('socket.io');

function SocketServer(server) {
    const io = new Server(server, {
        cors: {
          origin: 'http://localhost:3000'
        },
      });
      
      io.on('connection', (socket) => {

        socket.on('room', (data) => {
          socket.join(data )
        });

      });
}

module.exports = SocketServer;

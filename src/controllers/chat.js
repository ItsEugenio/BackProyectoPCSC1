const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on('connect', (socket) => {
  console.log('Nuevo cliente de Socket.IO conectado');

  socket.on('joinRoom', (room) => {
    console.log(`Cliente de Socket.IO se unió a la sala: ${room}`);
    socket.join(room);
  });

  socket.on('messageRoom', (messageRoom) => {
    console.log(`Mensaje recibido desde Socket.IO: ${JSON.stringify(messageRoom)}`);

    io.to(messageRoom.room).emit('messageRoom', messageRoom);
  });

  socket.on('disconnect', () => {
    console.log('Cliente de Socket.IO desconectado');
  
    const rooms = Object.keys(socket.rooms);
    rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
        console.log(`Cliente de Socket.IO dejó la sala: ${room}`);
      }
    });
  });

})



server.listen(7000, () => {
  console.log("SERVER IS RUNNING");
});
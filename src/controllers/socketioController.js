const http = require('http');

const server = http.createServer();

const io = require('socket.io')(server, {
    cors: { origin: '*' }
});

io.on('connection', (socket) => {
    console.log('Se ha conectado un cliente');

    socket.broadcast.emit('chat_message', {
        usuario: 'INFO',
        mensaje: 'Se ha conectado un nuevo usuario'
    });

    socket.on('chat_message', (data) => {
        io.emit('chat_message', data);
    });

    //R O O M S

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

});


const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Servidor de Socket.IO esta escuchando en el puerto ${PORT}`);
});

io.on('disconnet', (socket) => {
    console.log('No conecto',socket);
});
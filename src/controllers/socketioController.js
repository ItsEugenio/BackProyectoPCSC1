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
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Servidor de Socket.IO esta escuchando en el puerto ${PORT}`);
});


io.on('disconnet', (socket) => {
    console.log('No conecto',socket);

  
});
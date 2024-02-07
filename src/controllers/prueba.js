const http = require('http');
const server = http.createServer();
const io = require('socket.io')(server, {
    cors: { origin: '*' }
});

io.on('connection', (socket) => {
    console.log('Se ha conectado un cliente');

    // Manejar la lógica de unirse a una sala
    socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`El cliente se ha unido a la sala: ${room}`);
        
        // Emitir un mensaje solo a la sala actual
        io.to(room).emit('chat_message', {
            usuario: 'INFO',
            mensaje: `Se ha unido un nuevo usuario a la sala ${room}`
        });
    });

    // Manejar la lógica de enviar mensajes en una sala específica
    socket.on('chat_message', (data) => {
        io.to(data.room).emit('chat_message', data);
    });

    // Manejar la lógica de salir de una sala
    socket.on('leave_room', (room) => {
        socket.leave(room);
        console.log(`El cliente se ha desconectado de la sala: ${room}`);
        
        // Emitir un mensaje solo a la sala actual
        io.to(room).emit('chat_message', {
            usuario: 'INFO',
            mensaje: `Un usuario se ha desconectado de la sala ${room}`
        });
    });

    // Manejar la desconexión de un cliente
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Servidor de Socket.IO está escuchando en el puerto ${PORT}`);
});

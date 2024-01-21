const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const serverIO = http.createServer();

const io = require('socket.io')(serverIO, {
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

io.on('disconnet', (socket) => {
  console.log('No conecto',socket);


});



const preguntas = [
  {
    pregunta: '¿Cual es de estos paises tiene matricula amarrila?',
    respuestas: ['Dinamarca ', 'Austria ', 'Hungria', 'Luxemburgo '],
    respuestaCorrecta: 'Luxemburgo ',
  },
  {
    pregunta: '¿Qué país del Medio Oriente es famoso por su histórica ciudad de Jerusalén y sus importantes lugares religiosos?',
    respuestas: ['Israel', 'Irán ', 'Jordania', 'Libano'],
    respuestaCorrecta: 'Israel',
  },
  {
    pregunta: '¿Donde se ubica marina bay?',
    respuestas: ['Singapur', 'Emiratos Arabes Unidos', 'Qatar', 'Malasia'],
    respuestaCorrecta: 'Singapur', 
  },
  {
    pregunta: '¿Qué país europeo es conocido por su sector bancario?',
    respuestas: ['Francia ', 'Alemania ', 'Suiza', 'Lituania'],
    respuestaCorrecta: 'Suiza',
  },

];

let preguntaActualIndex = 0;
let puntos = {};

function enviarMensajeAUsuario(cliente, tipo, contenido) {
  const mensaje = {
    tipo: tipo,
    contenido: contenido,
  };
  cliente.send(JSON.stringify(mensaje));
}

function enviarPregunta() {
  const preguntaActual = preguntas[preguntaActualIndex];
  const mensaje = {
    tipo: 'pregunta',
    pregunta: preguntaActual.pregunta,
    respuestas: preguntaActual.respuestas,
  };
  broadcast(mensaje);
}

function broadcast(mensaje) {
  wss.clients.forEach((cliente) => {
    cliente.send(JSON.stringify(mensaje));
  });
}

function pasarASiguientePregunta(respuestaUsuario, cliente) {
  const preguntaActual = preguntas[preguntaActualIndex];
  const puntajeActual = puntos;

  enviarMensajeAUsuario(cliente, 'mensaje', `Respuesta ${preguntaActual.respuestaCorrecta === respuestaUsuario ? 'correcta' : 'incorrecta'}`);
  
  enviarMensajeAUsuario(cliente, 'mensaje', `Puntos acumulados: esta en producción`);

  if (preguntaActual.respuestaCorrecta === respuestaUsuario) {
    preguntaActualIndex += 1;
    
    if (preguntaActualIndex < preguntas.length) {
      enviarPregunta();
    } else {
      const resultado = {
        tipo: 'resultado',
        puntos: puntos,
      };
      broadcast(resultado);

      const gameOverMensaje = {
        tipo: 'mensaje',
        contenido: 'GAME OVER',
      };
      broadcast(gameOverMensaje);

      reiniciarJuego();
    }
  }
}

function reiniciarJuego() {
  preguntaActualIndex = 0;
  puntos = {};
}

wss.on('connection', (cliente) => {
  console.log('Cliente conectado');

  puntos[cliente] = 0;

  enviarPregunta();

  cliente.on('message', (mensaje) => {
    const respuesta = JSON.parse(mensaje);

    const preguntaActual = preguntas[preguntaActualIndex];
    if (respuesta && respuesta.tipo === 'respuesta') {
      if (respuesta.respuesta === preguntaActual.respuestaCorrecta) {
        puntos[cliente] += 1;

        pasarASiguientePregunta(respuesta.respuesta, cliente);
      } else {
        enviarMensajeAUsuario(cliente, 'mensaje', `Respuesta incorrecta Vuelve a intentarlo.`);
      }
    }
  });

  cliente.on('close', () => {
    console.log('Cliente desconectado');
    delete puntos[cliente];
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor esta escuchando en el puerto ${PORT}`);
});

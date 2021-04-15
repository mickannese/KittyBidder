const express = require('express');
const bp = require('body-parser');
const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http);
const db = require('../database/models.js')

app.use('/', express.static('dist'));
app.get('/kitties', (req, res) => {
  db.getKitties((response) => {
    res.json(response);
  })
})


io.on('connection', (socket) => {
  console.log('someone connected')
  socket.on('kitty', name => {
    db.addKitty(name, (response) => {
      if (response === false) {
        console.log('user submitted existing kitty')
      } else {
        io.emit('kitty', response)
      }
    })
  });
  socket.on('upgrade', name => {
    db.addExp(name, (response) => {
      io.emit('upgrade', response)
    })
  })
})

io.on('kitty', (socket) => {
  console.log(socket)
})

const PORT = 1212;

http.listen(PORT, () => { console.log(`You are now listening to ${PORT} radio`) })
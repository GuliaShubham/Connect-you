const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require("socket.io")(server);
const {v4 : uuidV4 } =require('uuid');

app.set('view engine','ejs');
app.use(express.static('public'));

const PORT = process.env.PORT || 5000;

app.get('/Connect',(req,res) =>{
    res.render("index.ejs");
})

app.get('/room',  (req,res) =>{
      console.log('making room');
     res.redirect(`/room/${uuidV4()}`);
  })
  
  app.get('/room/:id', (req,res)=>{
   const id =req.params.id;
  // console.log(req.params);
  res.render('room',{roomId:id}); 
  //  res.render('room', { roomId: req.params.id })
  })

io.on('connection', socket =>{
    socket.on('join-room',(roomId, userId) =>{
       // console.log( roomId,userId)
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
   
        socket.on('disconnect', () => {
          socket.to(roomId).emit('user-disconnected', userId)
        })
      })
})

server.listen(PORT, () => console.log(`Listening to ${PORT}`));




const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require("socket.io")(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening to ${PORT}`));

let userList= [];

const {v4 : uuidV4 } =require('uuid');

app.use('/peerjs', peerServer);
app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/',(req,res) =>{
    res.render("index.ejs");
})

app.get('/room',  (req,res) =>{
      console.log('making room');
      let id = uuidV4();
      console.log(id);
     res.redirect(`/room/${id}`);
    // res.render('room',{roomId: id }); 
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
   

        socket.on('message', (message, username) => {
          let userObject = { userId : userId , username : username};
            userList.push(userObject);
            console.log(userList);
          io.to(roomId).emit('createMessage', message, username);
        })

        socket.on('disconnect', () => {
          socket.to(roomId).emit('user-disconnected', userId)
        })

      })
})

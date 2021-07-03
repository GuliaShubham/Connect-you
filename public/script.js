console.log("executing");

const videoGrid = document.getElementById('video-grid');

const socket = io(`/`) 

let username = prompt("enter your name: ")

const myPeer = new Peer(undefined);
//video rendering code
let myVideoStream;
let myVideo = document.createElement('video');
myVideo.muted = true;
//let peers ={}

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream => {
    myVideoStream = stream;
addVideoStream(myVideo, stream);

myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    myVideo.id= "my_video"
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
})

socket.on('user-connected',userId =>{
    console.log("user Connected :"+ userId);
    connectToNewUser(userId,stream);
})

})

// setting up peer to peer connection and getting random ids to be printed on connection

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})

// socket.on('user-connected', userId => {
//     console.log('User connected :'+ userId)
// })
// socket.on('user-disconnected', userId => {
//     if (peers[userId]) peers[userId].close()
//   })
//functions to getting the stream from media devices and putting into our video object on  the screen

function connectToNewUser(userId, stream) {
    let call = myPeer.call(userId, stream)
    let video = document.createElement('video')
    myVideo.id = "my_video";
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
      video.remove()
    })
  
   // peers[userId] = call
  }
  
  function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.append(video)
  }

console.log("executing");

const videoGrid = document.getElementById('video-grid');

const socket = io(`/`) 
const myPeer = new Peer(undefined,{
    host:'/',
    port: '5001'
})
//video rendering code

const myVideo = document.createElement('video');
myVideo.muted = true;
const peers ={}
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream => {
addVideoStream(myVideo, stream);

myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
})

socket.on('user-connected',userId =>{
    connectToNewUser(userId,stream);
})

})

// setting up peer to peer connection and getting random ids to be printed on connection

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})

socket.on('user-connected', userId => {
    console.log('User connected :'+ userId)
})
socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
  })
//functions to getting the stream from media devices and putting into our video object on  the screen

// function addVideoStream(video, stream){
//     video.srcObject = stream
//     video.addEventListener('loadedmetadata', () =>{
//         video.play();
//     })
//     videoGrid.append(video)
// }

// function connectToNewUser(userId,stream){
//      const call = myPeer.call(userId, stream);
//      const video = document.createElement('video');
//      call.on('stream', userVideoStream => {
//          addVideoStream(video,userVideoStream);
//      })
//      call.on('close', () => {
//          video.remove();
//      })
// }

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
      video.remove()
    })
  
    peers[userId] = call
  }
  
  function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.append(video)
  }

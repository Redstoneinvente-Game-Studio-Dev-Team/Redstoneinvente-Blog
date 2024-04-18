
const usersInfoCardParent = document.getElementById('usersInfoCardParent');

const video = document.getElementById("webcamVideo");
const noVideo = document.getElementById('webCamDis');
const noMic = document.getElementById('micDis');
const webcamButton = document.getElementById('video-toggle');

const servers = {
    iceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
      },
    ],
    iceCandidatePoolSize: 10,
};
    
const pc = new RTCPeerConnection(servers);
let localStream = null;
let remoteStream = null;

var turnedOnVid = false;
var hasTurnedOnce = false;
var micOn = false;

var paddingPXCard = 0;

const users = [
    { name: "Alice", interest: "Coding", status: "Online", profilePicURL: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=3871&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
    { name: "Bob", interest: "Hiking", status: "Away", profilePicURL: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBlb3BsZXxlbnwwfDB8MHx8fDA%3D" },
    { name: "Charlie", interest: "Photography", status: "Offline", profilePicURL: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fHBlb3BsZXxlbnwwfDB8MHx8fDA%3D" }
];

// Call the function with your dummy data
spawnAllUsers(users); 

function spawnAllUsers(users){
    users.forEach(element => {
        const newCard = createUserInfoCard(element.name, element.interest, element.status, element.profilePicURL);
        usersInfoCardParent.appendChild(newCard);
    });
}

function createUserInfoCard(name, interest, status, profilePicURL) {
    const userInfoContainer = document.createElement('div');
    userInfoContainer.classList.add('userInfoContainer');

    const userDetailsContainer = document.createElement('div');
    userDetailsContainer.classList.add('userDetailsContainer');

    const userProfilePic = document.createElement('img');
    userProfilePic.src = profilePicURL;
  
    const nameHeading = document.createElement('h1');
    nameHeading.textContent = name;
  
    const otherInfoContainer = document.createElement('div');
    otherInfoContainer.classList.add('otherInfoContainer');
  
    const interestHeading = document.createElement('h2');
    interestHeading.textContent = interest;

    const statusHeading = document.createElement('h2');
    statusHeading.textContent = status;

    const meetingStatus = document.createElement('div');
    meetingStatus.classList.add("disabled-overlay-icons");

    const meetingStatusIcon = document.createElement('span');
    meetingStatusIcon.classList.add('material-symbols-outlined');
    meetingStatusIcon.textContent = "groups";

    meetingStatus.appendChild(meetingStatusIcon);
  
    otherInfoContainer.appendChild(interestHeading);
    otherInfoContainer.appendChild(statusHeading);
  
    userDetailsContainer.appendChild(nameHeading);
    userDetailsContainer.appendChild(otherInfoContainer);

    userInfoContainer.appendChild(userProfilePic);
    userInfoContainer.appendChild(userDetailsContainer);
    userInfoContainer.appendChild(meetingStatus);
  
    return userInfoContainer;
  }
  
async function webCam(){
    if (!turnedOnVid) {
        if(!hasTurnedOnce) {
            hasTurnedOnce = true;
            
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            remoteStream = new MediaStream();

            micOn = true;
        
            localStream.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
            });
        
            pc.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track, remoteStream);
            });
            //remoteVideo.srcObject = remoteStream; // Assign remote stream to remote video element
            };
        
            webcamVideo.srcObject = localStream;

            turnedOnVid = true;
            checkVideo();
            micCheck();
        }
        else {
            toggleVideo();
            //pauseStream(localStream, true);
        }
    }
    else{        
        toggleVideo();
        // pauseStream(localStream, turnedOnVid);
    }
}

// Replace the following with your actual logic to enable/disable
function toggleVideo() {
    turnedOnVid = !turnedOnVid;
    checkVideo();
}

function checkVideo(){
    checkNoVideoSize();

    video.disabled = !turnedOnVid;
    noVideo.disabled = false;
    noVideo.style.opacity = turnedOnVid ? 0 : 0.8;

    if(!turnedOnVid) {
        video.style.filter = "grayscale(0.9) brightness(50%)"; 
    }
    else{
        video.style.filter = "grayscale(0) brightness(100%)"; 
    }
}

function placeNoVideo(){
    video.muted = true; 
    noVideo.style.top = video.style.top;
    noVideo.style.left = video.style.left;
}

function checkNoVideoSize() {
    const rect = video.getBoundingClientRect();

    noVideo.style.height = rect.height + "px";
    noVideo.style.width = rect.width + "px";
}

function pauseStream(stream, pause) { 
    stream.getTracks().forEach((track) => {
        track.enabled = pause;
    });
}

function micToggle() {
    micOn = !micOn;

    micCheck();
}

async function micCheck() {
    localStream.getAudioTracks().forEach((track) => {
        track.enabled = micOn; // This will mute all audio tracks
    });

    noMic.style.opacity = micOn ? 0 : 1;

    const cardContainer = document.querySelector('.card-container');
    const overlayRect = noMic.getBoundingClientRect();
    const cardWidth = cardContainer.offsetWidth;

    // Position the card to the right of the overlay
    paddingPXCard = overlayRect.right - 5 - overlayRect.width / 2;

    cardContainer.style.left = paddingPXCard + 'px'; // Add 10px for spacing
    cardContainer.style.top = (overlayRect.top) + 'px'; 

    cardContainer.style.height = overlayRect.height + 'px';

    if (micOn) {
        cardContainer.classList.remove('active');
    }
    else{
        setTimeout(() => {
            if(!micOn){
                cardContainer.classList.add('active');
            }
          }, 1000);

        setTimeout(() => {
            cardContainer.classList.remove('active');
          }, 4000);

    }
}

const cardContainer = document.querySelector('.card-container');

window.addEventListener('resize', checkVideo);

placeNoVideo();

checkVideo();

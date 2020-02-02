// Classifier Variable

let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/D4fWmKwB/';

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";

let height;
let width;
let ratio = 0.75;

let song;
let vid;
let vidHeight;
let vidWidth;

let shiaCount = 0;

let squats = 1

let counter = 0

const emptyData = () => ({
    stand: 0,
    squat: 0,
    misc: 0
})

let data = emptyData

const updateData = s => {
    switch (s){
        case 'stand':
            data.stand++
            break
        case 'squat':
            data.squat++
            break
        case 'misc':
            data.misc++
            break
    }
}



function getCanvasDimension(){
    width = document.getElementById('canvas').clientWidth;
    height = width * ratio - 20;
}

function getVideoDimension(){
    vidWidth = document.getElementById('rightVideo').clientWidth * 2 - 25;
    vidHeight = width * ratio;
}

function setNumberDisplay(number, message){
    document.getElementById('numberDisplay').innerHTML = number > 9 ? "" + number: "0" + number;
    document.getElementById('numberComment').innerHTML = message;
}

function preload() {
    classifier = ml5.imageClassifier(imageModelURL + 'model.json');
    song = loadSound('assets/sound/hooray.mp3');
}

function setup() {
    confetti.speed = 3;
    getCanvasDimension();
    var myCanvas = createCanvas(width, height);
    myCanvas.parent("canvas");

    // Create the video
    video = createCapture(VIDEO);
    video.size(width, height - 40);
    video.hide();
    flippedVideo = ml5.flipImage(video);

    
    getVideoDimension();
    vid = createVideo(
        ['assets/video/shia0.mp4',],
        vidLoad
    );

    vid.parent("rightVideo");
    vid.size(vidWidth, vidHeight);
    document.getElementById('canvas').style.height = vidHeight-20;

    // Start classifying
    classifyVideo();
    windowResized();
    setNumberDisplay(squats, `squats left`)
}

function vidLoad() {
    vid.loop();
    const soundLevel = parseInt(localStorage.getItem('soundLevel'),10);
    if (isNaN(soundLevel)){
        vid.volume(0.5)
    }
    else{
        vid.volume(soundLevel/100);
    }
    vid.play();
}

function windowResized() {
    getCanvasDimension();
    getVideoDimension();
    resizeCanvas(width, height);

    video.size(width, height);
    vid.size(vidWidth, vidHeight);
    document.getElementById('canvas').style.height = vidHeight-20;
}

function draw() {
    background(0);
    // Draw the video
    image(flippedVideo, 0, 0);

    // Draw the label
    fill(255);
    textSize(16);
    textAlign(CENTER);
    // text(label, width / 2, height - 4);
}

// Get a prediction for the current video frame
function classifyVideo() {
    flippedVideo = ml5.flipImage(video)
    classifier.classify(flippedVideo, gotResult);
    vid.volume((parseInt(localStorage.getItem('soundLevel'),10)/100).toFixed(1))
}

function playHooray(){
    if (song.isPlaying()) {
        song.stop();
    } else {
        song.play();
    }
}

// When we get a result
function gotResult(error, results) {
    // If there is an error
    if (error) {
        console.error(error);
        return;
    }
    // The results are in an array ordered by confidence.

    label = results[0].label;

    updateData(label)

    if (squats === 0){
        chrome.runtime.sendMessage({done:true})

        //Wait for confetti
        // makeConfetti();
        // vid.pause();
        window.playHooray();
        confetti.start();

        setTimeout(function(){
            window.close()
        }, 15000)
        
    }

    if(counter === 20){
        counter = 0
        if(data.squat >= 12){
            console.log("Its a squat!!")
            if (squats > 0){
                squats--;
            }
            setNumberDisplay(squats, `SQUATS LEFT`)
            vid.src = `assets/video/shia${squats}.mp4`
            vid.play();
        }
        console.log(data);
        data = emptyData()
    }
    counter++;
    // Classifiy again!
    classifyVideo();
}

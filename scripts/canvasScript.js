// Classifier Variable

let classifier;
// Model URL
let imageModelURL = 'https://storage.googleapis.com/tm-model/7SX5ZKcp/';

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";

let height;
let width;
let ratio = 0.75;

let vid;
let vidHeight;
let vidWidth;

let shiaCount = 0;



function getCanvasDimension(){
    width = document.getElementById('canvas').clientWidth;
    height = width* ratio - 20;
    

}

function getVideoDimension(){
    vidWidth = document.getElementById('rightVideo').clientWidth * 2 - 25;
    vidHeight = width * ratio;
}

function setNumberDisplay(number, message){
    document.getElementById('numberDisplay').innerHTML = number;
    document.getElementById('numberComment').innerHTML = message;
}

function preload() {
    classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {

    getCanvasDimension();
    var myCanvas = createCanvas(width, height);
    myCanvas.parent("canvas");

    // Create the video
    video = createCapture(VIDEO);
    video.size(width, height - 21);
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
}

function vidLoad() {
    vid.loop();
    const soundLevel = parseInt(localStorage.getItem('soundLevel'),10) 
    if (isNaN(soundLevel)){
        vid.volume(0.5)
    }
    else{
        vid.volume(soundLevel/100);
    }
}

function windowResized() {
    getCanvasDimension();
    getVideoDimension();
    resizeCanvas(width, height);

    video.size(width, height - 21);
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
    text(label, width / 2, height - 4);
}

// Get a prediction for the current video frame
function classifyVideo() {
    flippedVideo = ml5.flipImage(video)
    classifier.classify(flippedVideo, gotResult);
    vid.volume(parseInt(localStorage.getItem('soundLevel'),10)/100)
//     chrome.runtime.sendMessage({test:"HII"})
//     localStorage.removeItem('tabId')
}

// When we get a result
function gotResult(error, results) {
    // If there is an error
    if (error) {
        console.error(error);
        return;
    }
    // The results are in an array ordered by confidence.
    console.log(results[0]);

    label = results[0].label;
    // Classifiy again!
    classifyVideo();
}

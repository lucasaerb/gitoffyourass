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

// Load the model first
function preload() {
    classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function getCanvasDimension(){
    width = document.getElementById('canvas').clientWidth - 20;
    height = width* ratio;
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
    // Start classifying
    classifyVideo();
    windowResized();
}


function windowResized() {
    getCanvasDimension();
    resizeCanvas(width, height);
    video.size(width, height - 21);
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
}

// When we get a result
function gotResult(error, results) {
    // If there is an error
    if (error) {
        console.error(error);
        return;
    }
    // The results are in an array ordered by confidence.
    // console.log(results[0]);
    label = results[0].label;
    // Classifiy again!
    classifyVideo();
}
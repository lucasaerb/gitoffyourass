
// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/zo_3aibj/";
let model, webcam, ctx, labelContainer, maxPredictions;
let width, height;
let ratio = 0.75;
let canvas;

window.onload = init();
// document.getElementById("button").addEventListener("click", init);

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // Note: the pose library adds a tmPose object to your window (window.tmPose)
    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    getCanvasDimension();
    // Convenience function to setup a webcam
    const size = 500;
    const flip = true; // whether to flip the webcam
    webcam = new tmPose.Webcam(width, height, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append/get elements to the DOM
    canvas = document.getElementById("canvas");
    canvas.width = width; canvas.height = height;
    ctx = canvas.getContext("2d");

    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

window.onresize = function(event) {
    // canvas.getCanvasDimension();
    getCanvasDimension();
    canvas.width = width;
    canvas.height = height;
    
    document.getElementById('canvasDiv').style.height = height-20;
    // webcam.width = width;
    // webcam.height = height;
    // video.size(width, height - 21);
};

// function windowResized() {
//     getCanvasDimension();
//     getVideoDimension();
//     resizeCanvas(width, height);

    
//     vid.size(vidWidth, vidHeight);
//     document.getElementById('canvas').style.height = vidHeight-20;
// }

function getCanvasDimension(){
    width = document.getElementById('canvasDiv').clientWidth;
    height = width * ratio - 20;
    console.log("height ", height, "width ", width);
}

async function loop(timestamp) {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    // Prediction 2: run input through teachable machine classification model
    const prediction = await model.predict(posenetOutput);

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }

    // finally draw the poses
    drawPose(pose);
}

function drawPose(pose) {
    if (webcam.canvas) {
        ctx.drawImage(webcam.canvas, 0, 0);
        // draw the keypoints and skeleton
        if (pose) {
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
    }
}

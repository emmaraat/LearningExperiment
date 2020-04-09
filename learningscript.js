// init psychoJS:
/*
var psychoJS = new PsychoJS({
  debug: true
});

// open window:
psychoJS.openWindow({
  fullscr: true,
  color: new util.Color([0, 0, 0]),
  units: 'height'
});

// store info about the experiment session:
let expName = 'LearningExp';  
let expInfo = {'participantID': '', 'session': '', 'Initials': '', 'Age': '', 'Gender': ''};

//Subject information
function subjectInfoUpdate(){
	var subjectInfo = {'Initials': '', 'Age': '', 'Gender': '', 'session': ''}

//// Loading .json file needed to set trial images

fetch('sequences.txt')
  .then((response) => response.json()) // Transform the data into json
  .then(function(data) {
    let authors = data.results;

    })
  })
  .catch(function(error) {
    console.log(error);
  });   
*/
// Initialize global variables
//Counters
var trialCounter = 0; 
var blockCounter = 0; //start with practice block

//Image info
var imageType = ["N", "AD", "AC", "AP"];

//Outcome variables
var timeShowSlider;
var timeSubmitSlider;
var reactionTime = 0;
var ratingScore;
  

//Decide session type and block order
var sessionType = getRandomInteger(1,2);
var blockFolders;
var blockOrders = [[0, 1, 2, 3], [0, 1, 3, 2], [0, 2, 1, 3], [0, 2, 3, 1], [0, 3, 1, 2], [0, 3, 2, 1]]; //for counterbalancing,but not possible in browser unless using a server request
var randomOrder = getRandomInteger(0,5);
var blockOrder = blockOrders[randomOrder]; //randomly choose one of the orders
if (sessionType == 1) {
	blockFolders =  ["F0/", "F0/","F0.5/","F1.5/"];
}
else {
	blockFolders =  ["F0/", "F0/","F1/","F2/"];
}

var normalTrials = arrayFromToplusName(1,60, 'N');
var obviousTrials = arrayFromToplusName(1,20, 'AC');
var subtleTrials = arrayFromToplusName(1,20, 'AD');
var priorTrials = arrayFromToplusName(1,20, 'AP');
var allTrials = normalTrials.concat(obviousTrials);
allTrials = allTrials.concat(subtleTrials);
allTrials = allTrials.concat(priorTrials);

//Get image sources based on trial information
var maskLeft, maskRight, mammoLeft, mammoRight;
function setImageNames() {
	mammoLeft = "images/" + blockFolders[blockOrder[blockCounter]] + allTrials[trialCounter] + "_L.png";
	mammoRight = "images/" + blockFolders[blockOrder[blockCounter]] + allTrials[trialCounter] + "_R.png";
	maskLeft = "images/Mask/" + allTrials[trialCounter] + "_ml.png";
	maskRight = "images/Mask/" + allTrials[trialCounter] + "_mr.png";
	
}
//Display instructions until 'next' button is clicked
function instructionsNext() {
	document.getElementById("welcomeHeader").style.display = 'none';
	document.getElementById("welcomeInstructions").style.display = 'none';
	document.getElementById("instructionsButton").style.display = 'none';
	document.getElementById("diagonalInstructions").style.visibility = 'visible';
	document.getElementById("resolutionInfoForm").style.visibility = 'visible';
}

//Wait for input of diagonal, then calculate image size in pixels from resolution and diameter and set image size, then display participant form
function imagePixels() {
	var diagonalcm, unit;
	diagonalcm = document.getElementById("diagonalInput").value;
	unit = document.getElementById("diagonalunit").value;
	if (unit == "inch") {
		diagonalcm = diagonalcm * 2.54;
	}
	var screenHeightpx = screen.width;
	var screenWidthpx = screen.height;
	var screenDiagonalpx = Math.sqrt((Math.pow(screenHeightpx, 2) + Math.pow(screenWidthpx, 2)));
	var pixelspercm= screenDiagonalpx/diagonalcm;
	var imagepixelsize = Math.round(17.5 * pixelspercm);
	//set image size to calculated pixels but keep images hidden
	document.getElementById("breastImageLeft").style = "width:"+imagepixelsize+"px;height:"+imagepixelsize+"px;visibility:hidden";
	document.getElementById("breastImageRight").style = "width:"+imagepixelsize+"px;height:"+imagepixelsize+"px;visibility:hidden";
	
	//trying to set fixationcross textbox to double size to center cross
	//document.getElementById("fixationCross").style= "width:"+2*imagepixelsize+"px;height:"+imagepixelsize+"px;visibility:hidden";

	document.getElementById("userinfoForm").style.visibility = "visible";
	document.getElementById("userInfoInstructions").style.visibility = "visible";
}

//Participant info form validation
//Check for gender fill does not work yet 
function validateForm() {
	if (document.forms["userinfoForm"]["InitialsInput"].value == "") {
    alert("Initials must be filled out");
    return false;
	  }
	if (document.forms["userinfoForm"]["male"].checked || document.forms["userinfoForm"]["female"].checked ||document.forms["userinfoForm"]["other"].checked == 1) {
	submitForm();
	return true;
  }
	if (document.forms["userinfoForm"]["AgeInput"].value == "") {
		alert("Age must be filled out");
    return false;
  }
      alert("Gender must be filled out");
}
//Participant info form submitting
function submitForm() {
	document.getElementById("diagonalInstructions").style.display = 'none';
	document.getElementById("resolutionInfoForm").style.display = 'none';
	document.getElementById("userinfoForm").style.display = 'none';
	document.getElementById("breastImageLeft").style.visibility = 'visible';
	document.getElementById("breastImageRight").style.visibility = 'visible';
	document.getElementById("userInfoInstructions").style.display = 'none';
	
	//Start the first trial when the form is submitted
	randomizeOrder(allTrials);
	setImageNames()
	runTrial()
}


function showFixationCross() {
	document.getElementById("fixationCross").style.display = 'inline';
}
//Set images to visible on display
function showImages() {
	document.getElementById("fixationCross").style.display = 'none';
	document.getElementById("breastImageLeft").src = mammoLeft;
	document.getElementById("breastImageRight").src = mammoRight;
	document.getElementById("breastImageLeft").style.display = 'inline';
	document.getElementById("breastImageRight").style.display = 'inline';
}

// Change image sources to masks
function flashMasks() {
	document.getElementById("breastImageLeft").src = maskLeft;
	document.getElementById("breastImageRight").src = maskRight;
}

// Set images to invisible again
function hideImages() {
	document.getElementById("breastImageLeft").style.display = 'none';
	document.getElementById("breastImageRight").style.display = 'none';
}

// Now make slider and rating instructions visible
function showSlider() {
	document.getElementById("mammoRating").style.visibility = 'visible';
	document.getElementById("currentMammo").style.visibility = 'visible';
	document.getElementById("ratingForm").style.visibility = 'visible';
	document.getElementById("ratingSubmit").style.visibility = 'visible';
	timeShowSlider = Date.now();

}

// Hide slider
function hideSlider() {
	timeSubmitSlider = Date.now();
	reactionTime = timeSubmitSlider - timeShowSlider;
	document.getElementById("mammoRating").style.visibility = 'hidden';
	document.getElementById("currentMammo").style.visibility = 'hidden';
	document.getElementById("ratingForm").style.visibility = 'hidden';
	document.getElementById("ratingSubmit").style.visibility = 'hidden';
	
	//saving data 
	ratingScore = parseInt(document.getElementById("currentMammo").value)
	if (trialCounter < 10) {
		// reset slider values
		document.getElementById("mammoRating").value = 50;
		document.getElementById("currentMammo").innerHTML = 50;
		// start new trial
		setImageNames()
		runTrial();
	}
	else if (blockCounter < 3) {
		//start new block 
		blockCounter++
		trialCounter = 0
		// reset slider values
		document.getElementById("mammoRating").value = 50;
		document.getElementById("currentMammo").innerHTML = 50;
		// start new trial
		setImageNames()
		runTrial();
	}
	else {
		// show end text
		document.getElementById("endText").innerHTML = "The end. Thank you for your time";
		// save data??
	}
	
}

function runTrial() {
	var counterval = trialCounter + 1;
	document.getElementById("counter").innerHTML = "Block" + blockCounter + " Trial " + counterval + " Previous RT" + reactionTime;
	setTimeout(showFixationCross,0)
	setTimeout(showImages,1000);
	setTimeout(flashMasks, 2000);
	setTimeout(hideImages, 3000);
	setTimeout(showSlider, 3001);
	trialCounter = trialCounter + 1;
}

// Slider for ratings
var slider = document.getElementById("mammoRating");
var output = document.getElementById("currentMammo");

// Update the current slider value (each time you drag the slider handle)
function ratingUpdate() {
	var slider = document.getElementById("mammoRating");
	var output = document.getElementById("currentMammo");
	output.value = parseInt(slider.value); 
}

//Functionalities: These are mathematical functions etc that are used to provide a calculation, randomization etc
//They are used throughout the code but collected here to keep the main code clutter-free
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function arrayFromTo(lowEnd, highEnd) {
   var arr = []
   while(lowEnd <= highEnd){
   arr.push(lowEnd++);
	}
	return arr
}

function arrayFromToplusName(lowEnd, highEnd, name) {
   var arr = []
   while(lowEnd <= highEnd){
		var num = lowEnd;
		arr.push(name+parseInt(num++));
		lowEnd++
   }
	return arr
}

//Calling this function randomizes the order of an array
function randomizeOrder(array) {
	array.sort(function(a, b){return 0.5 - Math.random()});
}	

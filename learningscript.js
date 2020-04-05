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

*/
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
	document.getElementById("breastImageLeft").style = "width:"+imagepixelsize+"px;height:"+imagepixelsize+"px;visibility:hidden";
	document.getElementById("breastImageRight").style = "width:"+imagepixelsize+"px;height:"+imagepixelsize+"px;visibility:hidden";
	document.getElementById("userinfoForm").style.visibility = "visible";
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

function submitForm() {
	document.getElementById("diagonalInstructions").style.display = 'none';
	document.getElementById("resolutionInfoForm").style.display = 'none';
	document.getElementById("userinfoForm").style.display = 'none';
	document.getElementById("breastImageLeft").style.visibility = 'visible';
	document.getElementById("breastImageRight").style.visibility = 'visible';
	runTrials()
}


function hideImages() {
	document.getElementById("breastImageLeft").style.display = 'none';
	document.getElementById("breastImageRight").style.display = 'none';
}

function flashImages() {
	document.getElementById("breastImageLeft").style.display = 'inline';
	document.getElementById("breastImageRight").style.display = 'inline';
}

function showSlider() {
	document.getElementById("mammoRating").style.visibility = 'visible';
	document.getElementById("currentMammo").style.visibility = 'visible';
	document.getElementById("ratingForm").style.visibility = 'visible';
		document.getElementById("ratingSubmit").style.visibility = 'visible';

}

function hideSlider() {
	document.getElementById("mammoRating").style.visibility = 'hidden';
	document.getElementById("currentMammo").style.visibility = 'hidden';
	document.getElementById("ratingForm").style.visibility = 'hidden';
	document.getElementById("ratingSubmit").style.visibility = 'hidden';
}

function runTrial() {
	flashImages()
	setTimeout(hideImages, 2000);
	setTimeout(showSlider, 2010);
	setTimeout(hideSlider, 1010);
	var rating = parseInt(document.getElementById("currentMammo").value)
	return rating
}

function runTrials() {
	for (i = 0; i < 10; i++) {
	flipImages();
	runTrial();
	document.getElementById("counter").innerHTML = i;
	}
	
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


var beginbutton = document.getElementById("beginButton");
var beginoutput = document.getElementById("BeginButtonEffect");
function displayDate() {
  var beginoutput = document.getElementById("BeginButtonEffect");
  var d = new Date()
  beginoutput.innerHTML = d.getTime();
}

function flipImages() {
	var imageNameL = "images/lokidoki2.jpg";
	var	imageNameR = "images/lokidoki2.jpg";
	var currentLeft = document.getElementById("breastImageLeft").src;
	if (currentLeft.includes("images/lokidoki2.jpg")) {
		imageNameR = "images/lokidoki2.jpg";
		imageNameL = "images/lokidoki.png";
	document.getElementById("breastImageLeft").src = imageNameL;
	document.getElementById("breastImageRight").src = imageNameR;
	} 	else {
		imageNameL = "images/lokidoki2.jpg";
		imageNameR = "images/lokidoki.png";
		document.getElementById("breastImageLeft").src = imageNameL;
		document.getElementById("breastImageRight").src = imageNameR;
	}
}

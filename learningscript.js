//Counters
var trialCounter = 0;
var blockCounter = 0; //start with practice block
var overallCounter = 1;
var blockTrials


//Outcome variables
var timeShowSlider;
var timeSubmitSlider;
var reactionTime = 0;
var ratingScore;
var data = [];

//Image info
var imageType = ["N", "AD", "AC", "AP"];
var images = []; //for preloading

//Arrays for image order randomization within a block
/*var normalTrials = arrayFromToplusName(1,60, 'N');
var obviousTrials = arrayFromToplusName(1,20, 'AC');
var subtleTrials = arrayFromToplusName(1,20, 'AD');
var priorTrials = arrayFromToplusName(1,20, 'AP');*/

var normalTrials = arrayFromToplusName(1, 6, 'N');
var obviousTrials = arrayFromToplusName(1, 2, 'AC');
var subtleTrials = arrayFromToplusName(1, 2, 'AD');
var priorTrials = arrayFromToplusName(1, 2, 'AP');

var allTrials = normalTrials.concat(obviousTrials);
allTrials = allTrials.concat(subtleTrials);
allTrials = allTrials.concat(priorTrials);
practiceTrials = ["N63", "AC1", "AP3"]; //predefined practice trials
feedback = ['normal', 'cancerous', 'cancerous']; //their feedback

//SETTING IMAGE NAMES
//Get image sources based on trial information
var maskLeft, maskRight, mammoLeft, mammoRight;
function setImageNames() {
    mammoLeft = "images/" + this.folderOrder[blockCounter] + "/" + this.blockTrials[trialCounter] + "_Lnew.png";
    mammoRight = "images/" + this.folderOrder[blockCounter] + "/" + this.blockTrials[trialCounter] + "_Rnew.png";
    maskLeft = "images/Mask/" + this.blockTrials[trialCounter] + "_mlnew.png";
    maskRight = "images/Mask/" + this.blockTrials[trialCounter] + "_mrnew.png";
}

//PRELOADING SET IMAGE NAMES
function preLoadImages() {
    preload(mammoLeft, mammoRight, maskLeft, maskRight)
    //send messages to log
    console.log('loading images');
    images[3].onload = console.log('loaded mask right');
}

//From here down the actual order of operations is defined: instructions are shown, then screen info is put in and participant info is collected, then trials start and loop automatically
//FIRST INTRO TEXT ACCEPT
function introNext_First() {
    document.getElementById("experimentIntroStart").style.display = 'none';
    document.getElementById("nextButton_1").style.display = 'none';
	
    document.getElementById("experimentIntro").style.display = 'block';
    document.getElementById("nextButton_2").style.display = 'block';
}

//SECOND INTRO TEXT ACCEPT
function introNext_Second() {
    document.getElementById("experimentIntro").style.display = 'none';
    document.getElementById("nextButton_2").style.display = 'none';
	
    document.getElementById("consentInstructions").style.display = 'block';
    document.getElementById("consentButton").style.display = 'block';
}

var elem = document.documentElement;

//CONSENT TEXT ACCEPT
function consentClick() {
    openFullscreen()
    document.getElementById("consentHeader").style.display = 'none';
    document.getElementById("consentInstructions").style.display = 'none';
    document.getElementById("consentButton").style.display = 'none';

    //Show exact diagonal options and instructions
    document.getElementById("diagonalInstructions").style.display = 'block';
    document.getElementById("resolutionInfoForm").style.display = 'block';

    //Show the credit card scaler
    document.getElementById("card").style.display = 'block';
    document.getElementById("diagonalHeader").style.display = 'block';
    document.getElementById("monitorInstructions").style.display = 'block';
    document.getElementById("cardForm").style.display = 'table';
    document.getElementById("cardScale").style.display = 'inline';
    document.getElementById("cardScaleSubmit").style.display = 'inline';
}

//CARD SIZE SLIDER ACCEPT
var cardWidth, pixelsize;
function calculatePixelSize() {
    cardWidth = document.getElementById("card").width;
    pixelsize = cardWidth / 8.560; //size of a pixel in cm
    this.imagepixelsize = Math.round(17.5 * pixelsize);

    var screenHeightpx = screen.width;
    var screenWidthpx = screen.height;
    this.dimensions = screenWidthpx + "x" + screenHeightpx;
	
	var screenDiagonalpx = Math.sqrt((Math.pow(screenHeightpx, 2) + Math.pow(screenWidthpx, 2)));
	this.diagonalcm = screenDiagonalpx/pixelsize;
	
	
	//check if size is enough, if not repeat the process with warning
    if (screen.width < (this.imagepixelsize * 2)) {
        alert("This screen is not suitable for the experiment, please use a different monitor");
		
		document.getElementById("diagonalInstructions").innerHTML = 'According to the calibrations, this screen is not suitable for the experiment.<br> It is either too small or the resolution is too low.<br>'+
		'Change to a different screen with a higher size or resolution - or try to redo the calibration if you made a mistake.';		
    }
	else {
		//set image size to calculated pixels but keep images hidden
		document.getElementById("breastImageLeft").style = "width:"+imagepixelsize+"px;height:"+imagepixelsize+"px;display:none";
		document.getElementById("breastImageRight").style = "width:"+imagepixelsize+"px;height:"+imagepixelsize+"px;display:none";
		document.getElementById("fixationcross").style = "width:"+imagepixelsize*2+"px;height:"+imagepixelsize+"px;display:none";

		//Hide all diagonal instructions
		document.getElementById("diagonalInstructions").style.display = 'none';
		document.getElementById("resolutionInfoForm").style.display = 'none';
		document.getElementById("card").style.display = 'none';
		document.getElementById("diagonalHeader").style.display = 'none';
		document.getElementById("monitorInstructions").style.display = 'none';
		document.getElementById("cardForm").style.display = 'none';
		document.getElementById("cardScale").style.display = 'none';
		document.getElementById("cardScaleSubmit").style.display = 'none';
		document.getElementById("userinfoForm").style.display = 'none';
		document.getElementById("userInfoInstructions").style.display = 'none';
		
		//show user info form
		document.getElementById("userinfoForm").style.display = 'block';
		document.getElementById("userInfoInstructions").style.display = 'block';
	}
}

//DIAGONAL EXACT INPUT ACCEPT
//Wait for input of diagonal, then calculate image size in pixels from resolution and diameter and set image size, then display participant form
var dimensions, diagonalcm, unit, imagepixelsize;
//CHECK INPUT FORM
function validateDiagonalForm() {
    if (!isNaN(document.forms["resolutionInfoForm"]["diagonalInput"].value) && document.forms["resolutionInfoForm"]["diagonalInput"].value != "") {
        imagePixels()
        return true;
    }
    alert("Diagonal must be a number");
    return false
}
//CALCULATE
function imagePixels() {
    this.diagonalcm = document.getElementById("diagonalInput").value;
    unit = document.getElementById("diagonalunit").value;
    if (unit == "inch") {
        this.diagonalcm = diagonalcm * 2.54;
    }
    var screenHeightpx = screen.width;
    var screenWidthpx = screen.height;
    this.dimensions = screenWidthpx + "x" + screenHeightpx;
	
    var screenDiagonalpx = Math.sqrt((Math.pow(screenHeightpx, 2) + Math.pow(screenWidthpx, 2)));
    var pixelspercm = screenDiagonalpx / diagonalcm;
    this.imagepixelsize = Math.round(17.5 * pixelspercm);

	//check if size is enough, if not repeat process with warning
    if (screen.width < (this.imagepixelsize * 2)) {
        alert("This screen is not suitable for the experiment, please use a different monitor");
		
		document.getElementById("diagonalInstructions").innerHTML = 'According to the calibrations, this screen is not suitable for the experiment.<br> It is either too small or the resolution is too low.<br>'+
		'Change to a different screen with a higher size or resolution - or try to redo the calibration if you made a mistake.';		
    }
	else {
		//set image size to calculated pixels but keep images hidden
		document.getElementById("breastImageLeft").style = "width:" + imagepixelsize + "px;height:" + imagepixelsize + "px;display:none";
		document.getElementById("breastImageRight").style = "width:" + imagepixelsize + "px;height:" + imagepixelsize + "px;display:none";
		document.getElementById("fixationcross").style = "width:" + imagepixelsize * 2 + "px;height:" + imagepixelsize + "px;display:none";

		//Hide all diagonal instructions
		document.getElementById("diagonalInstructions").style.display = 'none';
		document.getElementById("resolutionInfoForm").style.display = 'none';
		document.getElementById("card").style.display = 'none';
		document.getElementById("diagonalHeader").style.display = 'none';
		document.getElementById("monitorInstructions").style.display = 'none';
		document.getElementById("cardForm").style.display = 'none';
		document.getElementById("cardScale").style.display = 'none';
		document.getElementById("cardScaleSubmit").style.display = 'none';
		document.getElementById("userinfoForm").style.display = 'none';
		document.getElementById("userInfoInstructions").style.display = 'none';

		//show user info form
		document.getElementById("userinfoForm").style.display = 'block';
		document.getElementById("userInfoInstructions").style.display = 'block';
	}
}

//DEMOGRAPHICS FORM VALIDATION
function validateForm() {
    if (document.forms["userinfoForm"]["InitialsInput"].value == "") {
        alert("Initials must be filled out");
        return false;
    }
    if (document.forms["userinfoForm"]["AgeInput"].value == "") {
        alert("Age must be filled out");
        return false;
    }
    if (document.forms["userinfoForm"]["yearsPractice"].value == "") {
        alert("Years in practice must be filled out.<br>If you are unsure, enter your best estimate.");
        return false;
    }
    if (document.forms["userinfoForm"]["caseNumber"].value == "") {
        alert("Number of cases must be filled out. If you are unsure, enter your best estimate.");
        return false;
    }
    if (document.forms["userinfoForm"]["percentageMammo"].value == "") {
        alert("Percentage of cases must be filled out. If you are unsure, enter your best estimate.");
        return false;
    }
    if (document.forms["userinfoForm"]["male"].checked || document.forms["userinfoForm"]["female"].checked || document.forms["userinfoForm"]["other"].checked == 1) {
        submitForm();
        return true;
    }
    alert("Gender must be filled out");
}

//SERVER INFORMATION
var serverUrl = "http://ec2-3-89-85-30.compute-1.amazonaws.com:5000"
//var serverUrl = "https://localhost:5000"

var age, gender, initials, percentMammo, yearsInPractice, yearlyCases;
var participantData, sessiondata, uuid, folderOrder, blocks, completeExperiment;
blocks = ["F0"]
//SUBMIT DEMOGRAPHICS FORM AND LOAD SESSION INFO FROM SERVER
function submitForm() {
    age = document.forms["userinfoForm"]["AgeInput"].value;
    initials = document.forms["userinfoForm"]["InitialsInput"].value;
    percentMammo = document.forms["userinfoForm"]["percentageMammo"].value;
    yearsInPractice = document.forms["userinfoForm"]["yearsPractice"].value;
    yearlyCases = document.forms["userinfoForm"]["caseNumber"].value;
    if (document.forms["userinfoForm"]["male"].checked) {
        gender = 'M';
    } else if (document.forms["userinfoForm"]["female"].checked) {
        gender = 'F';
    } else {
        gender = 'O';
    }

    participantData = {
        "initials": initials,
        "age": age,
        "gender": gender,
        "percentMammo": percentMammo,
        "yearsExperience": yearsInPractice,
        "casesPerYear": yearlyCases,
        "screenSizeCm": this.diagonalcm,
        "imagePixels": this.imagepixelsize,
        "screenDimensions": this.dimensions
    };

    //Retrieve session order of blocks and create a new session in database with uuid
    //Also save the demographics to a sessionInfo instance.
    fetch(this.serverUrl + "/session/create", {
        method: 'POST',
        body: JSON.stringify(participantData),
    })
    .then((response) => {
        if (response.status !== 200) {
            console.log(response.status)
            console.log(response.json())
        } else {
            response.json()
            .then((sessiondata) => {
                console.log('Success:', sessiondata);
                this.uuid = sessiondata["uuid"]
				this.folderOrder = sessiondata["order"]
				this.folderOrder.unshift("F0")
				
				//instructions
				document.getElementById("welcomeHeader").style.display = 'block';
				document.getElementById("welcomeInstructions").style.display = 'block';
				document.getElementById("instructionsButton").style.display = 'block';
            })
        }
    })
    .catch((error) => {
        console.error('Error:', error);
		//error report
        alert('The experiment web server is currently experiencing issues, please check again later or send an email to emr554@york.ac.uk if the issue persists.')
		document.getElementById("welcomeInstructions").innerHTML = 'The experiment web server is currently experiencing issues, please check again later or send an email to emr554@york.ac.uk if the issue persists.<br>'+
		'Do not continue the experiment.<br>Our apologies for the inconvenience.';
		document.getElementById("instructionsButton"). innerHTML = 'Do not continue';
		document.getElementById("welcomeHeader").style.display = 'block';
		document.getElementById("welcomeInstructions").style.display = 'block';
		try {
			closeFullscreen();
		} catch (error) {
			console.log('Error:', error);
		}
    });

    document.getElementById("diagonalInstructions").style.display = 'none';
    document.getElementById("resolutionInfoForm").style.display = 'none';
    document.getElementById("userinfoForm").style.display = 'none';
    document.getElementById("userInfoInstructions").style.display = 'none';
}

//EXPERIMENT INSTRUCTIONS
//Display instructions until 'next' button is clicked
function instructionsNext() {
    //set the trials for the practice block and preload the images for the first trial to avoid loading times
    this.blockTrials = practiceTrials;
    setImageNames()
    preLoadImages()

    document.getElementById("welcomeHeader").style.display = 'none';
    document.getElementById("welcomeInstructions").style.display = 'none';
    document.getElementById("instructionsButton").style.display = 'none';

    var readyToStarttxt = "<br><br>You are ready to begin the experiment.<br> The experiment will start with 3 practice trials to familiarize you with the procedure.<br>" +
        "Then, there will be 3 testing blocks of 120 trials each.<br>" +
        "In the practice trials, you will get feedback on the type of trial (normal/cancerous), in the test trials there will be no feedback.<br><br>" +
        "Make sure that you are in a quiet environment, where you can focus on the task.<br> Try to make sure you will not be disturbed for the time the experiment takes (approximately 30 minutes).<br>" +
        "If you need to take a break in between trials, rate the current trial, then submit this rating <u>when you are ready to continue</u>.<br><br>" +
        "Sit in a comfortable position with your back straight and keep a distance of approximately 50 cm/20 inches from the screen.<br>" +
        "When you are ready, press the button and look at the center of the screen.<br>The first practice trial will start automatically.";

    document.getElementById("blockText").innerHTML = readyToStarttxt;
    document.getElementById("blockButton").innerHTML = 'Begin experiment';
    document.getElementById("blockText").style.display = 'block';
    document.getElementById("blockButton").style.display = 'block';
	
	try {
		openFullscreen()
	} 
	catch (error) {
		console.log('Error:', error);
	}
}

//RUN TRIAL SCHEDULING ALL EVENTS
function runTrial() {
    var counterval = trialCounter + 1;
    document.getElementById("counter").innerHTML = "Block " + blockCounter + " Trial " + counterval;
    setTimeout(showFixationCross, 0)
    setTimeout(showImages, 300);
    setTimeout(flashMasks, 800);
    setTimeout(hideImages, 1100);
    setTimeout(showSlider, 1101);

    overallCounter++
}

//SAVE TRIAL INFO TO LOCAL DATA
function saveTrial() {
    var trialInfo = {}
    trialInfo.block = this.folderOrder[blockCounter];
    trialInfo.trialnum = trialCounter + 1;
    trialInfo.imagenum = this.blockTrials[trialCounter]; ;
    trialInfo.rating = ratingScore;
    trialInfo.rt = reactionTime;
    this.data.push(trialInfo);
}

function showFixationCross() {
    document.getElementById("fixationcross").style.display = 'inline'
        document.getElementById("breastImageLeft").src = mammoLeft;
    document.getElementById("breastImageRight").src = mammoRight;
}

//Set images to visible on display
function showImages() {
    document.getElementById("fixationcross").style.display = 'none';
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
    document.getElementById("linebreaksForRating").style.display = 'block';
    document.getElementById("mammoRating").style.display = 'inline';
    document.getElementById("currentMammo").style.display = 'inline';
    document.getElementById("ratingForm").style.display = 'table';
    document.getElementById("ratingSubmit").style.display = 'block';
    timeShowSlider = Date.now();
    setImageNames()
    preLoadImages(); //preload here so its ready when rating is submitted
    document.addEventListener('keypress', function spacebarPress(e) {
        if (e.keyCode == 32) {
            document.removeEventListener('keypress', spacebarPress, false)
            hideSlider()
        }
    }, false);

}

//HIDE SLIDER, CALL SAVE DATA AND CHECK IF NEXT TRIAL IS STILL THE SAME BLOCK. ALSO PROVIDES FEEDBACK ON PRACTICE
function hideSlider() {
    //saving data
    timeSubmitSlider = Date.now();
    reactionTime = timeSubmitSlider - timeShowSlider;
    ratingScore = parseInt(document.getElementById("mammoRating").value)
        saveTrial()
        trialCounter = trialCounter + 1;

    //make slider invisible
    document.getElementById("linebreaksForRating").style.display = 'none';
    document.getElementById("mammoRating").style.display = 'none';
    document.getElementById("currentMammo").style.display = 'none';
    document.getElementById("ratingForm").style.display = 'none';
    document.getElementById("ratingSubmit").style.display = 'none';

    //decide next trial

    //If block 0 = Practice trial, display feedback before continuing
    if (blockCounter == 0 && trialCounter < this.blockTrials.length) {
        //practice trials
        // reset slider values
        document.getElementById("mammoRating").value = 50;
        document.getElementById("currentMammo").innerHTML = 50;
        var feedbacktxt
        //show feedback text
        if (feedback[trialCounter - 1] == 'normal') {
            feedbacktxt = "This case did not contain any cancerous abnormalities. Click next to continue when you are ready."
        } else {
            feedbacktxt = "This case contained at least one cancerous abnormality. Click next to continue when you are ready."
        }
        document.getElementById("linebreaksForRating").style.display = 'block';
        document.getElementById("blockText").innerHTML = feedbacktxt;
        document.getElementById("blockButton").innerHTML = 'Next trial';
        document.getElementById("blockText").style.display = 'block';
        document.getElementById("blockButton").style.display = 'block';
    } else {
        if (trialCounter < this.blockTrials.length) {
            // reset slider values
            document.getElementById("mammoRating").value = 50;
            document.getElementById("currentMammo").innerHTML = 50;
            // start new trial
            runTrial()
        } else if (blockCounter < 3 && trialCounter == this.blockTrials.length) {
            //start new block
            blockCounter++
            trialCounter = 0

                //shuffle image list
                blockTrials = allTrials;
            randomizeOrder(blockTrials);
            setImageNames()
            preLoadImages();

            // reset slider values
            document.getElementById("mammoRating").value = 50;
            document.getElementById("currentMammo").innerHTML = 50;

            //show block text
            var blocktxt = "You're about to start a new block of trials.\n Take a short break, then click next to continue when you are ready."
			if (blockCounter == 1) {
				// previous trial was still part of practice block, so combine feedback message and next block message
				// display feedback of previous last practice trial
				if (feedback[feedback.length - 1] == 'normal') {
					blocktxt = "This case did not contain any cancerous abnormalities.\n This was the last practice trial. Click next to continue to the first test block."
				} else {
					blocktxt = "This case contained at least one cancerous abnormality.\n This was the last practice trial. Click next to continue to the first test block."
				}
			}
			document.getElementById("linebreaksForRating").style.display = 'block';
            document.getElementById("blockText").innerHTML = blocktxt;
            document.getElementById("blockButton").innerHTML = 'Next block';
            document.getElementById("blockText").style.display = 'block';
            document.getElementById("blockButton").style.display = 'block';
        } else if (blockCounter == 3 && this.trialCounter == blockTrials.length) {

            // save data
            this.completeExperiment = {
                "uuid": this.uuid,
                "result": this.data
            };

            fetch(this.serverUrl + '/session/complete', {
                method: 'POST',
                body: JSON.stringify(completeExperiment),
            })
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
                // show end text
                document.getElementById("linebreaksForRating").style.display = 'block';
                document.getElementById("blockText").innerHTML = "The end. Thank you for your time.<br>You can now close this page.";
                document.getElementById("blockText").style.display = "block";
				
            })

            .catch((error) => {
                console.error('Error:', error);

                alert('Error: The experiment web server is currently experiencing issues and could not save your data. Instead, click the save  button to save the data on your own computer. Please email this file to emr554@york.ac.uk.')

                //implement a local saving or something to save the data
                document.getElementById("blockText").innerHTML = "This is the end of the experiment.<br> However, there seems to be an issue with the experiment server, so we could not save your data.<br> Sorry for the inconvenience.<br>Please click this save button to save your results locally to your computer, so they aren't lost.<br> This will create a experimentResults.txt file.<br>Please send this file to emr554@york.ac.uk so your results can be included in the analysis.<br>Again, our apologies for the inconvenience and thank you for your time.\n";
                document.getElementById("blockText").style.display = "block";
                document.getElementById("savefile").style.display = "block";

            });
			try {
				closeFullscreen();
			} catch (error) {
				console.log('Error:', error);
			}
        }
    }

}

function startNewBlock() {
    //remove block text and button
    document.getElementById("linebreaksForRating").style.display = 'none';
    document.getElementById("blockText").style.display = 'none';
    document.getElementById("blockButton").style.display = 'none';
    // start new trial
    runTrial()
}

//Slider functionality
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
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function arrayFromTo(lowEnd, highEnd) {
    var arr = [];
	while (lowEnd <= highEnd) {
        arr.push(lowEnd++);
    }
    return arr
}

function arrayFromToplusName(lowEnd, highEnd, name) {
    var arr = [];
	while (lowEnd <= highEnd) {
        var num = lowEnd;
        arr.push(name + parseInt(num++));
        lowEnd++
    }
    return arr
}

//Calling this function randomizes the order of an array
function randomizeOrder(array) {
    array.sort(function (a, b) {
        return 0.5 - Math.random()
    });
}

//preload for any amount of image links
function preload() {
    for (var i = 0; i < arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i];
    }
}

function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

/* Close fullscreen */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
}

//CREDITCARD SLIDER UPDATING
// Update the current slider value (each time you drag the slider handle)
function scaleImage() {
    var value = document.getElementById("cardScale").value
        document.getElementById("card").style = "width:" + value + "%;height:" + value + "%"
}


//BACKUP IN CASE SERVER IS NOT AVAILABLE FOR SAVING
function saveDataLocally() {
this.completeExperiment = {
"uuid": this.uuid,
"result": this.data
};
input = JSON.stringify(completeExperiment);
saveData(input, "experimentResults.txt");
}

function saveData(data, fileName) {
var a = document.createElement("a");
document.body.appendChild(a);
a.style = "display: none";

var json = JSON.stringify(data),
blob = new Blob([data], {type: "text/plain;charset=utf-8"}),
url = window.URL.createObjectURL(blob);
a.href = url;
a.download = fileName;
a.click();
window.URL.revokeObjectURL(url);
}
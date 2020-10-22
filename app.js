// determines the number of squares displayed//
var numSquares = 6;
// makes up which are to be chosen for the squares//
var colors = [];
//shows what colors were picked for the squares//
var pickedColor;
// selects all squares to be modify//
var squares = document.querySelectorAll(".square");
//displays the colors for the squares//
var colorDisplay = document.getElementById("colorDisplay");
//displays messages from html and css file//
var messageDisplay = document.querySelector("#message");
//displays header from html and css file//
var h1 = document.querySelector("h1");
//displays play/try again buttons//
var resetButton = document.querySelector("#reset");
//displays easy and hard buttons//
var modeButtons = document.querySelectorAll(".mode");
//determines what the score is at the moment//
var score = 0; 
//displays score//
var scoreDisplay = document.querySelector("#scoreDisplay"); 
//determines whether or not the player has hit play/try again//
var resetPressed = true; 


init();
//displays and saves score//
function init(){
	setupModeButtons();
	setupSquares();
	var lsScore = sessionStorage.getItem('score');
	if( lsScore !== null ){
		score = lsScore; 
		scoreDisplay.textContent = score;
	}
	else {
		sessionStorage.setItem('score', score); 
	}
	reset();
}
//shows the difficulties and determines how many squares are displayed based on difficulty picked//
function setupModeButtons(){
	for(var i = 0; i < modeButtons.length; i++){
		modeButtons[i].addEventListener("click", function(){
			modeButtons[0].classList.remove("selected");
			modeButtons[1].classList.remove("selected");
			this.classList.add("selected");
			this.textContent === "Easy" ? numSquares = 3: numSquares = 6;
			reset();
		});
	}
}
// determines which colored square is correct, if it is the player gets 5 points and is presented correct! and play again? If the player clicks the wrong option then they lose a point and are presented with a try again? button//
function setupSquares(){
	for(var i = 0; i < squares.length; i++){
	//add click listeners to squares
		squares[i].addEventListener("click", function(){
			//grab color of clicked square
			var clickedColor = this.style.background;
			//compare color to pickedColor
			if(clickedColor === pickedColor){ 
				updateColorName();
				//console.log(colorName);
				messageDisplay.textContent = "Correct!";
				resetButton.textContent = "Play Again?"
				changeColors(clickedColor);
				h1.style.background = clickedColor;
				if(resetPressed){
					score+=5; 
					resetPressed = false;
				}
				scoreDisplay.textContent = score;
				sessionStorage.setItem('score', score);
			} else {
				this.style.background = "#232323";
				messageDisplay.textContent = "Try Again"
				score--;
				scoreDisplay.textContent = score; 
				sessionStorage.setItem('score', score);
			}
		});
	}
}

// determines the name and color of the question asked//
async function updateColorName(){
	const regex = /\([^\)]+\)/g; 
	var rgbColors = pickedColor.match(regex); 
	const url = "https://www.thecolorapi.com/id?rgb="+rgbColors[0];
	var requestOptions = {
	  method: 'GET',
	  redirect: 'follow'
	};

	let result = await fetch(url, requestOptions); 
	let colorData = await result.json(); 
//determines if the color name displayed is an exact or has an -ish at the end of it//
	if(colorData.name.exact_match_name) {
		colorDisplay.textContent = colorData.name.value; 
	}
	else {
		colorDisplay.textContent = colorData.name.value + "-ish"; 
	}
}
//resets the webpage and displays new colors for the squares//
function reset(){
	resetPressed = true;
	colors = generateRandomColors(numSquares);
	//pick a new random color from array
	pickedColor = pickColor();
	//change colorDisplay to match picked Color
	colorDisplay.textContent = pickedColor;
	resetButton.textContent = "New Colors"
	messageDisplay.textContent = "";
	//change colors of squares
	for(var i = 0; i < squares.length; i++){
		if(colors[i]){
			squares[i].style.display = "block"
			squares[i].style.background = colors[i];
		} else {
			squares[i].style.display = "none";
		}
	}
	h1.style.background = "steelblue";
}
// plays noise whenever a square is clicked//
resetButton.addEventListener("click", function(){
	reset();
})
//changes colors of squares as well as background to match correct square//
function changeColors(color){
	//loop through all squares
	for(var i = 0; i < squares.length; i++){
		//change each color to match given color
		squares[i].style.background = color;
	}
}
// picks colors to be displayed on squares on background//
function pickColor(){
	var random = Math.floor(Math.random() * colors.length);
	return colors[random];
}
// creates random colors to be picked//
function generateRandomColors(num){
	//make an array
	var arr = []
	//repeat num times
	for(var i = 0; i < num; i++){
		//get random color and push into arr
		arr.push(randomColor())
	}
	//return that array
	return arr;
}
//determines the exact color number//
function randomColor(){
	//pick a "red" from 0 - 255
	var r = Math.floor(Math.random() * 256);
	//pick a "green" from  0 -255
	var g = Math.floor(Math.random() * 256);
	//pick a "blue" from  0 -255
	var b = Math.floor(Math.random() * 256);
	return "rgb(" + r + ", " + g + ", " + b + ")";
}
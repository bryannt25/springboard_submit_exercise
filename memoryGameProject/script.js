//html elements initialized through DOM query selector.
const gameContainer = document.getElementById("game");
const scoreText = document.querySelector('#score-text');
const highScoreText = document.querySelector('#high-score-text');

const gameTitle = document.querySelector('h1');
const startBtn = document.querySelector('#start-btn');
const restartBtn = document.querySelector('#restart-btn');

//mysteryImage is set to unrevealed question mark image. 
const mysteryImage = 'url(imgs/question_mark.jpg)';
//array containing cardNames which also their file names.
const cardNames = [
  "barril",
  "cantarito",
  "luna",
  "pescado",
  "sol",

  "barril",
  "cantarito",
  "luna",
  "pescado",
  "sol"
];
//gameRunning boolean initialized for start logic.
let gameRunning  = false;
//integer set to amount of attempts to match cards.
let attempts = 0;
//highScore integer used to display best score in game.
let highScore = 0;
//savedScore is set to highScoreSave local storage. If there is none, value is set to null.
const savedScore = JSON.parse(localStorage.getItem("highScoreSave"));
//function that checks if savedScore exists, if it does, highScoreText is updated with savedScore.
loadHighScore(savedScore);
//scoreText is set to initial attempts (0);
scoreText.innerText = `Score: ${attempts}`;

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledCards= shuffle(cardNames);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForCards(cardArray) {
  for (let cardName of cardArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(cardName);
    newDiv.classList.add('game-card');
    

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

let cards; 
document.addEventListener("DOMContentLoaded",function(){
  createDivsForCards(shuffledCards);
  cards = gameContainer.querySelectorAll('div');
})

// lastCard keeps track of the previous card clicked to compare it with the clickedCard.
let lastCard;
//Integer that keeps track of how many cards selected.
let cardsSelected = 0;
//canClick is a boolean which is used as a limit to not click cards too quickly.
let canClick = true;

// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked

  //if game is not running, function exits.
  if (!gameRunning){
    //console.log('Game not running!');
    return;
  }
  //cardClicked is set to clicked element.
  const cardClicked = event.target;
  //cardName is set to the cardName className given from the cardNames array. (ex: luna).
  const cardName = cardClicked.classList[0];
  // checks if the cardName of cardClicked has not been set to 'completed'. 
  if(cardClicked.classList[0] != 'completed'){
      //checks if cardClicked is not the previously clickedCard, also checks if timeout has completed to allow another card click.
      if (cardClicked != lastCard && canClick == true){
        //delay implemented to limit clicking cards too fast.
        setTimeout(function(){
          canClick = true;
        },500);
        //canClick limit starts as soon as clicking on card.
        canClick = false;
        //debug to see card element:
        //console.log("you just clicked", event.target);
        //card is temporary revealed by changing background image to cardName which is the same text as the file name.
        cardClicked.style.backgroundImage = `url(imgs/loteriaCards/${cardName}.jpg)`;
        //checks if one card has already been selected and if its cardName matches the previous card (lastCard).
        if(cardsSelected > 0 && cardClicked.classList[0] == lastCard.classList[0]){
          //debug to see if card matched:
          //console.log('we got a match');
          //cardMatched function which takes the clicked card, previous card, and cardName of clicked card.
          cardMatched(cardClicked,lastCard,cardName);
          //cards selected reset to 0.
          cardsSelected = 0;
    
        }
        else{
          //if a card has been selected but it doesn't match:
          if (cardsSelected > 0){
            // delay that sets both clicked and last card background image to mystery image.
            setTimeout (function(){
              cardClicked.style.backgroundImage = mysteryImage;
              lastCard.style.backgroundImage = mysteryImage;
              //lastCard is reset to undefined.
              lastCard = undefined;
              //function is called to increase score.
              increaseScore();
            },500);
            //cardsSelected is reset.
            cardsSelected = 0;
            
          }
          else{
            //if no cards have been selected, cardsSelected is incremented and the clicked card is set to lastCard.
            cardsSelected++;
            lastCard = cardClicked;
          }

        }
    }
  }
 
}

//function when cards match:
function cardMatched(selectedCard, lastCard,cardName){
  //both selectedCard and lastCard get their cardName className replaced with 'completed'.
  selectedCard.classList.replace (cardName,'completed');
  lastCard.classList.replace (cardName,'completed');
  //delay which increases score and checks if all cards are completed.
  setTimeout(function(){
    // selectedCard.style.backgroundColor = cardColor;
    // lastCard.style.backgroundColor = cardColor;
    increaseScore();
    checkFinished();
  },500);
}



//DOM array which is set to all divs in gameContainer.

//console.log(cards);

function checkFinished(){
  //boolean that is set to the game being finished.
  let finished = false;
  //integer which checks how many cards have been completed.
  let cardsDone = 0;
  //loop that counts how many cards have the className 'completed'.
  for (let i =0;i<cards.length;i++){
    if(cards[i].classList[0] == 'completed'){
      cardsDone++;
    }
  }
  // debug to see how many cards completed: console.log(cardsDone);
  //if all cards are completed:
  if(cardsDone == cards.length){
    //finished is true.
    finished = true;
    //if there is currently no savedScore:
    if (savedScore == null){
      //highScore text element is set to amount of attempts.
      highScoreText.innerText = `Best Score: ${attempts}`;
      //attempts are saved as highScoreSave in local storage.
      localStorage.setItem('highScoreSave', JSON.stringify(attempts));
      //Title text is updated to show game completed, also that new best score has been set.
      gameTitle.innerText = 'Game Completed: New Best Score!';
    }
    //if there is a savedScore in local storage.
    else{
      //if attempts are less than savedScore, a new best has been set:
      if(attempts < savedScore){
        //highScoreText is updated with attempts 
        highScoreText.innerText = `Best Score: ${attempts}`;
        //attempts are saved as highScoreSave in local storage.
        localStorage.setItem('highScoreSave', JSON.stringify(attempts));
        //Title text is updated to show game completed, also that new best score has been set.
        gameTitle.innerText = 'Game Completed: New Best Score!';
      }
      //if no new best score is set:
      else if(attempts >= savedScore){
        //Title text is updated to show game completed
        gameTitle.innerText = 'Game Completed';
      }
    }
    //gameTitle opacity is visible again. (becomes invisible when start button is pressed).
    gameTitle.style.opacity = '100%';
    //debug to show game over:
    // console.log('game completed');
  }

  // else{
  //   //debug to show game not over:
  //    console.log('not done');
  // }
}

//function which updates the score.
function increaseScore(){
  //attempts are incremented
  attempts++;
  //scoreText is updated with attempts.
  scoreText.innerText = `Score: ${attempts}`;
}
//function which sets best score to savedScore if it exists.
function loadHighScore(savedScore){
  //if savedScore is empty
  if (savedScore == null){
    //highScore text is set to n/a.
    highScoreText.innerText += ' N/A';
  }
  else{
    //highScore is set to savedScore.s  
    highScore = savedScore;
    //highScoreText is updated with highScore.
    highScoreText.innerText += ` ${highScore}`;
  }
}

//event listener for start button:
startBtn.addEventListener('click',function(e){
  //if game is not running:
  if (!gameRunning){
    //start button opacity dropped to show game is running.
    startBtn.style.opacity = '10%';
    //gameRunning set to true.
    gameRunning = true;
    //gameTitle is set to invisible.
    gameTitle.style.opacity = '0%';
    
  }
})

//event listener for restart button
restartBtn.addEventListener('click',function(e){
  //page is reloaded
  location.reload();
  //requiered to finish page reload.
  return false;
})

// Outside sources: Fil from stackoverflow gave the simple yet important information on how to reload my page with the restart button. (https://stackoverflow.com/questions/3715047/how-to-reload-a-page-using-javascript)
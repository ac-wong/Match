// create a list of all the cards
const cardsList = ["anchor", "anchor", "bomb", "bomb", "beer", "beer", "bolt", "bolt", "bug", "bug", "cube", "cube", "envira", "envira", "paper-plane-o", "paper-plane-o"];

// variable holds open cards
let openCards = [];

//create and initialize counters
let moves = 0;
let matchedPairs = 0;
let rating = 3;

// variable holds timer
let timer = null;

// variables hold elements related to timer for convenience
let min = document.getElementById("min");
let sec = document.getElementById("sec");
let hr = document.getElementById("hr");
let hr_divider = document.getElementById("hr_divider");

// variables hold latest h m s in number format from timer
let last_sec = 0;
let last_min = 0;
let last_hr = 0;


// start a new game
newGame();

// add event listener for click events
document.addEventListener("click", executeEvent);


// shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// function starts a new game and displays the cards on the page
function newGame() {
    // shuffle the list of cards using the shuffle function
    let cards = cardsList;
    cards = shuffle(cards);

    // loops through each card and add HTML to the page
    for (let item of cards) {
        let node = document.createElement("LI");
        let text = `<i class="fa fa-${item}"></i>`;
        node.innerHTML = text;
        node.classList.add("card");
        document.getElementsByClassName("deck")[0].appendChild(node);
    }

    // start the timer
    startTimer();
}

// function to get and check event target and execute if valid click
function executeEvent(event) {
    /*
     * if click is not valid, or is valid but not a card click
     */

   // if an invalid click, cancel default action
    if (checkEvent(event.target.className) == "invalid" || checkEvent(event.target.id) == "invalid") {
      event.stopPropagation();
      event.preventDefault();
    }

    // if the restart button was clicked, restart game
    else if (checkEvent(event.target.className) == "restart") {
      restartGame();
    }

    // if clicked play again on modal, close the modal and restart game
    else if (checkEvent(event.target.className) == "again") {
      closeModal();
      restartGame();
    }

    // if clicked close button on modal, close the modal
    else if (checkEvent(event.target.className) == "close") {
      closeModal();
    }

    /*
     * else it is a valid card click
     */
    else {

      /*
       * if there is no opened card on deck, turn the card face up and show symbol
       */
      if (openCards.length < 1) {
          processOpen(event);
      }

     /*
      * else there is already an opened card
      */
     else {

       /*
        * if the two cards match
        */
       if (event.target.innerHTML == openCards[0]) {
              processMatch(event);
              updateMatchedPairs(); // call function to update and check number of matched pairs, including display of win modal if applicable
       }

       /*
        * if the two cards don't match
        */
       else {
            processMiss(event);
            updateMoves(); // call function to update moves counter and display
            checkStars(moves); //call function to check and update star rating
       }

       //reset openCards array
       openCards = [];
     }

  }

 }


 function processOpen(evt) {
   // function to open first card on deck

   // add styles to turn over card
   evt.target.classList.add("open");

   // set slight delay for the animation (start flipping cards to face up) before showing icon
   setTimeout(function delayShow() {
     evt.target.classList.add("show");
   }, 250);

   openCards.push(evt.target.innerHTML);
}


 function processMiss(evt) {
   // function to execute when two cards don't match - animation and cards first change to red then to grey and face down.

   // get the card that was already opened
   let openFirst = document.getElementsByClassName("open")[0];

   // remove existing styles for the two cards
   openFirst.classList.remove("open");
   openFirst.classList.remove("show");

   // add styles for the two cards
   openFirst.classList.add("miss");
   evt.target.classList.add("miss");

   // set slight delay for the animation (start flipping cards to face down) before hiding icon
   setTimeout(function hideIcon() {
       evt.target.classList.add("hide");
       openFirst.classList.add("hide");

       // remove styles ready for next move
       evt.target.classList.remove("hide");
       openFirst.classList.remove("hide");
       evt.target.classList.remove("miss");
       openFirst.classList.remove("miss");
   }, 1000);

 }


 function processMatch(evt) {
   // function to execute when two cards are matched - animation and cards become locked and change to green.

   // get the card that was already opened
   let openFirst = document.getElementsByClassName("open")[0];

   // remove existing styles for the two cards
   openFirst.classList.remove("open");
   openFirst.classList.remove("show");

   // add styles for the two cards
   evt.target.classList.add("match");
   openFirst.classList.add("match");
 }


 function updateMatchedPairs() {
   // function to update and check number of matched pairs. Displays modal if all pairs have been found.

   // increment counter
   matchedPairs++;

   // if all pairs have been matched, stop timer and show modal
   setTimeout(function endGame() {
     if (matchedPairs > 7) {
       stopTimer();
       showModal();
     }
   }, 500);
 }


 function updateMoves() {
   //function updates moves counter and display on the page
   moves++;
   let node = document.getElementsByClassName("moves")[0];
   node.innerHTML = moves;
 }


 function checkStars(num) {
   // function checks and updates star rating display
   let parent = document.getElementsByClassName("stars")[0];

   if (num == 5)  {
     parent.removeChild(parent.lastElementChild);
     rating = 2;
   }
   else if (num == 10) {
     parent.removeChild(parent.lastElementChild);
     rating = 1;
   }

 }


function restartGame() {
   // function resets the variables and the deck and then starts a new game
   //stop timer
   stopTimer();

   //clear existing component
   openCards = [];
   moves = 0;
   matchedPairs = 0;
   rating = 3;
   last_sec = 0;
   last_min = 0;
   last_hr = 0;

   // hide hour elements from the page
   if (hr.style.visibility == "visible") {
     hr.style.visibility = "hidden";
     hr_divider.style.visibility = "hidden";
   }

   min.innerText = "00";
   sec.innerText = "00";
   hr.innerText = "00";

   //remove existing cards on the page
   const nDeck = document.getElementsByClassName("deck")[0];
   while (nDeck.firstChild) {
    nDeck.removeChild(nDeck.firstChild);
   }

  //reset display of moves and stars

  // remove any existing stars
  let nStars = document.getElementsByClassName("stars")[0];
  while (nStars.firstChild) {
   nStars.removeChild(nStars.firstChild);
  }

  //add 3 stars
  for (i = 0; i < 3; i++) {
    let newNode = document.createElement("LI");
    let text = `<li><i class="fa fa-star"></i></li>`;
    newNode.innerHTML = text;
    nStars.appendChild(newNode);
  }

  // reset moves
  let nMoves = document.getElementsByClassName("moves")[0];
  nMoves.innerHTML = moves;

  // call function to start a new game
  newGame();

}


function showModal() {
  // function gets information and displays the modal

  // stop timer
  stopTimer();

  // update time for display
  if (last_sec > 0) {
    let el_sec = document.getElementById("modal_sec");
    el_sec.innerText = `${last_sec} secs`;
  }
  else {
    let el_sec = document.getElementById("modal_sec");
    el_sec.innerText = `0 secs`;
  }

  if (last_min > 0) {
    let el_min = document.getElementById("modal_min");
    el_min.innerText = `${last_min} mins and `;
  }

  if (last_hr > 0) {
    let el_hr = document.getElementById("modal_hr");
    el_hr.innerText = `${last_hr} hrs, `;
  }

  // update ratings for display
  let nRating = document.getElementsByClassName("ratings")[0];

  for (i = 0; i < rating; i++) {
    let newNode = document.createElement("LI");
    let text = `<div class="rating"><i class="fa fa-star"></i></div>`;
    newNode.innerHTML = text;
    nRating.appendChild(newNode);
  }

  //display modal and grey out background
  let el = document.getElementsByClassName("modal-display")[0];
  el.style.display = "flex";

  let bg = document.getElementsByClassName("modal-bg")[0];
  bg.style.display = "block";

}


function closeModal() {
  // function close the modal
  let el = document.getElementsByClassName("modal-display")[0];
  el.style.display = "none";

  let bg = document.getElementsByClassName("modal-bg")[0];
  bg.style.display = "none";

  // clear ratings on modal
  let nRating = document.getElementsByClassName("ratings")[0];
  while (nRating.firstChild) {
   nRating.removeChild(nRating.firstChild);
  }
}


// This function checks if the event is invalid, and also checks for the types of valid clicks such as card click, restart, play again, close modal
function checkEvent(str) {
   let result = ""

   const checkOpen = str.indexOf("open");
   const checkDeck = str.indexOf("deck");
   const checkMatch = str.indexOf("match");
   const checkContainer = str.indexOf("container");
   const checkStar = str.indexOf("fa fa-star");
   const checkCounter = str.indexOf("score-panel");
   const checkMoves = str.indexOf("moves");
   const checkModalBg = str.indexOf("modal-bg");
   const checkModal = str.indexOf("modal-display");
   const checkRestart = str.indexOf("repeat");
   const checkResult = str.indexOf("result");
   const checkAgain = str.indexOf("again");
   const checkModalR = str.indexOf("rating");
   const checkClose = str.indexOf("close");
   const checkMiss = str.indexOf("miss");
   const checkHide = str.indexOf("hide");
   const checkTime = str.indexOf("timer");
   const checkMin = str.indexOf("min");
   const checkSec = str.indexOf("sec");
   const checkHr = str.indexOf("hr");
   const checkHrDivider = str.indexOf("hr_divider");

   if (checkOpen > -1 || checkDeck > -1 || checkMatch > -1 || checkContainer > -1 || checkStar > -1 || checkCounter > -1 || checkMoves > -1 || checkModalBg > -1 || checkModal > -1 || checkResult > -1 || checkModalR > -1 || checkMiss > -1 || checkHide > -1 || checkTime > -1 || checkMin > -1 || checkSec > -1 || checkHr > -1 || checkHrDivider > -1) {
     result = "invalid";
   }
   else if (checkRestart > -1) {
     result = "restart";
   }
   else if (checkAgain > -1) {
     result = "again";
   }
   else if (checkClose > -1) {
     result = "close";
   }
   else {
     result = "valid";
   }

   return result;
}


function startTimer() {
  // this function starts timer and updates display

  //stops timer if there was a timer running
  stopTimer();

  // calls function to get starting time (milliseconds)
  const start_t = getStartTime();

  // while timer is running, display elapsed time in h:m:s
  timer = setInterval(function(){
    const elapsed = getElapsed(start_t);
    displayTime(elapsed);
  }, 10);

}


function getStartTime() {
  // this function returns starting time in milliseconds
  const d = new Date();
  const t = d.getTime();
  return t;
}


function getElapsed(start_ms) {
  // this function returns elapsed time in milliseconds
  const d = new Date();
  const t = d.getTime();

  if (start_ms > 0) {
    return (t - start_ms);
  }
  else {
    return 0;
  }
}


function displayTime(ms) {
  // this function displays milliseconds in hours:minutes:seconds

  let h = 0;
  let m = 0;
  let s = 0;

  h = (ms / 3600000); // converts milliseconds to hours

  if (h > 0) {
    // update h and convert remainder to m
    let temp = h;
    h = Math.trunc(h);
    m = (60 * (temp - h));
  }

  if (m > 0) {
    // update m and convert remainder to s
    let temp = m;
    m = Math.trunc(m);
    s = (60 * (temp - m));
  }

  if (s > 0) {
    // update s
    s = Math.trunc(s);
  }

  // keep log in variables
  last_hr = h;
  last_min = m;
  last_sec = s;

  // format to 00
  h = getText(h);
  m = getText(m);
  s = getText(s);

  // display time on page
  sec.innerText = s;
  min.innerText = m;
  hr.innerText = h;

  //unhide hour display if reached one hour
  if (h == "01") {
    hr.style.visibility = "visible";
    hr_divider.style.visibility = "visible";
  }

}


function stopTimer() {
  // this function clears the timer if it is running
  if (timer != null) {
    clearInterval(timer);
    timer = null;
    return timer;
  }
  else {
    return timer;
  }

}


function getText(num) {
  // this functions returns a String in format 00
  if (num < 10) {
    return ("0" + num);
  }
  else {
    return num;
  }
}

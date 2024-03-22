let duration = 1000;
let countdown;
let isCongratulationsDisplayed = false; // Add a variable to track if congratulations message is displayed

document.querySelector(".control-buttons span").onclick = function () {
  let yourName = prompt("Whats Your Name?");

  if (yourName == null || yourName == "") {
    document.querySelector(".name span").innerHTML = "Unknown";
  } else {
    document.querySelector(".name span").innerHTML = yourName;
  }

  let userInput = prompt("Enter the countdown time in minutes:");
  do {
    if (isNaN(userInput) || userInput === null || userInput === "") {
      alert("Please enter a valid number.");
      userInput = prompt("Enter the countdown time in minutes:");
    }
  } while (isNaN(userInput) || userInput === null || userInput === "");

  document.querySelector(".control-buttons").remove();
  let audio = document.getElementById("startMusic");
  // audio.play();
  resetGame(userInput);
  function resetGame(userInput) {
    let timeLeft = userInput * 60;
    let timerElement = document.querySelector(".timer span");

    let countdown = setInterval(function () {
      timeLeft--;
      let minutes = Math.floor(timeLeft / 60);
      let seconds = timeLeft % 60;

      timerElement.innerText =
        (minutes < 10 ? "0" : "") +
        minutes +
        ":" +
        (seconds < 10 ? "0" : "") +
        seconds;

      // Check if congratulations message is displayed and stop the countdown
      if (isCongratulationsDisplayed) {
        clearInterval(countdown);
        return;
      }

      if (timeLeft === 0) {
        clearInterval(countdown);
        blocksContainer.classList.add("no-clicking");
        savePlayerInfo();
        displayPlayerInfo();
        let btn = document.querySelector(".btn");
        btn.style.display = "block";
        let btnReset = document.querySelector(".btnReset");
        btnReset.onclick = function () {
          location.reload();
        };
      }
    }, 1000);
  }
};

let blocksContainer = document.querySelector(".memory-game-blocks");

let blocks = Array.from(blocksContainer.children);

let orderRang = [...Array(blocks.length).keys()];
shuffle(orderRang);

blocks.forEach((block, index) => {
  block.style.order = orderRang[index];
  block.addEventListener("click", function () {
    flipBlock(block);
  });
});

function flipBlock(selectedBlock) {
  selectedBlock.classList.add("is-flipped");

  let allFlippedBlocks = blocks.filter((flipBlock) =>
    flipBlock.classList.contains("is-flipped")
  );

  if (allFlippedBlocks.length === 2) {
    stopClicking();
    checkMatchedBlock(allFlippedBlocks[0], allFlippedBlocks[1]);
  }
}

function stopClicking() {
  blocksContainer.classList.add("no-clicking");

  setTimeout(() => {
    blocksContainer.classList.remove("no-clicking");
  }, duration);
}

function checkMatchedBlock(fristBlock, secondBlock) {
  let triesElement = document.querySelector(".tries span");
  let rightTries = document.querySelector(".rightTries span");

  if (fristBlock.dataset.technology === secondBlock.dataset.technology) {
    fristBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");

    fristBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");

    rightTries.innerHTML = parseInt(rightTries.innerHTML) + 1;
    document.getElementById("success").play();

    // Check if the correct tries count exceeds the maximum
    if (parseInt(rightTries.innerHTML) >= 10) {
      displayMessageAndRestart();
    }
  } else {
    triesElement.innerHTML = parseInt(triesElement.innerHTML) + 1;

    setTimeout(() => {
      fristBlock.classList.remove("is-flipped");
      secondBlock.classList.remove("is-flipped");
    }, duration);

    document.getElementById("fail").play();
  }
}

function displayMessageAndRestart() {
  isCongratulationsDisplayed = true;
  clearInterval(countdown);
  blocksContainer.classList.add("no-clicking");
  savePlayerInfo();
  displayPlayerInfo();
  let congratulationsDiv = document.querySelector(".congratulationsMessage");
  congratulationsDiv.style.display = "block";
  let massege = document.querySelector(".congratulationsMessage p");
  let playerName = document.querySelector(".name span").textContent;
  massege.innerHTML = `Congratulations ${playerName} ! <br> You have completed 10 successful matches!`;
}
function restart() {
  location.reload(); // Reload the page to restart the game
}

function shuffle(array) {
  let current = array.length,
    temp,
    random;

  while (current > 0) {
    random = Math.floor(Math.random() * current);

    current--;

    temp = array[current];

    array[current] = array[random];

    array[random] = temp;
  }
  return array;
}

function savePlayerInfo() {
  let playerName = document.querySelector(".name span").textContent;
  let rightTries = document.querySelector(".rightTries span").textContent;
  let tries = document.querySelector(".tries span").textContent;

  if (
    playerName.trim() !== "" &&
    tries.trim() !== "" &&
    rightTries.trim() !== ""
  ) {
    tries = parseInt(tries);

    localStorage.setItem("playerName", playerName);
    localStorage.setItem("rightTries", rightTries);
    localStorage.setItem("tries", tries);
    console.log("Player information saved successfully!");
  } else {
    console.log(
      "Unable to save player information: playerName or tries is empty."
    );
  }
}

function displayPlayerInfo() {
  let savedPlayerName = localStorage.getItem("playerName");
  let rightTries = localStorage.getItem("rightTries");
  let savedTries = localStorage.getItem("tries");

  if (savedPlayerName !== null && rightTries !== null && savedTries !== null) {
    let playerInfoDiv = document.getElementById("playerInfo");
    playerInfoDiv.innerHTML = `<p>Name: ${savedPlayerName}</p> <p>Right Tries: ${rightTries}</p> <p>Wrong Tries: ${savedTries}</p>`;
  }
}

window.onload = function () {
  displayPlayerInfo();
};

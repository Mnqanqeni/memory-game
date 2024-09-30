const { emojis } = require("./emojis");

populate();
restart();

function populate() {
  const gameCards = pickBoardCards(4, 4);
  const resetBtn = document.querySelector("#reset_btn");

  gameCards.forEach((emoji) => createCard(emoji, gameCards.length, resetBtn));
}

function createCard(emoji, totalCards, resetBtn) {
  const card = document.createElement("div");
  card.className = "item";
  card.innerHTML = emoji;
  document.querySelector(".game").appendChild(card);

  card.onclick = () => handleCardClick(card, totalCards, resetBtn);
}

function handleCardClick(card, totalCards, resetBtn) {
  card.classList.add("cardOpen");
  enableResetButton(resetBtn);

  const openCards = document.querySelectorAll(".cardOpen");
  if (openCards.length === 2) {
    checkMatch(openCards, totalCards);
  }
}

function enableResetButton(resetBtn) {
  resetBtn.classList.remove("disabled");
  resetBtn.disabled = false;
}

function checkMatch(openCards, totalCards) {
  const [firstCard, secondCard] = openCards;
  
  if (firstCard.innerHTML === secondCard.innerHTML) {
    firstCard.classList.add("cardMatch");
    secondCard.classList.add("cardMatch");

    if (document.querySelectorAll(".cardMatch").length === totalCards) {
      displayWinMessage();
    }
  }
  setTimeout(() => closeOpenCards(openCards), 600);
}

function closeOpenCards(openCards) {
  openCards.forEach(card => card.classList.remove("cardOpen"));
}

function restart() {
  document.querySelector(".reset").addEventListener("click", () => {
    window.location.reload();
  });
}

function pickBoardCards(rows, cols) {
  const totalCards = (rows * cols) / 2;
  let selectedCards = shuffle(emojis).slice(0, totalCards);
  return shuffle([...selectedCards, ...selectedCards]);
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function displayWinMessage() {
  const messageDiv = document.createElement("div");
  messageDiv.className = "winMessage";
  messageDiv.innerHTML = "<h1>Congratulations! You Won!</h1>";
  document.querySelector(".container").appendChild(messageDiv);
}

module.exports = { restart, populate };

const { emojis } = require("./emojis");
const { domElements } = require("./dom_elements");

document.addEventListener("DOMContentLoaded", function () {
  initializeGameBoard();
  restart();
});

function initializeGameBoard() {
  const gameCards = pickBoardCards(4, 4);

  gameCards.forEach((emoji) => createCard(emoji, gameCards.length));
}

function createCard(emoji, totalCards) {
  const card = document.createElement("div");
  card.className = "item";
  card.innerHTML = emoji;
  domElements.gameContainer().appendChild(card);

  card.onclick = () => handleCardClick(card, totalCards);
}

function handleCardClick(card, totalCards) {
  let openCards = domElements.openCards();
  if (openCards.length === 2) {
    return;
  }
  toggleClass(card, "cardOpen", "add");
  enableResetButton();
  openCards = domElements.openCards();

  if (openCards.length === 2) {
    checkMatch(openCards, totalCards);
  }
}

function enableResetButton() {
  toggleClass(domElements.resetBtn(), "disabled", "remove");
  domElements.resetBtn().disabled = false;
}

function checkMatch(openCards, totalCards) {
  const [firstCard, secondCard] = openCards;

  if (firstCard.innerHTML === secondCard.innerHTML) {
    toggleClass(firstCard, "cardMatch", "add");
    toggleClass(secondCard, "cardMatch", "add");
    closeOpenCards(openCards);

    if (domElements.matchedCards().length === totalCards) {
      displayWinMessage();
    }
  }
  setTimeout(() => closeOpenCards(openCards), 600);
}

function closeOpenCards(openCards) {
  openCards.forEach((card) => toggleClass(card, "cardOpen", "remove"));
}

function restart() {
  domElements.resetBtn().addEventListener("click", () => {
    domElements.gameContainer().innerHTML = "";
    initializeGameBoard();
    toggleClass(domElements.resetBtn(), "disabled", "add");
    domElements.resetBtn().disabled = true;
    removeWinMessage();
  });
}

function removeWinMessage() {
  const message = domElements.message();
  if (message) message.remove();
}

function pickBoardCards(rows, cols) {
  const totalCards = (rows * cols) / 2;
  let selectedCards = shuffle(emojis).slice(0, totalCards);
  return shuffle([...selectedCards, ...selectedCards]);
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function toggleClass(element, className, add) {
  add === "add"
    ? element.classList.add(className)
    : element.classList.remove(className);
}

function displayWinMessage() {
  const messageDiv = document.createElement("div");
  messageDiv.className = "winMessage";
  messageDiv.innerHTML = "<h1>Congratulations! You Won!</h1>";
  domElements.container().appendChild(messageDiv);
}

module.exports = { restart, initializeGameBoard };

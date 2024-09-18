const confetti = require("canvas-confetti").default;
window.confetti = confetti;
const {emojis} =  require("./emojis");

populate();
restart();

function populate() {
  const gameCards = pickBoardCards(4, 4);
  gameCards.forEach((emoji, i) => {
    const card = document.createElement("div");
    card.className = "item";
    card.innerHTML = emoji;
    document.querySelector(".game").appendChild(card);

    card.onclick = function () {
      card.classList.add("cardOpen");

      const openCards = document.querySelectorAll(".cardOpen");
      if (openCards.length > 1) {
        if (openCards[0].innerHTML === openCards[1].innerHTML) {
          openCards[0].classList.add("cardMatch");
          openCards[1].classList.add("cardMatch");

          if (
            document.querySelectorAll(".cardMatch").length === gameCards.length
          ) {
            window.confetti({
              particleCount: 300,
              spread: 260,
              origin: { y: 0.6 },
            });
          }

          setTimeout(() => {
            openCards[0].classList.remove("cardOpen");
            openCards[1].classList.remove("cardOpen");
          }, 600);
        } else {
          setTimeout(() => {
            openCards[0].classList.remove("cardOpen");
            openCards[1].classList.remove("cardOpen");
          }, 600);
        }
      }
    };
  });
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
  let shuffledArray = [];
  while (array.length) {
    let index = Math.floor(Math.random() * array.length);
    shuffledArray.push(array.splice(index, 1)[0]);
  }
  return shuffledArray;
}

module.exports = { restart, populate };

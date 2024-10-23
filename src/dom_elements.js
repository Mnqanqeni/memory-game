const domElements = {
  cards: () => document.querySelectorAll(".item"),
  resetBtn: () => document.querySelector("#reset_btn"),
  winMessage: () => document.querySelector(".winMessage"),
  gameContainer: () => document.querySelector(".game"),
  matchedCards: () => document.querySelectorAll(".cardMatch"),
  openCards: () => document.querySelectorAll(".cardOpen"),
  message: () => document.querySelector(".winMessage"),
  container: () => document.querySelector(".container"),
};

module.exports = { domElements };

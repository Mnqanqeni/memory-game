const domElements = {
  cards: () => document.querySelectorAll(".item"),
  resetBtn: () => document.querySelector("#reset_btn"),
  winMessage: () => document.querySelector(".winMessage"),
};

module.exports = { domElements };

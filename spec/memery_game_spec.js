jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");
const { setCardValues, clickCards, simulateTime } = require("./spec_helper");

const mockWindow = {
  location: {
    reload: jasmine.createSpy("reload"),
    href: "",
  },
};

let html,
  dom,
  document,
  window,
  cards,
  resetButton,
  initializeGameBoard,
  restart;

describe("Memory Game", function () {
  beforeEach(function () {
    jasmine.clock().install();

    html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf-8");
    dom = new JSDOM(html, { runScripts: "dangerously" });
    document = dom.window.document;
    window = dom.window;
    global.window = window;
    global.document = document;

    const gameModule = require("../src/index");
    initializeGameBoard = gameModule.initializeGameBoard;
    restart = gameModule.restart;
    cards = document.querySelectorAll(".item");
    restart();
    initializeGameBoard();

    cards = document.querySelectorAll(".item");
    resetButton = document.querySelector(".reset");
  });

  afterEach(function () {
    dom.window.close();
    global.window = undefined;
    global.document = undefined;
    jasmine.clock().uninstall();
  });

  describe("Initial Game State", function () {
    it("should have all cards unflipped on initial load", function () {
      cards.forEach((card) => {
        expect(card.classList.contains("cardOpen")).toBe(false);
      });
    });

    it("should have the reset button disabled initially", function () {
      expect(resetButton.classList.contains("disabled")).toBe(true);
      expect(resetButton.disabled).toBe(true);
    });

    it("should create the correct number of game cards", function () {
      cards = document.querySelectorAll(".item");
      expect(cards.length).toBe(16);
    });
  });

  describe("Card Interactions", function () {
    it("should add 'cardOpen' class when a card is clicked", function () {
      clickCards([0], cards);
      expect(cards[0].classList.contains("cardOpen")).toBe(true);
    });

    it("should add 'cardMatch' class when two matching cards are clicked", function () {
      setCardValues(["🧳", "🧳"], cards);
      clickCards([0, 1], cards);
      expect(document.querySelectorAll(".cardMatch").length).toBe(2);
    });

    it("should not allow flipping more than two cards at once", function () {
      setCardValues(["🧳", "✈️", "🌍"], cards);
      clickCards([0, 1, 2], cards);
      simulateTime(700);
      [0, 1].forEach((index) =>
        expect(cards[index].classList.contains("cardOpen")).toBe(false)
      );
    });

    it("should not break when more than two cards are clicked fast", function () {
      setCardValues(["🧳", "✈️", "🧶", "🦺", "🐯", "🧳"], cards);
      clickCards([0, 1, 2, 3, 5, 6], cards);
      simulateTime(700);
      [0, 1, 2, 3, 4, 5].forEach((index) =>
        expect(cards[index].classList.contains("cardOpen")).toBe(false)
      );
    });

    it("should not flip back matching cards", function () {
      setCardValues(["🧳", "🧳"], cards);
      clickCards([0, 1], cards);
      simulateTime(700);
      expect(cards[0].classList.contains("cardMatch")).toBe(true);
      expect(cards[1].classList.contains("cardMatch")).toBe(true);
    });

    it("should flip back non-matching cards", function () {
      setCardValues(["🧳", "✈️"], cards);
      clickCards([0, 1], cards);
      simulateTime(700);
      expect(cards[0].classList.contains("cardOpen")).toBe(false);
      expect(cards[1].classList.contains("cardOpen")).toBe(false);
    });

    it("should not allow the same card to be clicked twice", function () {
      clickCards([0, 0], cards);
      expect(cards[0].classList.contains("cardOpen")).toBe(true);
    });
  });

  describe("Reset Functionality", function () {
    it("should keep the same number of cards after restart", function () {
      resetButton.disabled = false;
      global.window = mockWindow;
      resetButton.click();
      const newCards = document.querySelectorAll(".item");
      expect(newCards.length).toBe(cards.length);
    });

    it("should have no flipped cards after restart", function () {
      resetButton.disabled = false;
      global.window = mockWindow;
      resetButton.click();
      cards.forEach((card) => {
        expect(card.classList.contains("cardOpen")).toBe(false);
      });
    });

    it("should disable the reset button until a card is clicked", function () {
      expect(resetButton.disabled).toBe(true);
      clickCards([0], cards);
      expect(resetButton.disabled).toBe(false);
    });

    it("should reset the game when the restart button is clicked", function () {
      resetButton.disabled = false;
      global.window = mockWindow;
      resetButton.click();
      expect(mockWindow.location.reload).toHaveBeenCalled();
    });
  });

  describe("Win Conditions", function () {
    it("should display a win message when all cards are matched", function () {
      for (let i = 0; i < cards.length; i += 2) {
        setCardValues(Array(cards.length).fill("🧳"), cards);
        clickCards([i, i + 1], cards);
        simulateTime(700);
      }

      const matchedCards = document.querySelectorAll(".cardMatch");
      expect(matchedCards.length).toBe(cards.length);

      const winMessage = document.querySelector(".winMessage");
      expect(winMessage).not.toBeNull();
      expect(winMessage.innerHTML).toContain("Congratulations! You Won!");
    });
  });
});

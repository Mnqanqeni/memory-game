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

let html, dom, document, window, initializeGameBoard, restart, domElements;

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

    domElements = {
      cards: document.querySelectorAll(".item"),
      resetButton: document.querySelector(".reset"),
    };

    restart();
    initializeGameBoard();

    domElements.cards = document.querySelectorAll(".item");
  });

  afterEach(function () {
    dom.window.close();
    global.window = undefined;
    global.document = undefined;
    jasmine.clock().uninstall();
  });

  describe("Initial Game State", function () {
    it("should have all cards unflipped on initial load", function () {
      domElements.cards.forEach((card) => {
        expect(card.classList.contains("cardOpen")).toBe(false);
      });
    });

    it("should have the reset button disabled initially", function () {
      expect(domElements.resetButton.classList.contains("disabled")).toBe(true);
      expect(domElements.resetButton.disabled).toBe(true);
    });

    it("should create the correct number of game cards", function () {
      expect(domElements.cards.length).toBe(16);
    });
  });

  describe("Card Interactions", function () {
    it("should add 'cardOpen' class when a card is clicked", function () {
      clickCards([0], domElements.cards);
      expect(domElements.cards[0].classList.contains("cardOpen")).toBe(true);
    });

    it("should add 'cardMatch' class when two matching cards are clicked", function () {
      setCardValues(["🧳", "🧳"], domElements.cards);
      clickCards([0, 1], domElements.cards);
      expect(document.querySelectorAll(".cardMatch").length).toBe(2);
    });

    it("should not allow flipping more than two cards at once", function () {
      setCardValues(["🧳", "✈️", "🌍"], domElements.cards);
      clickCards([0, 1, 2], domElements.cards);
      simulateTime(700);
      [0, 1].forEach((index) =>
        expect(domElements.cards[index].classList.contains("cardOpen")).toBe(
          false
        )
      );
    });

    it("should not break when more than two cards are clicked fast", function () {
      setCardValues(["🧳", "✈️", "🧶", "🦺", "🐯", "🧳"], domElements.cards);
      clickCards([0, 1, 2, 3, 5, 6], domElements.cards);
      simulateTime(700);
      [0, 1, 2, 3, 4, 5].forEach((index) =>
        expect(domElements.cards[index].classList.contains("cardOpen")).toBe(
          false
        )
      );
    });

    it("should not flip back matching cards", function () {
      setCardValues(["🧳", "🧳"], domElements.cards);
      clickCards([0, 1], domElements.cards);
      simulateTime(700);
      expect(domElements.cards[0].classList.contains("cardMatch")).toBe(true);
      expect(domElements.cards[1].classList.contains("cardMatch")).toBe(true);
    });

    it("should flip back non-matching cards", function () {
      setCardValues(["🧳", "✈️"], domElements.cards);
      clickCards([0, 1], domElements.cards);
      simulateTime(700);
      expect(domElements.cards[0].classList.contains("cardOpen")).toBe(false);
      expect(domElements.cards[1].classList.contains("cardOpen")).toBe(false);
    });

    it("should not allow the same card to be clicked twice", function () {
      clickCards([0, 0], domElements.cards);
      expect(domElements.cards[0].classList.contains("cardOpen")).toBe(true);
    });
  });

  describe("Reset Functionality", function () {
    it("should keep the same number of cards after restart", function () {
      domElements.resetButton.disabled = false;
      global.window = mockWindow;
      domElements.resetButton.click();
      const newCards = document.querySelectorAll(".item");
      expect(newCards.length).toBe(domElements.cards.length);
    });

    it("should have no flipped cards after restart", function () {
      domElements.resetButton.disabled = false;
      global.window = mockWindow;
      domElements.resetButton.click();
      domElements.cards.forEach((card) => {
        expect(card.classList.contains("cardOpen")).toBe(false);
      });
    });

    it("should disable the reset button until a card is clicked", function () {
      expect(domElements.resetButton.disabled).toBe(true);
      clickCards([0], domElements.cards);
      expect(domElements.resetButton.disabled).toBe(false);
    });

    it("should reset the game when the restart button is clicked", function () {
      domElements.resetButton.disabled = false;
      global.window = mockWindow;
      domElements.resetButton.click();
      expect(mockWindow.location.reload).toHaveBeenCalled();
    });
  });

  describe("Win Conditions", function () {
    it("should display a win message when all cards are matched", function () {
      for (let i = 0; i < domElements.cards.length; i += 2) {
        setCardValues(
          Array(domElements.cards.length).fill("🧳"),
          domElements.cards
        );
        clickCards([i, i + 1], domElements.cards);
        simulateTime(700);
      }

      const matchedCards = document.querySelectorAll(".cardMatch");
      expect(matchedCards.length).toBe(domElements.cards.length);

      const winMessage = document.querySelector(".winMessage");
      expect(winMessage).not.toBeNull();
      expect(winMessage.innerHTML).toContain("Congratulations! You Won!");
    });
  });
});

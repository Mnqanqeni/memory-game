jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");
const { setCardValues, clickCards, simulateTime } = require("./spec_helper");
const { domElements } = require("../src/dom_elements");

let html, dom, document, window, initializeGameBoard, restart;

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

    restart();
    initializeGameBoard();
  });

  afterEach(function () {
    dom.window.close();
    global.window = undefined;
    global.document = undefined;
    jasmine.clock().uninstall();
  });

  describe("Initial Game State", function () {
    it("should have all cards unflipped on load", function () {
      domElements.cards().forEach((card) => {
        expect(card.classList.contains("cardOpen")).toBe(false);
      });
    });

    it("should disable the reset button initially", function () {
      expect(domElements.resetBtn().classList.contains("disabled")).toBe(true);
      expect(domElements.resetBtn().disabled).toBe(true);
    });

    it("should create the correct number of cards", function () {
      expect(domElements.cards().length).toBe(16);
    });
  });

  describe("Card Interactions", function () {
    it("should remove 'cardOpen' from unmatched cards after timeout", function () {
      setCardValues(["🧳", "🌍"], domElements.cards());
      clickCards([0, 1], domElements.cards());
      jasmine.clock().tick(600);
      expect(domElements.cards()[0].classList.contains("cardOpen")).toBe(false);
      expect(domElements.cards()[1].classList.contains("cardOpen")).toBe(false);
    });

    it("should add 'cardOpen' when a card is clicked", function () {
      clickCards([0], domElements.cards());
      expect(domElements.cards()[0].classList.contains("cardOpen")).toBe(true);
    });

    it("should add 'cardMatch' for matching cards", function () {
      setCardValues(["🧳", "🧳"], domElements.cards());
      clickCards([0, 1], domElements.cards());
      expect(domElements.matchedCards().length).toBe(2);
    });

    it("should prevent matched cards from flipping again", function () {
      setCardValues(["🧳", "🧳"], domElements.cards());
      clickCards([0, 1], domElements.cards());
      clickCards([0, 1], domElements.cards());

      expect(domElements.cards()[0].classList.contains("cardOpen")).toBe(false);
      expect(domElements.cards()[1].classList.contains("cardOpen")).toBe(false);
    });

    it("should not allow more than two cards to be flipped at the same time", function () {
      setCardValues(["🧳", "✈️", "🌍"], domElements.cards());
      clickCards([0, 1, 2], domElements.cards());
      expect(domElements.cards()[0].classList.contains("cardOpen")).toBe(true);
      expect(domElements.cards()[1].classList.contains("cardOpen")).toBe(true);
      expect(domElements.cards()[2].classList.contains("cardOpen")).toBe(false);
    });

    it("should handle rapid clicks without breaking", function () {
      setCardValues(["🧳", "✈️", "🧶", "🦺", "🐯", "🧳"], domElements.cards());
      clickCards([0, 1, 2, 3, 5, 6], domElements.cards());
      simulateTime(700);

      [0, 1, 2, 3, 4, 5].forEach((index) => {
        expect(domElements.cards()[index].classList.contains("cardOpen")).toBe(
          false
        );
      });
    });

    it("should keep matching cards open", function () {
      setCardValues(["🧳", "🧳"], domElements.cards());
      clickCards([0, 1], domElements.cards());
      simulateTime(700);

      expect(domElements.cards()[0].classList.contains("cardMatch")).toBe(true);
      expect(domElements.cards()[1].classList.contains("cardMatch")).toBe(true);
    });

    it("should flip back non-matching cards", function () {
      setCardValues(["🧳", "✈️"], domElements.cards());
      clickCards([0, 1], domElements.cards());

      const removeClassSpyOne = spyOn(
        domElements.cards()[0].classList,
        "remove"
      ).and.callThrough();
      const removeClassSpyTwo = spyOn(
        domElements.cards()[1].classList,
        "remove"
      ).and.callThrough();

      simulateTime(700);

      expect(removeClassSpyOne).toHaveBeenCalledWith("cardOpen");
      expect(removeClassSpyTwo).toHaveBeenCalledWith("cardOpen");
      expect(domElements.cards()[0].classList.contains("cardOpen")).toBe(false);
      expect(domElements.cards()[1].classList.contains("cardOpen")).toBe(false);
    });

    it("should prevent the same card from being flipped twice", function () {
      clickCards([0], domElements.cards());
      expect(domElements.cards()[0].classList.contains("cardOpen")).toBe(true);
      clickCards([0], domElements.cards());
      expect(domElements.cards()[0].classList.contains("cardOpen")).toBe(true);
    });
  });

  describe("Reset Functionality", function () {
    it("should flip all cards back after restart", function () {
      clickCards([0], domElements.cards());
      domElements.resetBtn().click();

      domElements.cards().forEach((card) => {
        expect(card.classList.contains("cardOpen")).toBe(false);
      });
    });

    it("should disable the reset button until a card is clicked", function () {
      expect(domElements.resetBtn().disabled).toBe(true);
      clickCards([0], domElements.cards());
      expect(domElements.resetBtn().disabled).toBe(false);
    });

    it("should reset the game when the reset button is clicked", function () {
      clickCards([0], domElements.cards());
      domElements.resetBtn().click();

      domElements.cards().forEach((card) => {
        expect(card.classList.contains("cardOpen")).toBe(false);
        expect(card.classList.contains("cardMatch")).toBe(false);
      });

      expect(domElements.resetBtn().disabled).toBe(true);
    });
  });

  describe("Win Conditions", function () {
    it("should display a win message when all cards are matched", function () {
      setCardValues(
        Array(domElements.cards().length).fill("🧳"),
        domElements.cards()
      );
      for (let i = 0; i < domElements.cards().length; i += 2) {
        clickCards([i, i + 1], domElements.cards());
        simulateTime(700);
      }

      expect(domElements.winMessage().classList).toContain("winMessage");
      expect(domElements.matchedCards().length).toBe(
        domElements.cards().length
      );

      expect(domElements.winMessage().innerHTML).toContain(
        "Congratulations! You Won!"
      );
    });
  });
});

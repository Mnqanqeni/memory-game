jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");
const mockWindow = {
  location: {
    reload: jasmine.createSpy("reload"),
    href: ""
  },
};

let html;
let dom;
let document;
let window;
let cards;
let resetButton;
let populate;
let restart;

describe("Memory Game", function () {
  beforeEach(function () {
    jasmine.clock().install();

    html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf-8");

    dom = new JSDOM(html, {
      runScripts: "dangerously",
    });
    document = dom.window.document;
    window = dom.window;
    global.window = window;
    global.document = document;

    const gameModule = require("../src/index");
    populate = gameModule.populate;
    restart = gameModule.restart;

    restart();
    populate();

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
      expect(cards.length).toBe(16); 
    });
  });

  describe("Card Interactions", function () {
    it("should add 'cardOpen' class when a card is clicked", function () {
      const firstCard = cards[0];
      firstCard.click();
      expect(firstCard.classList.contains("cardOpen")).toBe(true);
    });

    it("should add 'cardMatch' class when two matching cards are clicked", function () {
      cards[0].innerHTML = "🧳";
      cards[1].innerHTML = "🧳";

      cards[0].click();
      cards[1].click();

      const matchedCards = document.querySelectorAll(".cardMatch");
      expect(matchedCards.length).toBe(2);
    });

    it("should not allow flipping more than two cards at once", function () {
      cards[0].innerHTML = "🧳";
      cards[1].innerHTML = "✈️";
      cards[2].innerHTML = "🌍";

      cards[0].click();
      cards[1].click();
      cards[2].click();

      jasmine.clock().tick(700);

      expect(cards[0].classList.contains("cardOpen")).toBe(false);
      expect(cards[1].classList.contains("cardOpen")).toBe(false);
    });

    it("should not flip back matching cards", function () {
      cards[0].innerHTML = "🧳";
      cards[1].innerHTML = "🧳";

      cards[0].click();
      cards[0].click();
      cards[1].click();
      cards[1].click();

      jasmine.clock().tick(700);

      expect(cards[0].classList.contains("cardOpen")).toBe(false);
      expect(cards[1].classList.contains("cardOpen")).toBe(false);
      expect(cards[0].classList.contains("cardMatch")).toBe(true);
      expect(cards[1].classList.contains("cardMatch")).toBe(true);
    });

    it("should flip back non-matching cards", function () {
      cards[0].innerHTML = "🧳";
      cards[1].innerHTML = "✈️";

      cards[0].click();
      cards[1].click();

      jasmine.clock().tick(700);

      expect(cards[0].classList.contains("cardOpen")).toBe(false);
      expect(cards[1].classList.contains("cardOpen")).toBe(false);
    });

    it("should not allow the same card to be clicked twice", function () {
      cards[0].click();
      cards[0].click();
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
      cards[0].click();
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
        cards[i].innerHTML = "🧳";
        cards[i + 1].innerHTML = "🧳";
        cards[i].click();
        cards[i + 1].click();
        jasmine.clock().tick(700);
      }

      const matchedCards = document.querySelectorAll(".cardMatch");
      expect(matchedCards.length).toBe(cards.length);

      const winMessage = document.querySelector(".winMessage");
      expect(winMessage).not.toBeNull();
      expect(winMessage.innerHTML).toContain("Congratulations! You Won!");
    });
  });
});

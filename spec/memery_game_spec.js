jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");
const mockWindow = {
  location: {
    reload: jasmine.createSpy(),
  },
};

describe("script", function () {
  let dom;
  let document;
  let window;

  const html = fs.readFileSync(
    path.resolve(__dirname, "../index.html"),
    "utf-8"
  );

  dom = new JSDOM(html, {
    runScripts: "dangerously",
  });
  document = dom.window.document;
  window = dom.window;
  global.window = window;
  global.document = document;
  const { populate, restart } = require("../src/index");

  restart();
  populate();

  it("should create the correct number of game cards", function () {
    const cards = document.querySelectorAll(".item");
    expect(cards.length).toBe(16);
  });

  it("should add 'cardOpen' class when a card is clicked", function () {
    const firstCard = document.querySelectorAll(".item")[0];
    firstCard.click();

    expect(firstCard.classList.contains("cardOpen")).toBe(true);
  });

  it("should add 'cardMatch' class when two matching cards are clicked", function () {
    let matchedCards = document.querySelectorAll(".cardMatch");

    for (let i = 0; i < matchedCards.length; i++) {
      matchedCards[i].classList.remove("cardMatch");
    }

    const cards = document.querySelectorAll(".item");

    cards[0].innerHTML = "🧳";
    cards[1].innerHTML = "🧳";

    cards[0].click();
    cards[1].click();

    matchedCards = document.querySelectorAll(".cardMatch");
    expect(matchedCards.length).toBe(2);
  });

  it("should trigger confetti when all cards are matched", async function () {
    const cards = document.querySelectorAll(".item");
    window.confetti = jasmine.createSpy("confetti");

    for (let i = 0; i < cards.length; i += 2) {
      cards[i].innerHTML = "🧳";
      cards[i + 1].innerHTML = "🧳";
      cards[i].click();
      cards[i + 1].click();
      await new Promise((resolve) => setTimeout(resolve, 700));
    }

    await new Promise((resolve) => setTimeout(resolve, 700));

    const matchedCards = document.querySelectorAll(".cardMatch");
    expect(matchedCards.length).toBe(cards.length);
    expect(window.confetti).toHaveBeenCalled();
  });

  it("should prevent flipping matched cards again", async function () {
    const cards = document.querySelectorAll(".item");

    cards[0].innerHTML = "🧳";
    cards[1].innerHTML = "🧳";
    cards[0].click();
    cards[1].click();

    expect(cards[0].classList.contains("cardMatch")).toBe(true);
    expect(cards[1].classList.contains("cardMatch")).toBe(true);

    cards[0].click();
    cards[1].click();

    await new Promise((resolve) => setTimeout(resolve, 700));

    expect(cards[0].classList.contains("cardOpen")).toBe(false);
    expect(cards[1].classList.contains("cardOpen")).toBe(false);
  });

  it("should reset the game when the restart button is clicked", function () {
    global.window = mockWindow;
    const resetButton = document.querySelector(".reset");

    resetButton.click();
    expect(mockWindow.location.reload).toHaveBeenCalled();

    document = dom.window.document;
    window = dom.window;
    global.window = window;
  });
});

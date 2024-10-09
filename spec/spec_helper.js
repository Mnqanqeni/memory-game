function setCardValues(values, cards) {
  values.forEach((value, i) => {
    cards[i].innerHTML = value;
  });
}

function clickCards(indexes, cards) {
  indexes.forEach((index) => cards[index].click());
}

function simulateTime(milliseconds) {
  jasmine.clock().tick(milliseconds);
}

module.exports = { setCardValues, clickCards, simulateTime };

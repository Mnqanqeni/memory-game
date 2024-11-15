/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/dom_elements.js":
/*!*****************************!*\
  !*** ./src/dom_elements.js ***!
  \*****************************/
/***/ ((module) => {

eval("const domElements = {\n  cards: () => document.querySelectorAll(\".item\"),\n  resetBtn: () => document.querySelector(\"#reset_btn\"),\n  winMessage: () => document.querySelector(\".winMessage\"),\n  gameContainer: () => document.querySelector(\".game\"),\n  matchedCards: () => document.querySelectorAll(\".cardMatch\"),\n  openCards: () => document.querySelectorAll(\".cardOpen\"),\n  message: () => document.querySelector(\".winMessage\"),\n  container: () => document.querySelector(\".container\"),\n};\n\nmodule.exports = { domElements };\n\n\n//# sourceURL=webpack://ndiyakholwa-mnqanqeni-222-memory-game-in-vanilla-js-javascript/./src/dom_elements.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { emojis } = __webpack_require__(/*! ./emojis */ \"./src/emojis.json\");\nconst { domElements } = __webpack_require__(/*! ./dom_elements */ \"./src/dom_elements.js\");\n\ndocument.addEventListener(\"DOMContentLoaded\", function () {\n  initializeGameBoard();\n  restart();\n});\n\nfunction initializeGameBoard() {\n  const gameCards = pickBoardCards(4, 4);\n\n  gameCards.forEach((emoji) => createCard(emoji, gameCards.length));\n}\n\nfunction createCard(emoji, totalCards) {\n  const card = document.createElement(\"div\");\n  card.className = \"item\";\n  card.innerHTML = emoji;\n  domElements.gameContainer().appendChild(card);\n\n  card.onclick = () => handleCardClick(card, totalCards);\n}\n\nfunction handleCardClick(card, totalCards) {\n  let openCards = domElements.openCards();\n  if (openCards.length === 2) {\n    return;\n  }\n  toggleClass(card, \"cardOpen\", \"add\");\n  enableResetButton();\n  openCards = domElements.openCards();\n\n  if (openCards.length === 2) {\n    checkMatch(openCards, totalCards);\n  }\n}\n\nfunction enableResetButton() {\n  toggleClass(domElements.resetBtn(), \"disabled\", \"remove\");\n  domElements.resetBtn().disabled = false;\n}\n\nfunction checkMatch(openCards, totalCards) {\n  const [firstCard, secondCard] = openCards;\n\n  if (firstCard.innerHTML === secondCard.innerHTML) {\n    toggleClass(firstCard, \"cardMatch\", \"add\");\n    toggleClass(secondCard, \"cardMatch\", \"add\");\n    closeOpenCards(openCards);\n\n    if (domElements.matchedCards().length === totalCards) {\n      displayWinMessage();\n    }\n  }\n  setTimeout(() => closeOpenCards(openCards), 600);\n}\n\nfunction closeOpenCards(openCards) {\n  openCards.forEach((card) => toggleClass(card, \"cardOpen\", \"remove\"));\n}\n\nfunction restart() {\n  domElements.resetBtn().addEventListener(\"click\", () => {\n    domElements.gameContainer().innerHTML = \"\";\n    initializeGameBoard();\n    toggleClass(domElements.resetBtn(), \"disabled\", \"add\");\n    domElements.resetBtn().disabled = true;\n    removeWinMessage();\n  });\n}\n\nfunction removeWinMessage() {\n  const message = domElements.message();\n  if (message) message.remove();\n}\n\nfunction pickBoardCards(rows, cols) {\n  const totalCards = (rows * cols) / 2;\n  let selectedCards = shuffle(emojis).slice(0, totalCards);\n  return shuffle([...selectedCards, ...selectedCards]);\n}\n\nfunction shuffle(array) {\n  return array.sort(() => Math.random() - 0.5);\n}\n\nfunction toggleClass(element, className, add) {\n  add === \"add\"\n    ? element.classList.add(className)\n    : element.classList.remove(className);\n}\n\nfunction displayWinMessage() {\n  const messageDiv = document.createElement(\"div\");\n  messageDiv.className = \"winMessage\";\n  messageDiv.innerHTML = \"<h1>Congratulations! You Won!</h1>\";\n  domElements.container().appendChild(messageDiv);\n}\n\nmodule.exports = { restart, initializeGameBoard };\n\n\n//# sourceURL=webpack://ndiyakholwa-mnqanqeni-222-memory-game-in-vanilla-js-javascript/./src/index.js?");

/***/ }),

/***/ "./src/emojis.json":
/*!*************************!*\
  !*** ./src/emojis.json ***!
  \*************************/
/***/ ((module) => {

"use strict";
eval("module.exports = /*#__PURE__*/JSON.parse('{\"emojis\":[\"🧳\",\"🌂\",\"☂️\",\"🧵\",\"🪡\",\"🪢\",\"🪭\",\"🧶\",\"👓\",\"🕶\",\"🥽\",\"🥼\",\"🦺\",\"👔\",\"👕\",\"👖\",\"🧣\",\"🧤\",\"🧥\",\"🧦\",\"👗\",\"👘\",\"🥻\",\"🩴\",\"🩱\",\"🩲\",\"👙\",\"👚\",\"👛\",\"👜\",\"👝\",\"🎒\",\"👞\",\"👟\",\"🥾\",\"👠\",\"👡\",\"🩰\",\"👢\",\"👑\",\"👒\",\"🎩\",\"🎓\",\"🧢\",\"⛑\",\"🪖\",\"💄\",\"💍\",\"💼\",\"🐶\",\"🐱\",\"🐭\",\"🐹\",\"🐰\",\"🐻\",\"🐼\",\"🐻‍❄️\",\"🐨\",\"🐯\",\"🦁\",\"🐮\",\"🐷\",\"🐽\",\"🐸\",\"🐵\",\"🙈\",\"🙉\",\"🙊\",\"🐒\",\"🐔\",\"🐧\",\"🐦\",\"🐦‍⬛\",\"🐤\",\"🐣\",\"🐥\",\"🦆\",\"🦅\",\"🦉\",\"🦇\",\"🐺\",\"🐗\",\"🐴\",\"🦄\",\"🐝\",\"🪱\",\"🐛\",\"🦋\",\"🐌\",\"🐞\",\"🐜\",\"🪰\",\"🪲\",\"🪳\",\"🦟\",\"🦗\",\"🕷\",\"🕸\",\"🦂\",\"🐢\",\"🐍\",\"🦎\",\"🦖\",\"🦕\",\"🐙\",\"🦑\",\"🦐\",\"🦞\",\"🦀\",\"🪼\",\"🪸\",\"🐡\",\"🐠\",\"🐟\",\"🐬\",\"🐳\",\"🐋\",\"🦈\",\"🐊\",\"🐅\",\"🐆\",\"🦓\",\"🫏\",\"🦍\",\"🦧\",\"🦣\",\"🐘\",\"🦛\",\"🦏\",\"🐪\",\"🐫\",\"🦒\",\"🦘\",\"🦬\",\"🐃\",\"🐂\",\"🐄\",\"🐎\",\"🐖\",\"🐏\",\"🦙\",\"🦌\",\"🌵\",\"🎄\",\"🌲\",\"🌳\",\"🌴\",\"🪹\",\"🪺\",\"🪵\",\"🌱\",\"🌿\",\"☘️\",\"🍀\",\"🎍\",\"🪴\",\"🎋\",\"🍃\",\"🍂\",\"🍄\",\"🟫\",\"🐚\",\"🪨\",\"🌾\",\"💐\",\"🌷\",\"🪷\",\"🌹\",\"🥀\",\"🌺\",\"🌸\",\"🪻\",\"🌼\",\"🌻\",\"🌞\",\"🌝\",\"🌛\",\"🌜\",\"🌚\",\"🌕\",\"🌖\",\"🌗\",\"🌑\",\"🌙\",\"🌎\",\"🪐\",\"💫\",\"⭐️\",\"🌟\",\"✨\",\"⚡️\",\"☄️\",\"💥\",\"🔥\",\"🌪\",\"🌈\",\"☀️\",\"⛈\",\"⛄️\",\"💦\"]}');\n\n//# sourceURL=webpack://ndiyakholwa-mnqanqeni-222-memory-game-in-vanilla-js-javascript/./src/emojis.json?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;
"use strict";

class Actions {
  constructor(vimNavigations) {
    this.vimNavigations = vimNavigations;
    this.validKeys = new Set();
    this.keyCombinations = [
      { keyCombination: 'l', action: (...args) => this.scrollRight(...args) },
      { keyCombination: 'j', action: (...args) => this.scrollDown(...args) },
      { keyCombination: 'h', action: (...args) => this.scrollLeft(...args) },
      { keyCombination: 'k', action: (...args) => this.scrollUp(...args) },
      { keyCombination: 'gg', action: (...args) => this.scrollToTop(...args) },
      { keyCombination: 'G', action: (...args) => this.scrollToBottom(...args) },
      { keyCombination: 'gt', action: (...args) => this.nextTab(...args) },
      { keyCombination: 'gT', action: (...args) => this.previousTab(...args) },
    ];
    this.maxKeyCombinationLength = this.keyCombinations.reduce((acc, curr) => Math.max(curr.keyCombination.length, acc), 0);
    this.populateValidKeys();
  }

  populateValidKeys() {
    for(let combinationObject of this.keyCombinations) {
      for (let i = 0; i < combinationObject.keyCombination.length; ++i) {
        this.validKeys.add(combinationObject.keyCombination[i]);
      }
    }
  }

  isValidKey(key) {
    return this.validKeys.has(key);
  }

  getAction(keyCombination) {
    for (let combinationObject of this.keyCombinations) {
      if (combinationObject.keyCombination == keyCombination) return combinationObject.action;
    }

    return null;
  }

  toNumber(repetition) {
    return repetition == "" ? 1 : +repetition;
  }

  scrollRight(repetition) {
    document.body.scrollLeft += this.vimNavigations.horizontalScrollAmount * this.toNumber(repetition);
  }

  scrollDown(repetition) {
    window.scrollByLines(this.vimNavigations.verticalScrollAmount * this.toNumber(repetition));
  }

  scrollLeft(repetition) {
    document.body.scrollLeft -= this.vimNavigations.horizontalScrollAmount * this.toNumber(repetition);
  }

  scrollUp(repetition) {
    window.scrollByLines(-this.vimNavigations.verticalScrollAmount * this.toNumber(repetition));
  }
   
  scrollToTop() {
    window.scrollTo(window.scrollX, 0);
  }

  scrollToBottom() {
    window.scrollTo(window.scrollX, document.body.scrollHeight);
  }

  nextTab(repetition) {
    browser.runtime.sendMessage({
      message: {
        command: 'activateNextTab',
        repetition,
      }
    });
  }

  previousTab(repetition) {
    browser.runtime.sendMessage({
      message: {
        command: 'activatePreviousTab',
        repetition: this.toNumber(repetition),
      }
    });
  }
}
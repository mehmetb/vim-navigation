'use strict';

class Actions {
  /**
   * @param {VimNavigation} vimNavigation VimNavigation instance
   */
  constructor(vimNavigation) {
    this.vimNavigation = vimNavigation;
    this.validKeys = new Set();
    this.keyCombinations = [
      //Arrow functions are necessary to bind the current context
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

  /**
   * Inspects all the key combinations and puts all the chars into the valid keys set.
   * @method
   */
  populateValidKeys() {
    for(let combinationObject of this.keyCombinations) {
      for (let i = 0; i < combinationObject.keyCombination.length; ++i) {
        this.validKeys.add(combinationObject.keyCombination[i]);
      }
    }
  }

  /**
   * Checks if the given key is in the valid keys set.
   * @param {string} key A single key (char)
   * @returns {boolean}
   */
  isValidKey(key) {
    return this.validKeys.has(key);
  }

  /**
   * Loops through all the available actions and returns the function if the key combination matches.
   * @param {string} keyCombination Key combination 
   * @returns {null|function}
   */
  getAction(keyCombination) {
    for (let combinationObject of this.keyCombinations) {
      if (combinationObject.keyCombination == keyCombination) return combinationObject.action;
    }

    return null;
  }

  /**
   * Converts the repetition.
   * @param {string} repetition 
   * @return {number}
   */
  toNumber(repetition) {
    return repetition == '' ? 1 : +repetition;
  }

  scrollRight(repetition) {
    document.body.scrollLeft += this.vimNavigation.horizontalScrollAmount * this.toNumber(repetition);
  }

  scrollDown(repetition) {
    window.scrollByLines(this.vimNavigation.verticalScrollAmount * this.toNumber(repetition));
  }

  scrollLeft(repetition) {
    document.body.scrollLeft -= this.vimNavigation.horizontalScrollAmount * this.toNumber(repetition);
  }

  scrollUp(repetition) {
    window.scrollByLines(-this.vimNavigation.verticalScrollAmount * this.toNumber(repetition));
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
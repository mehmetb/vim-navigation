"use strict";

class VimNavigations {
  constructor(options = {}) {
    const DEFAULTS = {
      scrollBy: {
        vertical: 1,
        horizontal: 10,
      }
    };

    this.options = { ...DEFAULTS, ...options };
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.keyHistory = '';
    this.repetitionHistory = '';
    this.actions = new Actions(this);
  }

  get verticalScrollAmount() {
    return this.options.scrollBy.vertical;
  }

  set verticalScrollAmount(val) {
    this.options.scrollBy.vertical = val;
  }

  get horizontalScrollAmount() {
    return this.options.scrollBy.horizontal;
  }

  set horizontalScrollAmount(val) {
    this.options.scrollBy.horizontal = val;
  }

  resetHistory() {
    this.keyHistory = '';
    this.repetitionHistory = '';
  }

  isTextField(target) {
    const isContentEditable = target.getAttribute('contenteditable');
    const isFormElement = /input|textare|select/i.test(target.tagName);

    return isContentEditable || isFormElement;
  }
 
  handleKeyPress(event) {
    //If we are in an editable field, then we shouldn't invoke the actions
    if (this.isTextField(event.target)) return this.resetHistory();

    //Check if a number key is pressed
    if(!isNaN(+event.key)) {
      this.repetitionHistory += event.key;
      return;
    }

    //If an invalid key is pressed, reset history and return
    if(!this.actions.isValidKey(event.key)) return this.resetHistory(); 

    this.keyHistory += event.key;

    const action = this.actions.getAction(this.keyHistory);
    
    if (action === null) {
      if (this.keyHistory.length >= this.actions.maxKeyCombinationLength) return this.resetHistory();
    } else {
      action(this.repetitionHistory);
      this.resetHistory();
    }
  }
}
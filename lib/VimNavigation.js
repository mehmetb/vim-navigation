'use strict';

class VimNavigation {
  constructor() {
    this.options = {};
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.keyHistory = '';
    this.repetitionHistory = '';

    this.actions = new Actions(this);
    this.storageController = new StorageController();
    this.horizontalScrollAmount = DEFAULTS.horizontalScrollAmount;
    this.verticalScrollAmount = DEFAULTS.verticalScrollAmount;
    this.bindStorageChangeListener();
  }

  get verticalScrollAmount() {
    return this.options.verticalScrollAmount;
  }

  set verticalScrollAmount(val) {
    this.options.verticalScrollAmount = val;
  }

  get horizontalScrollAmount() {
    return this.options.horizontalScrollAmount;
  }

  set horizontalScrollAmount(val) {
    this.options.horizontalScrollAmount = val;
  }

  resetHistory() {
    this.keyHistory = '';
    this.repetitionHistory = '';
  }

  /**
   * Returns true if the target is a form element or it's contenteditable attribute is set
   * @param {HTMLElement} target 
   * @returns {boolean}
   */
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
      //Reset history if the key history reached the longest key combination's length
      if (this.keyHistory.length >= this.actions.maxKeyCombinationLength) return this.resetHistory();
    } else {
      action(this.repetitionHistory);
      this.resetHistory();
    }
  }

  bindStorageChangeListener() {
    this.storageController.on('onChange', (changes) => {
      const keys = Object.keys(changes);

      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];

        if (changes[key].oldValue !== changes[key].newValue) {
          switch (key) {
            case 'verticalScrollAmount':
              this.verticalScrollAmount = changes[key].newValue;
              break;

            case 'horizontalScrollAmount':
              this.horizontalScrollAmount = changes[key].newValue;
              break;

            default:
              break;
          }
        }
      }
    });
  }
}
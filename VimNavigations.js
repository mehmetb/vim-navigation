"use strict";

class VimNavigations {
  constructor() {
    this.options = {};
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.keyHistory = '';
    this.repetitionHistory = '';

    //Default storage type
    this.storageType = 'sync';
    this.actions = new Actions(this);
    this.initReloadStorage();
    this.bindStorageChangeListener();
  }

  get defaultOptions() {
    return {
      verticalScrollAmount: 1,
      horizontalScrollAmount: 10,
    };
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

  async initReloadStorage() {
    try {
      const localOptions = browser.storage.local.get(['horizontalScrollAmount', 'verticalScrollAmount', 'storageType']);
      const syncOptions = browser.storage.sync.get(['horizontalScrollAmount', 'verticalScrollAmount']);
      const results = await Promise.all([syncOptions, localOptions]);
      const defaultOptions = this.defaultOptions;
      let options = { };

      if (Object.keys(results[1]).length && results[1].storageType == 'local') {
        this.storageType = 'local';
        options = { ...results[1] };
      } else {
        options = { ...results[0] };
      }

      if (Object.keys(options).length == 0) {
        this.horizontalScrollAmount = defaultOptions.horizontalScrollAmount;
        this.verticalScrollAmount = defaultOptions.verticalScrollAmount;
      } else {
        this.horizontalScrollAmount = options.horizontalScrollAmount;
        this.verticalScrollAmount = options.verticalScrollAmount;
      }
    } catch (ex) {
      console.error('vim-navigations: Cannot acces storage area, using default options.');
      this.horizontalScrollAmount = defaultOptions.horizontalScrollAmount;
      this.verticalScrollAmount = defaultOptions.verticalScrollAmount;
    }
  }

  bindStorageChangeListener() {
    browser.storage.onChanged.addListener((changes, storageType) => {
      if (this.storageType !== storageType) return;

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

  async loadOptionsFromStorage(storageType) {
    try {
      const options = await browser.storage[storageType].get(['horizontalScrollAmount', 'verticalScrollAmount']);
      const defaultOptions = this.defaultOptions;

      if (Object.keys(options).length == 0) {
        this.horizontalScrollAmount = defaultOptions.horizontalScrollAmount;
        this.verticalScrollAmount = defaultOptions.verticalScrollAmount;
      } else {
        this.horizontalScrollAmount = options.horizontalScrollAmount;
        this.verticalScrollAmount = options.verticalScrollAmount;
      }
    } catch (ex) {
    }
  }

  setStorageType(val) {
    this.storageType = val;
    this.loadOptionsFromStorage(this.storageType);
  }
}
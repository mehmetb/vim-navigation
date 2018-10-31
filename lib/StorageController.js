'use strict';

class StorageController extends EventEmitter {
  constructor() {
    super();
    this.storageData = DEFAULTS;
    this.initialized = false;
    this.init();
  }

  async init() {
    this.on('initialized', () => {
      this.initialized = true;
    });


    //Subscribe to storage change events
    browser.storage.onChanged.addListener((...args) => this.onChangeHandler(...args));

    try {
      //Get all the keys from local storage and sync storage
      const localStoragePromise = browser.storage.local.get(null);
      const syncStoragePromise = browser.storage.sync.get(null);
      const [localData, syncData] = await Promise.all([localStoragePromise, syncStoragePromise]);
      const localKeys = Object.keys(localData);
      const syncKeys = Object.keys(syncData);

      if (localKeys.length && localData.storageType == 'local') {
        this.handleStorageChange('local');
        return;
      }

      if (localKeys.length && localData.storageType == 'sync' && syncKeys.length) {
        this.handleStorageChange('sync');
        return;
      }

      throw 'Storage has not been used yet';
    } catch (ex) {
      //Default storage type is sync
      this.storageType = 'sync';
      this.storageData = DEFAULTS;
    } finally {
      this.emit('initialized');
    }
  }

  getData() {
    return new Promise(resolve => {
      if (this.initialized) return resolve(this.storageData);

      this.on('initialized', () => resolve(this.storageData));
    });
  }

  getStorageType() {
    return this.storageType;
  }

  onChangeHandler(changes, area) {
    if (area == 'local') {
      //Here, we are checking if the user changed the storage preference
      const keys = Object.keys(changes);

      if (keys.includes('storageType') && changes.storageType.newValue !== changes.storageType.oldValue) {
        this.handleStorageChange(changes.storageType.newValue);
        return;
      }
    }
    
    if (area !== this.storageType) return;

    this.updateStorageData(changes);
    this.emit('onChange', changes);
  }

  async handleStorageChange(newStorageType) {
    try {
      let newStorageData = await browser.storage[newStorageType].get(null);
      let newStorageKeys = Object.keys(newStorageData);
      const oldStorageData = this.storageData;
      const changes = {};

      if (newStorageKeys.filter(key => key !== 'storageType').length == 0) {
        newStorageData = { ...DEFAULTS, ...newStorageData };
        newStorageKeys = Object.keys(newStorageData);
      }

      for (let key of newStorageKeys) {
        changes[key] = {
          oldValue: oldStorageData[key],
          newValue: newStorageData[key],
        };
      }

      this.storageType = newStorageType;
      this.storageData = newStorageData;
      this.emit('onChange', changes);
    } catch (ex) {
    }
  }

  updateStorageData(changes) {
    const keys = Object.keys(changes);
    const newData = {};

    for (let key of keys) newData[key] = changes[key].newValue;

    this.storageData = { ...this.storageData, ...newData };
  }
}
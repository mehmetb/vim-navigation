const verticalInput = document.getElementById('verticalScrollAmount');
const horizontalInput = document.getElementById('horizontalScrollAmount');
const updateButton = document.getElementById('btnUpdate');
const localStorageRadio = document.getElementById('localStorage');
const syncStorageRadio = document.getElementById('syncStorage');
const defaults = {
    verticalScrollAmount: 1,
    horizontalScrollAmount: 10,
};

async function loadSettings(storageType) {
  try {
    const options = await browser.storage[storageType].get(['horizontalScrollAmount', 'verticalScrollAmount']);

    if (Object.keys(options).length == 0) {
      verticalInput.value = defaults.verticalScrollAmount;
      horizontalInput.value = defaults.horizontalScrollAmount;
    } else {
      verticalInput.value = options.verticalScrollAmount;
      horizontalInput.value = options.horizontalScrollAmount;
    }
  } catch (ex) {
    verticalInput.value = defaults.verticalScrollAmount;
    horizontalInput.value = defaults.horizontalScrollAmount;
  }
}

async function init() {
  try {
    const localOptions = browser.storage.local.get(['horizontalScrollAmount', 'verticalScrollAmount', 'storageType']);
    const syncOptions = browser.storage.sync.get(['horizontalScrollAmount', 'verticalScrollAmount']);
    const results = await Promise.all([syncOptions, localOptions]);
    let options = { ...results[0] };

    if (Object.keys(results[1]).length && results[1].storageType == 'local') {
      localStorageRadio.setAttribute('checked', 'checked');
      options = { ...results[1] };
    }

    if (Object.keys(options).length == 0) {
      verticalInput.value = defaults.verticalScrollAmount;
      horizontalInput.value = defaults.horizontalScrollAmount;
    } else {
      verticalInput.value = options.verticalScrollAmount;
      horizontalInput.value = options.horizontalScrollAmount;
    }
  } catch (ex) {
    verticalInput.value = defaults.verticalScrollAmount;
    horizontalInput.value = defaults.horizontalScrollAmount;
  }
}

async function updateStorageType(storageType, callback) {
  const tabs = await browser.tabs.query({}); 
  let completed = 0;

  for (let tab of tabs) {
    browser.tabs.sendMessage(
      tab.id,
      {
        message: {
          command: 'updateStorageType',
          storageType,
        },
      }
    ).then(() => {
      if (++completed == tabs.length) callback();
    }).catch(err => {
      if (++completed == tabs.length) callback();
    });
  }
}

localStorageRadio.addEventListener('change', () => {
  loadSettings('local');
  updateStorageType('local', () => {
    browser.storage.local.set({
      'storageType': 'local',
    });
  });
}, false);

syncStorageRadio.addEventListener('change', () => {
  loadSettings('sync');
  updateStorageType('sync', () => {
    browser.storage.local.set({
      'storageType': 'sync',
    });
  });
}, false);

updateButton.addEventListener('click', async () => {
  const storageType = localStorageRadio.checked ? 'local' : 'sync';

  updateStorageType(storageType, () => {
    if (storageType == 'local') {
      browser.storage.local.set({
        'verticalScrollAmount': +verticalInput.value,
        'horizontalScrollAmount': +horizontalInput.value,
        'storageType': 'local',
      });
    } else {
      browser.storage.local.set({
        'storageType': 'sync',
      });
      browser.storage.sync.set({
        'verticalScrollAmount': +verticalInput.value,
        'horizontalScrollAmount': +horizontalInput.value,
      });
    }
  });
}, false);

init();
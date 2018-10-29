const verticalInput = document.getElementById('verticalScrollAmount');
const horizontalInput = document.getElementById('horizontalScrollAmount');
const updateButton = document.getElementById('btnUpdate');
const defaults = {
    verticalScrollAmount: 1,
    horizontalScrollAmount: 10,
};

async function init() {
  try {
    const localOptions = browser.storage.local.get(['horizontalScrollAmount', 'verticalScrollAmount']);
    const syncOptions = browser.storage.sync.get(['horizontalScrollAmount', 'verticalScrollAmount']);
    const results = await Promise.all([syncOptions, localOptions]);
    const options = { ...results[0], ...results[1] };

    if (Object.keys(results[1]).length) {
      document.getElementById('localStorage').setAttribute('checked', 'checked');
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

updateButton.addEventListener('click', async () => {
  const storageType = document.getElementById('localStorage').checked ? 'local' : 'sync';

  updateStorageType(storageType, () => {
    if (storageType == 'local') {
      browser.storage.local.set({
        'verticalScrollAmount': +verticalInput.value,
        'horizontalScrollAmount': +horizontalInput.value,
      });
    } else {
      browser.storage.local.clear();
      browser.storage.sync.set({
        'verticalScrollAmount': +verticalInput.value,
        'horizontalScrollAmount': +horizontalInput.value,
      });
    }
  });
}, false);

init();
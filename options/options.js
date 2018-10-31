const verticalInput = document.getElementById('verticalScrollAmount');
const horizontalInput = document.getElementById('horizontalScrollAmount');
const updateButton = document.getElementById('btnUpdate');
const localStorageRadio = document.getElementById('localStorage');
const syncStorageRadio = document.getElementById('syncStorage');
const storageController = new StorageController();

async function init() {
  try {
    const options = await storageController.getData();

    verticalInput.value = options.verticalScrollAmount;
    horizontalInput.value = options.horizontalScrollAmount;

    if (options.skipPinnedTabs === true) {
      document.getElementById('skipNo').removeAttribute('checked');
      document.getElementById('skipYes').setAttribute('checked', 'checked');
    } else {
      document.getElementById('skipYes').removeAttribute('checked');
      document.getElementById('skipNo').setAttribute('checked', 'checked');
    }

    switch (storageController.getStorageType()) {
      case 'local':
        localStorageRadio.setAttribute('checked', 'checked');
        break;

      default:
        syncStorageRadio.setAttribute('checked', 'checked');
        break;
    }
  } catch (ex) {
    //We should never reach here
  }
}

storageController.on('onChange', () => init());
localStorageRadio.addEventListener('change', () => browser.storage.local.set({ storageType: 'local' }));
syncStorageRadio.addEventListener('change', () => browser.storage.local.set({ storageType: 'sync' })); 

updateButton.addEventListener('click', async () => {
  const storageType = localStorageRadio.checked ? 'local' : 'sync';
  const skipPinnedTabs = document.getElementById('skipYes').checked === true;

  if (storageType == 'local') {
    browser.storage.local.set({
      'verticalScrollAmount': +verticalInput.value,
      'horizontalScrollAmount': +horizontalInput.value,
      'skipPinnedTabs': skipPinnedTabs,
      'storageType': 'local',
    });
  } else {
    await browser.storage.sync.set({
      'verticalScrollAmount': +verticalInput.value,
      'horizontalScrollAmount': +horizontalInput.value,
      'skipPinnedTabs': skipPinnedTabs,
    });
    browser.storage.local.set({ storageType: 'sync' });
  }
}, false);

init();
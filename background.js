'use strict';

let { skipPinnedTabs } = DEFAULTS;
const storageController = new StorageController();

/**
 * Math modulo. Always returns a positive result
 * @param {number} number 
 * @param {number} modulosOf 
 * @returns {number}
 */
function positiveModulo(number, modulosOf) {
  const mod = number % modulosOf;

  if (mod >= 0) return mod;

  return mod + modulosOf;
}

/**
 * Handles tab navigation.
 * @param {object} currentTab The tab (content-script) which ran the action. 
 * {@link https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/Tab|tabs.Tab} object. 
 * @param {string} commandRepetition {i}g(t/T). The i is command repetition. 
 * @param {string} direction next/prev
 */
async function activateTab(currentTab, commandRepetition, direction) {
  try {
    const { id, windowId } = currentTab;
    let query = skipPinnedTabs ? { pinned: false } : {};
    query = { ...query, windowId, hidden: false };
    const tabs = await browser.tabs.query(query);
    const tabCount = tabs.length;
    let tabIndex = null;
    let index;

    for (let i = 0; i < tabs.length; ++i) {
      if (tabs[i].id == id) {
        index = i;
        break;
      }
    }

    switch (direction) {
      case 'next':
        if (skipPinnedTabs && currentTab.pinned) index = -1;

        //If no repetition, then we just want to navigate to the next tab
        if (commandRepetition == '' || commandRepetition == '0') {
          tabIndex = (index + 1) % tabCount;
        } else if (+commandRepetition <= tabCount) {
          //This is a special case: 5gt means "go to the 5th tab"
          //@see {@link http://vim.wikia.com/wiki/Using_tab_pages|Using tab pages} Navigation section
          //Since the tab index is zero-based, subtract 1 from the desired index.
          tabIndex = +commandRepetition - 1;
        }
        break;

      case 'prev':
        if (skipPinnedTabs && currentTab.pinned) index = 0;

        tabIndex = positiveModulo(index - +commandRepetition, tabCount);
        break;

      default:
        break;
    }

    if (tabIndex !== null) {
      browser.tabs.update(tabs[tabIndex].id, { active: true });
    }
  } catch (ex) {
    //TODO: Handle error?
  }
}

//Listen the messages sent by the content-script.js
browser.runtime.onMessage.addListener((request, sender) => {
  const { command, repetition } = request.message;

  switch (command) {
    case 'activateNextTab':
      activateTab(sender.tab, repetition, 'next');
      break;
  
    case 'activatePreviousTab':
      activateTab(sender.tab, repetition, 'prev');
      break;
  
    default:
      break;
  }
});

storageController.on('onChange', changes => {
  const keys = Object.keys(changes);

  for (let key of keys) {
    if (changes[key].oldValue === changes[key].newValue) continue;

    switch (key) {
      case 'skipPinnedTabs':
        skipPinnedTabs = changes[key].newValue;
        break;

      default:
        break;
    }
  }
});
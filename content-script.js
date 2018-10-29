"use strict";

const vimNavigations = new VimNavigations();

document.addEventListener("keypress", vimNavigations.handleKeyPress, false);

browser.runtime.onMessage.addListener((request, sender) => {
  const { command } = request.message;

  switch (command) {
    case 'updateStorageType':
      vimNavigations.setStorageType(request.message.storageType);
      break;
  
    default:
      break;
  }
});
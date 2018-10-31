'use strict';

const vimNavigation = new VimNavigation();

document.addEventListener('keypress', vimNavigation.handleKeyPress, false);
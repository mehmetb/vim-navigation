# vim-navigation
*A browser add-on for vim-style scrolling and tab navigation*

If you're using vim a lot, you might have accidentally pressed j or gt in your browser. You are not alone :) 

## Installation

- [vim-navigation at Mozilla Add-ons](https://addons.mozilla.org/en-US/firefox/addon/vim-navigation/)

## Features

- Supports scrolling with <kbd>h</kbd> (left), <kbd>j</kbd> (bottom), <kbd>k</kbd> (up), <kbd>l</kbd> (right).
- Supports <kbd>g</kbd><kbd>g</kbd> (to top) and <kbd>Shift</kbd>+<kbd>g</kbd> (to bottom).
- Supports <kbd>g</kbd><kbd>t</kbd> (next tab) and <kbd>g</kbd><kbd>T</kbd> (previous tab).
- Supports command repetition as in vim. `100j` will scroll down 100 lines.

Note that `{i}`<kbd>g</kbd><kbd>t</kbd> works as vim's `gt`. So <kbd>2</kbd><kbd>g</kbd><kbd>t</kbd> means "go to the second tab" (the first tab's index is 1)

## Contributions

Issues and pull requests are welcome! 

## Credits

- I first forked [autonome](https://github.com/autonome)'s [vimkeybindings](https://github.com/autonome/vimkeybindings). In fact, I've even created a pull request. But then the code changed so much and I created this repo to maintain it.

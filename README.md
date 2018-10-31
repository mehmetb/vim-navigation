# vim-navigation
*A browser add-on for vim-style scrolling and tab navigation*

If you're using vim a lot, you might have accidentally pressed j or gt in your browser. You are not alone :) 

## Installation

- [vim-navigation at Mozilla Add-ons](https://addons.mozilla.org/en-US/firefox/addon/vim-navigation/)

## Features

- Supports scrolling with h (left), j (bottom), k (up), l (right).
- Supports gg (to top) and Shift+g (to bottom).
- Supports gt (next tab) and gT (previous tab).
- Supports command repetition as in vim. 100j will scroll down 100 lines.

Note that {i}gt works as vim's gt. So 2gt means "go to the second tab" (the first tab's index is 1)

## Contributions

- You can create issues.
- Pull requests are welcome.

## Credits

- I first forked [autonome](https://github.com/autonome)'s [vimkeybindings](https://github.com/autonome/vimkeybindings). In fact, I've even created a pull request. But then the code changed so much and I created this repo to maintain it.

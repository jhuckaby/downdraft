# Overview

This module converts Markdown source code on your clipboard to fully styled HTML, and places that back on the clipbaord for you.  This can be helpful if you want to draft an email in your text editor using Markdown, then hit a single [Global Keyboard Shortcut](#global-keyboard-shortcut) to convert it to styled HTML, ready for pasting in your email app of choice.  It handles syntax-highlighted code blocks, and GFM features like tables.

Note that this module currently only works on macOS.

# Usage

First, make sure you have [Node.js](https://nodejs.org/en/download/) installed on your Mac.  Then, use [npm](https://www.npmjs.com/) to install the module as a command-line executable like so:

```sh
npm install -g downdraft
```

Depending on your machine and folder permissions, you might have to run the above command with `sudo`.

Now, try copying some Markdown source to your clipboard, and enter the following command into the Terminal:

```sh
downdraft
```

That's it!  Now try pasting into your email app, and you will see nice HTML formatted content, with things like styling, links, lists, and tables automatically converted.

## Global Keyboard Shortcut

To add a global keyboard shortcut on macOS, you first need to wrap the call to `downdraft` in an AppleScript.  To do this, open the **Script Editor** application (located in Applications/Utilities), and enter this text:

```applescript
do shell script "/usr/local/bin/node /usr/local/bin/downdraft"
```

Please note that the location of your Node.js binary may be different than mine, so change `/usr/local/bin/node` to the correct location.  To determine what this should be, open Terminal and type `which node`.  This is important because AppleScripts run without a proper shell environment, so they are often missing things like your standard `PATH` variable.

Also note that the location of the installed `downdraft` binary may differ from mine, so change `/usr/local/bin/downdraft` to the correct location.  To determine what this should be, open Terminal and type `which downdraft`.

Once this is complete, save your AppleScript somewhere central such as in `~/Library/Scripts/`.

Next, you need to assign a global keyboard shortcut to the script.  To do this, you can either use a commercial application such as [Alfred](http://www.alfredapp.com/), [Keyboard Maestro](http://www.keyboardmaestro.com/main/), or [FastScripts](http://www.red-sweater.com/fastscripts/index.html), or you can do it the manual way...

1. Open **Automator** (located in your /Applications folder).
2. In the dialog that pops up, select **Quick Action** and click the **Choose** button.
3. In the search field on the left sidebar, enter `applescript`.
4. Drag the **Run AppleScript** action to the right-hand pane.
5. Paste the `do shell script...` line into the text field, replacing all the demo code.
6. From the menu bar, select **File** → **Save...** and give it a name such as `Downdraft`.
7. Quit Automator.
8. Open **System Settings**, then click on the **Keyboard** icon.
9. Click on the **Keyboard Shortcuts** button, then click on **⚙️Services** on the left side.
10. Scroll down the right pane until you see your Quick Action (should be under **General**).
11. Double-click on the right-hand side of the shortcut which should say "**none**".
12. Type your desired keyboard shortcut.
13. Click **Done**.
13. Quit System Settings.

**Note:** These instructions are for macOS Sonoma specifically.  Things may be quite different in older or newer OS versions.

# License (MIT)

**The MIT License**

*Copyright (c) 2024 Joseph Huckaby.*

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

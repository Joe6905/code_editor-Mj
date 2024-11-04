# Simple Code Compiler with Full-Screen Mode

This project is a simple code compiler that supports HTML, CSS, JavaScript, and Python code. The interface includes a code editor with syntax highlighting and the ability to toggle full-screen mode using `Ctrl+F` for distraction-free coding.

## Features

- **Tabbed Code Editor**: Switch easily between HTML, CSS, JavaScript, and Python tabs.
- **Syntax Highlighting**: Provides CodeMirror-based syntax highlighting for a better coding experience.
- **Run Code**: Preview your HTML, CSS, and JavaScript code directly in the output pane. Python code output is displayed in a separate area.
- **Full-Screen Toggle**: Go full-screen with `Ctrl+F` for a distraction-free coding experience.
- **Download Output**: Download the HTML output as a `.html` file for quick access.

## How to Use

1. **Switch between languages**: Use the tabs to navigate between HTML, CSS, JavaScript, and Python editors.
2. **Run Code**: Click the "Run" button to execute your code.
3. **Full-Screen Mode**: Press `Ctrl+F` to toggle full-screen mode on and off.
4. **Download Output**: Click the "Download" button to download the compiled HTML output.

## Keyboard Shortcuts

- **Toggle Full-Screen**: `Ctrl+F`

## Full-Screen Function Implementation

The full-screen function is implemented using JavaScript with the Fullscreen API. When `Ctrl+F` is pressed, it triggers the `toggleFullScreen()` function:

javascript
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key === 'f') {
    event.preventDefault();
    toggleFullScreen();
  }
});

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

Explanation
Event Listener: This code listens for keydown events, specifically Ctrl+F, and prevents the default behavior (search).
toggleFullScreen():
Enters full-screen mode if not already in full-screen.
Exits full-screen mode if it’s currently active.
Functions
Here is a list of all functions used in the project:

showEditor(editor):

Displays the selected code editor (HTML, CSS, JavaScript, or Python) by toggling visibility.
Refreshes the editor when it becomes visible.
showMoreLanguages():

Currently shows an alert indicating that more languages will be added in the future.
runCode():

Compiles and runs the code written in the HTML, CSS, JavaScript, and Python editors.
For HTML, CSS, and JavaScript, it updates an iframe with the combined output.
For Python, it runs the code and overrides the print function to display output in a designated area.
downloadOutput():

Creates a downloadable HTML file from the output generated in the iframe.
Uses the Blob API to create a downloadable link for the output.
toggleFullScreen():

Toggles the full-screen mode for the application.
Uses the Fullscreen API to request or exit full-screen mode.
Dependencies
CodeMirror: For syntax highlighting and code editing.
Brython: Allows execution of Python code within the browser.
JSZip: For potential file management features.
Setup
Clone the repository or download the files.
Open index.html in your preferred browser.
Start coding in the editor and enjoy the full-screen feature with Ctrl+F!
License
This project is open source and available under the MIT License.

Future Enhancements
Support for more programming languages.
Additional downloadable output formats.
Enhanced UI for better user experience.
Happy coding!

// Initialize CodeMirror editors
let htmlEditor = CodeMirror.fromTextArea(
  document.getElementById("html"),
  {
    mode: "xml",
    theme: "lesser-dark",
    lineNumbers: true
  }
);

let cssEditor = CodeMirror.fromTextArea(
  document.getElementById("css"),
  {
    mode: "css",
    theme: "lesser-dark",
    lineNumbers: true
  }
);

let jsEditor = CodeMirror.fromTextArea(
  document.getElementById("js"),
  {
    mode: "javascript",
    theme: "lesser-dark",
    lineNumbers: true
  }
);

let pythonEditor = CodeMirror.fromTextArea(
  document.getElementById("python"),
  {
    mode: "python",
    theme: "lesser-dark",
    lineNumbers: true
  }
);

// Show selected editor and hide others
function showEditor(editor) {
  // Hide all editors
  document.querySelectorAll('.CodeMirror')
    .forEach(el => el.classList.add('hidden'));

  // Remove active class from all tabs
  document.querySelectorAll('.tab')
    .forEach(tab => tab.classList.remove('active'));

  // Add active class to selected tab
  document.querySelector(`.tab[onclick="showEditor('${editor}')"]`)
    .classList.add('active');

  // Show the selected editor
  if (editor === 'html') {
    htmlEditor.getWrapperElement().classList.remove('hidden');
  } else if (editor === 'css') {
    cssEditor.getWrapperElement().classList.remove('hidden');
  } else if (editor === 'js') {
    jsEditor.getWrapperElement().classList.remove('hidden');
  } else if (editor === 'python') {
    pythonEditor.getWrapperElement().classList.remove('hidden');
  }
}

// Load content from a file into the appropriate editor
function loadFile() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    const content = e.target.result;
    const extension = file.name.split('.').pop().toLowerCase();

    // Load file content based on extension
    if (extension === 'html') {
      htmlEditor.setValue(content);
    } else if (extension === 'css') {
      cssEditor.setValue(content);
    } else if (extension === 'js') {
      jsEditor.setValue(content);
    } else if (extension === 'py') {
      pythonEditor.setValue(content);
    }
  };

  reader.readAsText(file);
}

// Run the code in the editors and display the output
function runCode() {
  const html = htmlEditor.getValue();
  const css = `<style>${cssEditor.getValue()}</style>`;
  const js = `<script>${jsEditor.getValue()}<\/script>`;

  const outputFrame = document.getElementById('output');
  const outputDocument = outputFrame.contentDocument || outputFrame.contentWindow.document;

  outputDocument.open();
  outputDocument.write(html + css + js);
  outputDocument.close();

  // Run Python code using Brython and Pyodide
  const pythonCode = pythonEditor.getValue();
  document.getElementById('python-output').innerText = "Running Python...";

  try {
    brython({ debug: 1, ipython: 1 });
    pyodide.runPython(pythonCode);
  } catch (e) {
    document.getElementById('python-output').innerText = `Error: ${e}`;
  }
}

// Save the code files into a zip and allow the user to download it
function saveFiles() {
  const files = {
    "index.html": htmlEditor.getValue(),
    "style.css": cssEditor.getValue(),
    "script.js": jsEditor.getValue(),
    "script.py": pythonEditor.getValue()
  };

  const zip = new JSZip();

  // Add files to the zip
  for (let filename in files) {
    zip.file(filename, files[filename]);
  }

  // Generate and download the zip file
  zip.generateAsync({ type: "blob" }).then(function(content) {
    saveAs(content, "project.zip");
  });
}
document.addEventListener('keydown', function(event) {
  // Prevent default action for Ctrl+F (to avoid opening browser search)
  if (event.ctrlKey && event.key === 'f') {
    event.preventDefault();
    toggleFullScreen();
  }

  // Show Output in Another Page (Ctrl+Q)
  if (event.ctrlKey && event.key === 'q') {
    openOutputInNewPage();
  }
});

function toggleFullScreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen(); // Request full-screen on the whole document
  }
}

function openOutputInNewPage() {
  const html = htmlEditor.getValue();
  const css = `<style>${cssEditor.getValue()}</style>`;
  const js = `<script>${jsEditor.getValue()}<\/script>`;
  const pythonCode = pythonEditor.getValue();

  const newWindow = window.open('', '', 'width=800,height=600');
  newWindow.document.write('<html><head><title>Output</title></head><body>');

  if (document.querySelector('.tab.active').textContent.trim() !== "Python") {
    newWindow.document.write(html + css + js);
  } else {
    newWindow.document.write('<pre>' + pythonCode + '</pre>'); // Show Python code (adjust with Brython if needed)
  }

  newWindow.document.write('</body></html>');
  newWindow.document.close();
}

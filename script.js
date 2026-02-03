// ================= CodeMirror Setup =================
let htmlEditor = CodeMirror.fromTextArea(document.getElementById("html"), {
  mode: "xml",
  theme: "lesser-dark",
  lineNumbers: true
});

let cssEditor = CodeMirror.fromTextArea(document.getElementById("css"), {
  mode: "css",
  theme: "lesser-dark",
  lineNumbers: true
});

let jsEditor = CodeMirror.fromTextArea(document.getElementById("js"), {
  mode: "javascript",
  theme: "lesser-dark",
  lineNumbers: true
});

let pythonEditor = CodeMirror.fromTextArea(document.getElementById("python"), {
  mode: "python",
  theme: "lesser-dark",
  lineNumbers: true
});

// ================= Tab Switching =================
function showEditor(editor) {
  document.querySelectorAll('.CodeMirror').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.querySelector(`.tab[onclick="showEditor('${editor}')"]`).classList.add('active');

  if (editor === 'html') htmlEditor.getWrapperElement().classList.remove('hidden');
  else if (editor === 'css') cssEditor.getWrapperElement().classList.remove('hidden');
  else if (editor === 'js') jsEditor.getWrapperElement().classList.remove('hidden');
  else if (editor === 'python') pythonEditor.getWrapperElement().classList.remove('hidden');
}

// ================= Load File =================
function loadFile() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const content = e.target.result;
    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === 'html') htmlEditor.setValue(content);
    else if (ext === 'css') cssEditor.setValue(content);
    else if (ext === 'js') jsEditor.setValue(content);
    else if (ext === 'py') pythonEditor.setValue(content);
  };
  reader.readAsText(file);
}

// ================= Run Code =================
function runCode() {
  const html = htmlEditor.getValue();
  const css = `<style>${cssEditor.getValue()}</style>`;
  const js = `<script>${jsEditor.getValue()}<\/script>`;

  const outputFrame = document.getElementById('output');
  const doc = outputFrame.contentDocument || outputFrame.contentWindow.document;

  doc.open();
  doc.write(html + css + js);
  doc.close();

  // Python (Brython)
  const pythonCode = pythonEditor.getValue();
  document.getElementById('python-output').textContent = '';

  if (pythonCode) {
    document.getElementById('python-output-container').style.display = 'block';

    window.print = (...args) => {
      document.getElementById('python-output').textContent += args.join(' ') + "\n";
    };

    brython();
    exec(pythonCode);
  }
}

// Auto run on change
htmlEditor.on("change", runCode);
cssEditor.on("change", runCode);
jsEditor.on("change", runCode);
pythonEditor.on("change", runCode);

// ================= Save Files =================
function saveFiles() {
  const zip = new JSZip();

  if (htmlEditor.getValue()) zip.file("index.html", htmlEditor.getValue());
  if (cssEditor.getValue()) zip.file("styles.css", cssEditor.getValue());
  if (jsEditor.getValue()) zip.file("script.js", jsEditor.getValue());
  if (pythonEditor.getValue()) zip.file("script.py", pythonEditor.getValue());

  zip.generateAsync({ type: "blob" }).then(content => {
    saveAs(content, "code_files.zip");
  });
}

// ================= Keyboard Shortcuts =================
document.addEventListener('keydown', e => {
  // Ctrl + F → Fullscreen page
  if (e.ctrlKey && e.key === 'f') {
    e.preventDefault();
    toggleFullScreen();
  }

  // Ctrl + Q → Output in new page
  if (e.ctrlKey && e.key === 'q') {
    e.preventDefault();
    openOutputInNewPage();
  }

  // Ctrl + O → Fullscreen output only
  if (e.ctrlKey && e.key === 'o') {
    e.preventDefault();
    fullscreenOutput();
  }
});

// ================= Fullscreen Page =================
function toggleFullScreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
}

// ================= Fullscreen Output (Same Page) =================
function fullscreenOutput() {
  const outputFrame = document.getElementById('output');

  if (!document.fullscreenElement) {
    if (outputFrame.requestFullscreen) outputFrame.requestFullscreen();
    else if (outputFrame.webkitRequestFullscreen) outputFrame.webkitRequestFullscreen();
    else if (outputFrame.msRequestFullscreen) outputFrame.msRequestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// ================= Output in New Page =================
function openOutputInNewPage() {
  const html = htmlEditor.getValue();
  const css = `<style>${cssEditor.getValue()}</style>`;
  const js = `<script>${jsEditor.getValue()}<\/script>`;
  const pythonCode = pythonEditor.getValue();

  const win = window.open('', '', 'width=900,height=600');
  win.document.write('<html><head><title>Output</title></head><body>');

  if (document.querySelector('.tab.active').textContent.trim() !== "Python") {
    win.document.write(html + css + js);
  } else {
    win.document.write('<pre>' + pythonCode + '</pre>');
  }

  win.document.write('</body></html>');
  win.document.close();
}

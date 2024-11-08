
    let htmlEditor = CodeMirror.fromTextArea(document.getElementById("html"), { mode: "xml", theme: "lesser-dark", lineNumbers: true });
    let cssEditor = CodeMirror.fromTextArea(document.getElementById("css"), { mode: "css", theme: "lesser-dark", lineNumbers: true });
    let jsEditor = CodeMirror.fromTextArea(document.getElementById("js"), { mode: "javascript", theme: "lesser-dark", lineNumbers: true });
    let pythonEditor = CodeMirror.fromTextArea(document.getElementById("python"), { mode: "python", theme: "lesser-dark", lineNumbers: true });

    function showEditor(editor) {
      document.querySelectorAll('.CodeMirror').forEach(el => el.classList.add('hidden'));
      document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
      document.querySelector(`.tab[onclick="showEditor('${editor}')"]`).classList.add('active');
      if (editor === 'html') htmlEditor.getWrapperElement().classList.remove('hidden');
      else if (editor === 'css') cssEditor.getWrapperElement().classList.remove('hidden');
      else if (editor === 'js') jsEditor.getWrapperElement().classList.remove('hidden');
      else if (editor === 'python') pythonEditor.getWrapperElement().classList.remove('hidden');
    }

    function loadFile() {
      const fileInput = document.getElementById("fileInput");
      const file = fileInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        const content = e.target.result;
        const extension = file.name.split('.').pop().toLowerCase();

        if (extension === 'html') htmlEditor.setValue(content);
        else if (extension === 'css') cssEditor.setValue(content);
        else if (extension === 'js') jsEditor.setValue(content);
        else if (extension === 'py') pythonEditor.setValue(content);
      };
      reader.readAsText(file);
    }

    function runCode() {
      const html = htmlEditor.getValue();
      const css = `<style>${cssEditor.getValue()}</style>`;
      const js = `<script>${jsEditor.getValue()}<\/script>`;
      const outputFrame = document.getElementById('output');
      const outputDocument = outputFrame.contentDocument || outputFrame.contentWindow.document;

      outputDocument.open();
      outputDocument.write(html + css + js);
      outputDocument.close();

      const pythonCode = pythonEditor.getValue();
      document.getElementById('python-output').textContent = '';
      if (pythonCode) {
        document.getElementById('python-output-container').style.display = 'block';
        window.print = function(...args) {
          document.getElementById('python-output').textContent += args.join(' ') + "\n";
        };
        eval(`brython()`);  // Reinitialize Brython runtime
        exec(pythonCode);
      }
    }

    htmlEditor.on("change", runCode);
    cssEditor.on("change", runCode);
    jsEditor.on("change", runCode);
    pythonEditor.on("change", runCode);

    function saveFiles() {
      const zip = new JSZip();
      const htmlContent = htmlEditor.getValue();
      const cssContent = cssEditor.getValue();
      const jsContent = jsEditor.getValue();
      const pythonContent = pythonEditor.getValue();

      if (htmlContent) zip.file("index.html", htmlContent);
      if (cssContent) zip.file("styles.css", cssContent);
      if (jsContent) zip.file("script.js", jsContent);
      if (pythonContent) zip.file("script.py", pythonContent);

      zip.generateAsync({ type: "blob" }).then(content => {
        saveAs(content, "code_files.zip");
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



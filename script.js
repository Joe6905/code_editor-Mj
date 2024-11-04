  
   alert("More Functions Will COming soon...");
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

    function showEditor(editor) {
      htmlEditor.getWrapperElement().classList.add('hidden');
      cssEditor.getWrapperElement().classList.add('hidden');
      jsEditor.getWrapperElement().classList.add('hidden');
      pythonEditor.getWrapperElement().classList.add('hidden');

      document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));

      if (editor === 'html') {
        htmlEditor.getWrapperElement().classList.remove('hidden');
        document.getElementById('output-container').style.display = 'block';
        document.getElementById('python-output-container').style.display = 'none';
        htmlEditor.refresh();
      } else if (editor === 'css') {
        cssEditor.getWrapperElement().classList.remove('hidden');
        cssEditor.refresh();
      } else if (editor === 'js') {
        jsEditor.getWrapperElement().classList.remove('hidden');
        jsEditor.refresh();
      } else if (editor === 'python') {
        pythonEditor.getWrapperElement().classList.remove('hidden');
        document.getElementById('output-container').style.display = 'none';
        document.getElementById('python-output-container').style.display = 'block';
        pythonEditor.refresh();
      }

      document.querySelector(`.tab[onclick="showEditor('${editor}')"]`).classList.add('active');
    }

    function showMoreLanguages() {
      alert("More languages coming soon!");
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

      // Run Python code if in the Python tab
      if (document.querySelector('.tab.active').textContent.trim() === "Python") {
        const pythonCode = pythonEditor.getValue();
        const pythonOutput = document.getElementById('python-output');

        // Clear previous output
        pythonOutput.innerHTML = ''; 
        // Override the print function to display output in the output area
        const script = document.createElement('script');
        script.textContent = `
          window.print = function(...args) {
            const output = args.join(" ") + "\\n";
            document.getElementById('python-output').innerHTML += output;
          };
          exec(${JSON.stringify(pythonCode)});
        `;
        outputDocument.body.appendChild(script);
      }
    }


 function downloadFiles() {
    const zip = new JSZip();

    // Get values from CodeMirror editors
    const htmlContent = htmlEditor.getValue();
    const cssContent = cssEditor.getValue();
    const jsContent = jsEditor.getValue();
    const pythonContent = pythonEditor.getValue();

    // Add files to the ZIP
    zip.file("index.html", htmlContent);
    zip.file("styles.css", cssContent);
    zip.file("script.js", jsContent);
    zip.file("script.py", pythonContent);

    // Generate and download the ZIP file
    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "code_files.zip");
    });
  }
    // Prevent page refresh and warn users about unsaved changes
    window.addEventListener('beforeunload', function (event) {
      event.preventDefault();
      event.returnValue = 'You have unsaved changes. Do you really want to leave?';
    });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'q' && event.ctrlKey) {
      event.preventDefault(); // Prevent the default action (if any)
      openOutputInNewPage();
    }
  });

  function openOutputInNewPage() {
    const html = htmlEditor.getValue();
    const css = cssEditor.getValue();
    const js = jsEditor.getValue();
    
    const newWindow = window.open(); // Open a new window
    newWindow.document.open();
    newWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Output</title>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}<\/script>
      </body>
      </html>
    `);
    newWindow.document.close();
  }
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key === 'f') {
    event.preventDefault(); // Prevent the default find behavior of Ctrl+F
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

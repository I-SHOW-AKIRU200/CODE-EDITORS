document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const htmlEditor = document.getElementById('html-code');
    const cssEditor = document.getElementById('css-code');
    const jsEditor = document.getElementById('js-code');
    const previewFrame = document.getElementById('preview-frame');
    const runBtn = document.getElementById('run-btn');
    const previewBtn = document.getElementById('preview-btn');
    const saveBtn = document.getElementById('save-btn');
    const editorTabs = document.querySelectorAll('.editor-tab');
    const editorContents = document.querySelectorAll('.editor-content');
    const previewContainer = document.getElementById('preview-container');

    // Set initial empty code
    let currentCode = {
        html: '',
        css: '',
        js: ''
    };

    // Tab switching functionality
    editorTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-target');
            
            // Update active tab
            editorTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active content
            editorContents.forEach(c => c.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Run code function
    function runCode() {
        // Update current code from editors
        currentCode = {
            html: htmlEditor.textContent,
            css: cssEditor.textContent,
            js: jsEditor.textContent
        };

        // Create a complete HTML document
        const fullCode = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>${currentCode.css}</style>
            </head>
            <body>
                ${currentCode.html}
                <script>${currentCode.js}<\/script>
            </body>
            </html>
        `;

        // Write to iframe
        const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
        frameDoc.open();
        frameDoc.write(fullCode);
        frameDoc.close();
    }

    // Toggle fullscreen preview
    function toggleFullscreen() {
        previewContainer.classList.toggle('fullscreen');
        
        // Update button icon and text
        const isFullscreen = previewContainer.classList.contains('fullscreen');
        previewBtn.innerHTML = isFullscreen 
            ? '<i class="fas fa-compress"></i> Normal' 
            : '<i class="fas fa-expand"></i> Fullscreen';
    }

    // Event listeners
    runBtn.addEventListener('click', runCode);
    previewBtn.addEventListener('click', toggleFullscreen);
    saveBtn.addEventListener('click', function() {
        alert('Code saved (this would save to storage in a real app)');
    });

    // Auto-run on first load with empty code
    runCode();

    // Auto-run on code change with debounce
    let debounceTimer;
    [htmlEditor, cssEditor, jsEditor].forEach(editor => {
        editor.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(runCode, 1000);
        });
    });

    // Keyboard shortcut for running code (Ctrl+Enter)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            runCode();
        }
    });

    // Handle Tab key in editors
    [htmlEditor, cssEditor, jsEditor].forEach(editor => {
        editor.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.selectionStart;
                const end = this.selectionEnd;
                
                // Insert tab character
                this.textContent = this.textContent.substring(0, start) + 
                                  '\t' + 
                                  this.textContent.substring(end);
                
                // Move cursor position
                this.selectionStart = this.selectionEnd = start + 1;
                
                // Trigger Prism to update highlighting
                Prism.highlightElement(this);
            }
        });
    });
});

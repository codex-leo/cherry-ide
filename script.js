// DOM Elements
const editor = document.getElementById('editor');
const consoleOutput = document.getElementById('console-output');
const saveBtn = document.getElementById('save-btn');
const clearBtn = document.getElementById('clear-btn');
const addFileBtn = document.getElementById('add-btn');
const addFileOpen = document.getElementById('add-file-btn');
const fileList = document.getElementById('file-list');
const runBtn = document.getElementById('run-btn');
const suggestFeature = document.getElementById('suggest-feature-btn');
const settingsBtn = document.getElementById('settings-btn');
const closeBtn = document.getElementById('close-btn');
const lineNumber = document.getElementById('numberOfLines');
const themeDropdown = document.getElementById('theme-dropdown');

// Utility Functions
function clearConsole() {
    consoleOutput.innerHTML = '';
}

function logToConsole(message) {
    const logEntry = document.createElement('div');
    logEntry.textContent = message;
    consoleOutput.appendChild(logEntry);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function runCode() {
    clearConsole();

    // Redirect console.log to our custom console
    const originalConsoleLog = console.log;
    console.log = function (...args) {
        logToConsole(args.join(' '));
    };

    try {
        const userCode = editor.value;
        eval(userCode); // Execute the user's code
    } catch (error) {
        logToConsole(`Error: ${error.message}`);
    } finally {
        // Restore the original console.log
        console.log = originalConsoleLog;
    }
}

function saveFile() {
    const blob = new Blob([editor.value], { type: 'text/javascript' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'script.js';
    a.click();
}

function addNewFile() {
    const fileNameInput = document.getElementById('fileName');
    const fileName = fileNameInput.value.trim();

    if (fileName) {
        const newFile = document.createElement('li');
        newFile.textContent = fileName;
        newFile.addEventListener('click', () => {
            editor.value = ''; // Placeholder for actual file loading
        });
        fileList.appendChild(newFile);
        fileNameInput.value = '';
        Overlayscreen('new-file');
    }
}

function suggestFeatures() {
    alert('Please suggest a feature by creating an issue on the GitHub repository.');
}

function Overlayscreen(elementId) {
    let screen = document.getElementById(elementId);
    if (screen.style.display === 'none' || screen.style.display === '') {
        screen.style.display = 'block';
    } else {
        screen.style.display = 'none';
    }
}

function updateLineNumbers() {
    const lines = editor.value.split('\n').length;
    lineNumber.innerHTML = Array.from({ length: lines}, (_, i) => i + 1).join('\n');
};

function applyTheme(){
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme){
        document.body.setAttribute('data-theme',savedTheme);
        themeDropdown.value = savedTheme;
    }
    themeDropdown.addEventListener('change',()=>{
            const theme = themeDropdown.value;
            document.body.setAttribute('data-theme',theme);
            localStorage.setItem('theme',theme);
        })
    }

applyTheme();

// Event Listeners
editor.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.ctrlKey) {
        runCode();
    }
});

// Bracket Auto Complete
editor.addEventListener('keydown',(event)=>{
    handleBracketAutoComplete(event);
})
 const pairs = {
    '(': ')',
    '[': ']',
    '{': '}',
    '"' : '"',
    "'" : "'"
 }

function handleBracketAutoComplete(event){
    const openChar = event.key;
    const closeChar = pairs[openChar];

    if(closeChar){
        const start = editor.selectionStart; // Cursor start position
        const end = editor.selectionEnd; // Cursor end position
        const text = editor.value; // Current editor content
        if (text[start] === closeChar) {
            // Move the cursor forward instead of adding a new pair
            event.preventDefault();
            editor.setSelectionRange(start + 1, start + 1);
        } else {
            // Insert the pair normally
            event.preventDefault(); // Prevent default behavior
            editor.value = text.slice(0, start) + openChar + closeChar + text.slice(end);
            editor.setSelectionRange(start + 1, start + 1); // Place the cursor between the pair
        }
    }
}

closeBtn.addEventListener('click', () => {
    const settingsCard = document.getElementById('settings-card');
    if (settingsCard) {
        settingsCard.style.display = 'none';
    }
});


editor.addEventListener('input',updateLineNumbers);

editor.addEventListener('scroll',()=>{
    lineNumber.scrollTop = editor.scrollTop;
})



suggestFeature.addEventListener('click', suggestFeatures);

saveBtn.addEventListener('click', saveFile);

clearBtn.addEventListener('click', clearConsole);

addFileBtn.addEventListener('click', addNewFile);

addFileOpen.addEventListener('click',() => Overlayscreen('new-file'));

runBtn.addEventListener('click', runCode);

settingsBtn.addEventListener('click',() => Overlayscreen('settings-card'));


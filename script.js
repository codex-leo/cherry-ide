// DOM Elements
const editor = document.getElementById('editor');
const consoleOutput = document.getElementById('console-output');
const saveBtn = document.getElementById('save-btn');
const clearBtn = document.getElementById('clear-btn');
const addFileBtn = document.getElementById('add-file-btn');
const fileList = document.getElementById('file-list');
const runBtn = document.getElementById('run-btn');
const suggestFeature = document.getElementById('suggest-feature-btn');

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
    const fileName = prompt('Enter the name of the new file:');
    if (fileName) {
        const newFile = document.createElement('li');
        newFile.textContent = fileName;
        newFile.addEventListener('click', () => {
            editor.value = ''; // Placeholder for actual file loading
        });
        fileList.appendChild(newFile);
    }
}

function suggestFeatures() {
    alert('Please suggest a feature by creating an issue on the GitHub repository.');
}

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

suggestFeature.addEventListener('click', suggestFeatures);
saveBtn.addEventListener('click', saveFile);
clearBtn.addEventListener('click', clearConsole);
addFileBtn.addEventListener('click', addNewFile);
runBtn.addEventListener('click', runCode);

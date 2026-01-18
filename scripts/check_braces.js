const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\dadi2\\OneDrive\\Bureau\\GEOTUCO\GEOTUCO\\translations\\pages.ts', 'utf8');

let braceCount = 0;
let lineNum = 1;
let inString = false;
let stringChar = '';

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '\n') lineNum++;

    if (!inString) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
        if (char === '"' || char === "'" || char === '`') {
            inString = true;
            stringChar = char;
        }
    } else {
        if (char === stringChar && content[i - 1] !== '\\') {
            inString = false;
        }
    }
}

console.log('Final brace count:', braceCount);
if (braceCount !== 0) {
    console.log('Brace mismatch detected!');
}

const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\dadi2\\OneDrive\\Bureau\\GEOTUCO\\GEOTUCO\\translations\\pages.ts', 'utf8');

let count = 0;
const languages = ['en:', 'fr:', 'ar:', 'es:', 'de:', 'it:', 'zh:', 'sw:', 'yo:', 'am:', 'ha:'];
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let lang of languages) {
        if (line.trim().startsWith(lang)) {
            console.log(`Line ${i + 1} (${lang}) - Brace count: ${count}`);
        }
    }
    for (let char of line) {
        if (char === '{') count++;
        else if (char === '}') count--;
    }
}
console.log(`Final count: ${count}`);

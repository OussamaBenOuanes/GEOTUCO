const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\dadi2\\OneDrive\\Bureau\\GEOTUCO\\GEOTUCO\\translations\\pages.ts', 'utf8');
let count = 0;
const lines = content.split('\n');
let out = '';
for (let i = 0; i < lines.length; i++) {
    let old = count;
    for (let char of lines[i]) {
        if (char === '{') count++;
        else if (char === '}') count--;
    }
    if (i + 1 >= 970 && i + 1 <= 990) {
        out += `${i + 1}: [${old}->${count}] ${lines[i]}\n`;
    }
}
fs.writeFileSync('scripts/brace_report_de.txt', out);

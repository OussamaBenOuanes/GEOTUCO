const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\dadi2\\OneDrive\\Bureau\\GEOTUCO\\GEOTUCO\\translations\\pages.ts', 'utf8');

let count = 0;
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let lineDelta = 0;
    for (let char of line) {
        if (char === '{') { count++; lineDelta++; }
        else if (char === '}') { count--; lineDelta--; }
    }
    if (i + 1 >= 589 && i + 1 <= 785) {
        console.log(`Line ${i + 1}: Delta ${lineDelta}, Total ${count} | ${line}`);
    }
}

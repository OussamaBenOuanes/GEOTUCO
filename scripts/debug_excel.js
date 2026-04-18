const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'REFERENCES.xlsx');
const workbook = XLSX.readFile(filePath);

workbook.SheetNames.forEach((sheetName) => {
    console.log(`\n=== Sheet: ${sheetName} ===`);
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
    data.slice(0, 20).forEach((row, i) => {
        const trimmed = row.map(c => String(c).substring(0, 25));
        console.log(`${i}: ${JSON.stringify(trimmed)}`);
    });
});

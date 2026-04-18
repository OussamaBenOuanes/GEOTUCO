const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'REFERENCES.xlsx');
const workbook = XLSX.readFile(filePath);

console.log("Sheet names:", workbook.SheetNames);

workbook.SheetNames.forEach((sheetName) => {
    console.log(`\n\n=== Sheet: ${sheetName} ===`);
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
    // Print first 15 rows for inspection
    data.slice(0, 15).forEach((row, i) => {
        console.log(`Row ${i}:`, row.slice(0, 6)); // first 6 cols
    });
});

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'REFERENCES.xlsx');
const workbook = XLSX.readFile(filePath);

const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

const data = XLSX.utils.sheet_to_json(worksheet);

const projects = [];
let currentProject = null;

data.forEach((row, index) => {
    const frCol = row['Français'];
    const enCol = row['ENGLISH'] || row['PROJET']; // Some rows use PROJET as header

    if ((frCol === 'PROJET' || frCol === 'PROJECT') || (enCol === 'PROJET' || enCol === 'PROJECT')) {
        if (currentProject) projects.push(currentProject);
        currentProject = {
            name_fr: row['__EMPTY_1'],
            name_en: row['__EMPTY_2'],
            details_fr: [],
            details_en: []
        };
    } else if (frCol === 'SITE') {
        currentProject.site_fr = row['__EMPTY_1'];
        currentProject.site_en = row['__EMPTY_2'];
    } else if (frCol === 'STRUCTURE') {
        currentProject.structure_fr = row['__EMPTY_1'];
        currentProject.structure_en = row['__EMPTY_2'];
    } else if (frCol === 'MISSION') {
        currentProject.mission_fr = row['__EMPTY_1'];
        currentProject.mission_en = row['__EMPTY_2'];
    } else if (currentProject && row['__EMPTY_1']) {
        currentProject.details_fr.push(row['__EMPTY_1']);
        currentProject.details_en.push(row['__EMPTY_2']);
    }
});
if (currentProject) projects.push(currentProject);

fs.writeFileSync('all_projects.json', JSON.stringify(projects, null, 2));
console.log(`Exported ${projects.length} projects to all_projects.json`);

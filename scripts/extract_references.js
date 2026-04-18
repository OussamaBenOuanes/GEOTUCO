const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'REFERENCES.xlsx');
const workbook = XLSX.readFile(filePath);

// Helper to parse reference sheets (Tunisia / Etranger)
// Column structure: A=empty, B=label(FR), C=value(FR), D=label(EN), E=value(EN)
function parseReferencesSheet(sheetName) {
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
        console.warn(`Sheet ${sheetName} not found`);
        return [];
    }
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });

    const projects = [];
    let currentProject = null;

    for (let i = 1; i < data.length; i++) { // Skip header row
        const row = data[i];
        if (!row || row.every(c => c === "")) continue;

        // Columns: 0=empty, 1=labelFr, 2=valueFr, 3=labelEn, 4=valueEn
        const labelFr = (row[1] || "").toString().trim().toUpperCase();
        const valueFr = (row[2] || "").toString().trim();
        const labelEn = (row[3] || "").toString().trim().toUpperCase();
        const valueEn = (row[4] || "").toString().trim();

        if (labelFr === "PROJET" || labelEn === "PROJECT" || labelEn === "PROJET") {
            if (currentProject && (currentProject.name.fr || currentProject.name.en)) projects.push(currentProject);
            currentProject = {
                name: {
                    fr: valueFr || valueEn,
                    en: valueEn || valueFr
                },
                site: { fr: "", en: "" },
                structure: { fr: "", en: "" },
                mission: { fr: "", en: "" },
                details: { fr: [], en: [] }
            };
        } else if (currentProject) {
            if (labelFr === "SITE" || labelEn === "SITE") {
                if (valueFr) currentProject.site.fr = valueFr;
                if (valueEn) currentProject.site.en = valueEn;
                // Fallback if missing
                if (!currentProject.site.fr && currentProject.site.en) currentProject.site.fr = currentProject.site.en;
                if (!currentProject.site.en && currentProject.site.fr) currentProject.site.en = currentProject.site.fr;
            } else if (labelFr === "STRUCTURE" || labelEn === "STRUCTURE") {
                if (valueFr) currentProject.structure.fr = valueFr;
                if (valueEn) currentProject.structure.en = valueEn;
                if (!currentProject.structure.fr && currentProject.structure.en) currentProject.structure.fr = currentProject.structure.en;
                if (!currentProject.structure.en && currentProject.structure.fr) currentProject.structure.en = currentProject.structure.fr;
            } else if (labelFr === "MISSION" || labelEn === "MISSION") {
                if (valueFr) currentProject.mission.fr = valueFr;
                if (valueEn) currentProject.mission.en = valueEn;
                if (!currentProject.mission.fr && currentProject.mission.en) currentProject.mission.fr = currentProject.mission.en;
                if (!currentProject.mission.en && currentProject.mission.fr) currentProject.mission.en = currentProject.mission.fr;
            } else if (valueFr || valueEn) {
                // Detail row (no label, just values)
                if (valueFr && !currentProject.details.fr.includes(valueFr)) {
                    currentProject.details.fr.push(valueFr);
                }
                if (valueEn && !currentProject.details.en.includes(valueEn)) {
                    currentProject.details.en.push(valueEn);
                }
            }
        }
    }
    if (currentProject && (currentProject.name.fr || currentProject.name.en)) projects.push(currentProject);
    return projects;
}

// Parse Clients sheet - only URLs (unchanged logic mostly)
function parseClientsSheet() {
    const worksheet = workbook.Sheets['CLIENTS'];
    if (!worksheet) {
        console.warn('CLIENTS sheet not found');
        return [];
    }
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });

    const clients = [];
    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        if (!row || row.every(c => c === "")) continue;

        // Column B (index 1) contains the URL
        const url = (row[1] || "").toString().trim();
        if (url && url.startsWith('http')) {
            // Extract domain for name
            try {
                const urlObj = new URL(url);
                const domain = urlObj.hostname.replace('www.', '');
                const nameParts = domain.split('.');
                const name = nameParts[0].toUpperCase();

                clients.push({
                    name: name,
                    url: url,
                    logo: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
                });
            } catch (e) {
                console.warn(`Invalid URL: ${url}`);
            }
        }
    }
    return clients;
}

const tunisiaRefs = parseReferencesSheet('REFERENCES-TUNISIA');
const etrangerRefs = parseReferencesSheet('REFERENCES-ETRANGER');
const clients = parseClientsSheet();

const output = {
    tunisia: tunisiaRefs,
    international: etrangerRefs,
    clients: clients
};

const outputPath = path.join(__dirname, '..', 'references_data.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');

console.log(`Exported ${tunisiaRefs.length} Tunisia refs, ${etrangerRefs.length} International refs, ${clients.length} clients to references_data.json`);

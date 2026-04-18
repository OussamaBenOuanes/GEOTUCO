const fs = require('fs');
const path = require('path');
const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");

const client = new S3Client({
    region: "us-east-1",
    endpoint: "https://ynfumltvultubcyvahbb.storage.supabase.co/storage/v1/s3",
    credentials: {
        accessKeyId: "8e7c34806542f0732b02bb5c3424a1d4",
        secretAccessKey: "fbfc03e7b1998fcbd821018bbb6ee1ee33df08c005539f8f785daa500731d45c"
    },
    forcePathStyle: true
});

// Proxy URL format
const baseUrl = "/api/storage?key=";

function normalize(str) {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function run() {
    try {
        const dataPath = path.resolve(__dirname, '../references_data.json');
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        const bucket = "GEOTUCO storage";
        const allFiles = [];

        const folders = ["reference tunisie", "reference etranger", "clients logo"];
        for (const prefix of folders) {
            let continuationToken;
            do {
                const cmd = new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, ContinuationToken: continuationToken });
                const res = await client.send(cmd);
                if (res.Contents) {
                    res.Contents.forEach(c => allFiles.push(c.Key));
                }
                continuationToken = res.NextContinuationToken;
            } while (continuationToken);
        }

        console.log(`Found ${allFiles.length} files in storage.`);

        // Match References
        for (const type of ['tunisia', 'international']) {
            if (!data[type]) continue;
            for (const proj of data[type]) {
                // Use English name for matching, fallback to French
                const nameEn = proj.name && proj.name.en ? proj.name.en : '';
                const nameFr = proj.name && proj.name.fr ? proj.name.fr : '';
                const normName = normalize(nameEn) || normalize(nameFr);
                const folder = type === 'tunisia' ? 'reference tunisie' : 'reference etranger';

                let match = allFiles.find(f => f.startsWith(folder) && normalize(f).includes(normName));

                if (!match) {
                    match = allFiles.find(f => f.startsWith(folder) && (normalize(f).includes(normName) || normName.includes(normalize(f.split('/').pop().split('.')[0]))));
                }

                if (match) {
                    proj.image = `${baseUrl}${encodeURIComponent(match)}`;
                    console.log(`Matched "${nameEn || nameFr}" -> ${match}`);
                }
            }
        }

        // Match Clients
        if (data.clients) {
            for (const client of data.clients) {
                const normName = normalize(client.name);
                const folder = "clients logo";

                let match = allFiles.find(f => f.startsWith(folder) && normalize(f).includes(normName));

                if (!match && normName.includes("baraka")) match = allFiles.find(f => f.includes("albaraka"));
                if (!match && normName.includes("mazraa")) match = allFiles.find(f => f.includes("mazraaa") || f.includes("elmazraa"));

                if (match) {
                    client.logo = `${baseUrl}${encodeURIComponent(match)}`;
                    console.log(`Matched Client "${client.name}" -> ${match}`);
                }
            }
        }

        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        console.log("Updated references_data.json with Proxy URLs");

    } catch (err) {
        console.error("Error:", err);
    }
}

run();

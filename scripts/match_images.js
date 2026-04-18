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

const baseUrl = "https://ynfumltvultubcyvahbb.supabase.co/storage/v1/object/public/GEOTUCO%20storage";

function normalize(str) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function run() {
    try {
        // Read existing data
        const dataPath = path.resolve(__dirname, '../references_data.json');
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        // List all files
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
                const normName = normalize(proj.name);
                // Find best match in relevant folder
                const folder = type === 'tunisia' ? 'reference tunisie' : 'reference etranger';

                // 1. Exact match (with extension)
                let match = allFiles.find(f => f.startsWith(folder) && normalize(f).includes(normName));

                // 2. Loose match
                if (!match) {
                    match = allFiles.find(f => f.startsWith(folder) && (normalize(f).includes(normName) || normName.includes(normalize(f.split('/').pop().split('.')[0]))));
                }

                if (match) {
                    // Encode path parts
                    const parts = match.split('/');
                    const encodedPath = parts.map(p => encodeURIComponent(p)).join('/');
                    proj.image = `${baseUrl}/${encodedPath}`;
                    console.log(`Matched "${proj.name}" -> ${match}`);
                } else {
                    console.log(`NO MATCH for "${proj.name}"`);
                    // Keep existing image if not found? Or set to undefined?
                    // User said "update it". I'll keep existing local path as fallback if not matched?
                    // But matching should work if names are close.
                }
            }
        }

        // Match Clients
        if (data.clients) {
            for (const client of data.clients) {
                const normName = normalize(client.name);
                const folder = "clients logo";

                // Match Logic
                let match = allFiles.find(f => f.startsWith(folder) && normalize(f).includes(normName));

                // Special cases
                if (!match && normName.includes("baraka")) match = allFiles.find(f => f.includes("albaraka"));
                if (!match && normName.includes("mazraa")) match = allFiles.find(f => f.includes("mazraaa") || f.includes("elmazraa"));

                if (match) {
                    const parts = match.split('/');
                    const encodedPath = parts.map(p => encodeURIComponent(p)).join('/');
                    client.logo = `${baseUrl}/${encodedPath}`;
                    console.log(`Matched Client "${client.name}" -> ${match}`);
                } else {
                    console.log(`NO MATCH Client "${client.name}"`);
                }
            }
        }

        // Write new file
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        console.log("Updated references_data.json");

    } catch (err) {
        console.error("Error:", err);
    }
}

run();

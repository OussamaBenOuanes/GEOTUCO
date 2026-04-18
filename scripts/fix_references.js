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

function normalize(str) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function listAllFiles(bucket, prefix) {
    const files = [];
    let continuationToken;

    do {
        const cmd = new ListObjectsV2Command({
            Bucket: bucket,
            Prefix: prefix,
            ContinuationToken: continuationToken
        });
        const res = await client.send(cmd);
        if (res.Contents) {
            res.Contents.forEach(c => files.push(c.Key));
        }
        continuationToken = res.NextContinuationToken;
    } while (continuationToken);

    return files;
}

async function run() {
    try {
        const bucket = "GEOTUCO storage";

        // List all files in storage
        console.log("Listing files in Supabase Storage...\n");

        const tunisiaFiles = await listAllFiles(bucket, "reference tunisie");
        const internationalFiles = await listAllFiles(bucket, "reference etranger");

        console.log("Tunisia files:", tunisiaFiles.length);
        tunisiaFiles.forEach(f => console.log("  -", f));

        console.log("\nInternational files:", internationalFiles.length);
        internationalFiles.forEach(f => console.log("  -", f));

        // Read existing data
        const dataPath = path.resolve(__dirname, '../references_data.json');
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        console.log("\n--- CHECKING FOR DUPLICATES AND MISMATCHES ---\n");

        // Check Tunisia projects
        console.log("TUNISIA PROJECTS:");
        for (let i = 0; i < data.tunisia.length; i++) {
            const proj = data.tunisia[i];
            const frName = proj.name.fr;
            const enName = proj.name.en;
            const image = proj.image;

            // Check if en name doesn't match fr name
            if (frName !== enName) {
                console.log(`[${i}] NAME MISMATCH: fr="${frName}" vs en="${enName}"`);
                // Fix: Set en to match fr
                proj.name.en = frName;
            }

            // Find matching image file
            const normFrName = normalize(frName);
            const matchingFile = tunisiaFiles.find(f => {
                const fileName = f.split('/').pop().replace('.webp', '').replace('.png', '').replace('.jpg', '');
                return normalize(fileName) === normFrName;
            });

            if (matchingFile) {
                const newImage = `/api/storage?key=${encodeURIComponent(matchingFile)}`;
                if (image !== newImage) {
                    console.log(`[${i}] "${frName}" image updated: ${matchingFile}`);
                }
                proj.image = newImage;
            } else {
                // Try partial match
                const partialMatch = tunisiaFiles.find(f => {
                    const fileName = normalize(f.split('/').pop().replace('.webp', '').replace('.png', '').replace('.jpg', ''));
                    return normFrName.includes(fileName) || fileName.includes(normFrName);
                });

                if (partialMatch) {
                    proj.image = `/api/storage?key=${encodeURIComponent(partialMatch)}`;
                    console.log(`[${i}] "${frName}" partial match: ${partialMatch}`);
                } else {
                    console.log(`[${i}] "${frName}" NO MATCH in storage`);
                }
            }
        }

        console.log("\nINTERNATIONAL PROJECTS:");
        for (let i = 0; i < data.international.length; i++) {
            const proj = data.international[i];
            const frName = proj.name.fr;
            const enName = proj.name.en;
            const image = proj.image;

            // Check if en name doesn't match fr name
            if (frName !== enName) {
                console.log(`[${i}] NAME MISMATCH: fr="${frName}" vs en="${enName}"`);
                // Fix: Set en to match fr
                proj.name.en = frName;
            }

            // Find matching image file
            const normFrName = normalize(frName);
            const matchingFile = internationalFiles.find(f => {
                const fileName = f.split('/').pop().replace('.webp', '').replace('.png', '').replace('.jpg', '');
                return normalize(fileName) === normFrName;
            });

            if (matchingFile) {
                const newImage = `/api/storage?key=${encodeURIComponent(matchingFile)}`;
                if (image !== newImage) {
                    console.log(`[${i}] "${frName}" image updated: ${matchingFile}`);
                }
                proj.image = newImage;
            } else {
                // Try partial match
                const partialMatch = internationalFiles.find(f => {
                    const fileName = normalize(f.split('/').pop().replace('.webp', '').replace('.png', '').replace('.jpg', ''));
                    return normFrName.includes(fileName) || fileName.includes(normFrName);
                });

                if (partialMatch) {
                    proj.image = `/api/storage?key=${encodeURIComponent(partialMatch)}`;
                    console.log(`[${i}] "${frName}" partial match: ${partialMatch}`);
                } else {
                    console.log(`[${i}] "${frName}" NO MATCH in storage`);
                }
            }
        }

        // Check for duplicate images
        console.log("\n--- CHECKING FOR DUPLICATE IMAGES ---\n");

        const allImages = new Map();

        data.tunisia.forEach((p, i) => {
            if (!allImages.has(p.image)) {
                allImages.set(p.image, []);
            }
            allImages.get(p.image).push({ type: 'tunisia', idx: i, name: p.name.fr });
        });

        data.international.forEach((p, i) => {
            if (!allImages.has(p.image)) {
                allImages.set(p.image, []);
            }
            allImages.get(p.image).push({ type: 'international', idx: i, name: p.name.fr });
        });

        let duplicateCount = 0;
        for (const [img, projects] of allImages) {
            if (projects.length > 1) {
                duplicateCount++;
                console.log(`DUPLICATE IMAGE: ${img}`);
                projects.forEach(p => console.log(`  - ${p.type}[${p.idx}]: ${p.name}`));
            }
        }

        if (duplicateCount === 0) {
            console.log("No duplicate images found!");
        }

        // Write updated data
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        console.log("\n✅ Updated references_data.json");

    } catch (err) {
        console.error("Error:", err);
    }
}

run();

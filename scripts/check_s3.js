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

async function run() {
    const bucket = "GEOTUCO storage";
    const prefixes = ["reference tunisie", "reference etranger", "clients logo"];

    for (const prefix of prefixes) {
        console.log(`\n--- Folder: ${prefix} ---`);
        try {
            const { Contents } = await client.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, MaxKeys: 20 }));
            if (Contents) {
                Contents.forEach(c => console.log(`  ${c.Key}`));
            } else {
                console.log("  No files found.");
            }
        } catch (err) {
            console.log(`  Error: ${err.message}`);
        }
    }
}

run();

const { S3Client, HeadObjectCommand } = require("@aws-sdk/client-s3");

const client = new S3Client({
    region: "us-east-1",
    endpoint: "https://ynfumltvultubcyvahbb.storage.supabase.co/storage/v1/s3",
    credentials: {
        accessKeyId: "8e7c34806542f0732b02bb5c3424a1d4",
        secretAccessKey: "fbfc03e7b1998fcbd821018bbb6ee1ee33df08c005539f8f785daa500731d45c"
    },
    forcePathStyle: true
});

async function check() {
    const files = [
        "reference tunisie/ALLIANCE BAY PROJECT.webp",
        "clients logo/sidenor.png"
    ];
    const bucket = "GEOTUCO storage";

    for (const key of files) {
        try {
            const cmd = new HeadObjectCommand({ Bucket: bucket, Key: key });
            const res = await client.send(cmd);
            console.log(`File: ${key}`);
            console.log(`Content-Type: ${res.ContentType}`);
            console.log(`Content-Length: ${res.ContentLength}`);
            console.log("---");
        } catch (e) {
            console.log(`Error ${key}: ${e.message}`);
        }
    }
}
check();

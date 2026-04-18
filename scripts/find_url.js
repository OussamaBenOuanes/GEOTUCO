async function check() {
    const baseUrl = "https://ynfumltvultubcyvahbb.supabase.co/storage/v1/object/public";

    // Guessing bucket names
    const buckets = [
        "GEOTUCO storage", "GEOTUCO%20storage", "geotuco-storage", "geotuco_storage",
        "geotuco storage", "geotuco", "storage", "public", "images", "references"
    ];

    // Guessing folder paths
    const folderPairs = [
        { folder: "clients logo", file: "SIDENOR.webp" },
        { folder: "clients_logo", file: "SIDENOR.webp" },
        { folder: "Clients Logo", file: "SIDENOR.webp" },
        { folder: "reference tunisie", file: "ALLIANCE BAY PROJECT.webp" },
        { folder: "reference_tunisie", file: "ALLIANCE BAY PROJECT.webp" },
        { folder: "Reference Tunisie", file: "ALLIANCE BAY PROJECT.webp" }
    ];

    console.log("Checking URLs...");

    for (const bucket of buckets) {
        for (const { folder, file } of folderPairs) {
            // Test with encoded components
            const encodedBucket = encodeURIComponent(bucket).replace(/%20/g, '%20'); // ensure spaces are %20
            const encodedFolder = encodeURIComponent(folder).replace(/%20/g, '%20');
            const encodedFile = encodeURIComponent(file).replace(/%20/g, '%20');

            const url = `${baseUrl}/${encodedBucket}/${encodedFolder}/${encodedFile}`;

            try {
                const res = await fetch(url, { method: 'HEAD' });
                process.stdout.write(`Testing: ${url} -> ${res.status}\n`);

                if (res.ok) {
                    console.log(`\nSUCCESS! Valid URL found:\n${url}`);
                    console.log(`Bucket ID: "${bucket}"`);
                    console.log(`Folder: "${folder}"`);
                    return;
                }
            } catch (err) {
                console.log(`Error check ${url}:`, err.message);
            }
        }
    }
    console.log("\nNo valid URL found matching patterns.");
}

check();

async function check() {
    const urls = [
        "https://ynfumltvultubcyvahbb.supabase.co/storage/v1/object/public/GEOTUCO%20storage/reference%20tunisie/ALLIANCE%20BAY%20PROJECT.webp",
        "https://ynfumltvultubcyvahbb.supabase.co/storage/v1/object/public/GEOTUCO%20storage/clients%20logo/sidenor.png"
    ];

    for (const url of urls) {
        try {
            console.log(`Checking: ${url}`);
            const res = await fetch(url, { method: 'HEAD' });
            console.log(`Status: ${res.status} ${res.statusText}`);
            if (!res.ok) {
                // Try to print body if json (for error details)
                try {
                    const text = await res.text();
                    console.log("Body:", text);
                } catch (e) { }
            }
        } catch (err) {
            console.log(`Error checking ${url}:`, err.message);
        }
        console.log("---");
    }
}

check();

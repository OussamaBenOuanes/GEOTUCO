async function check() {
    const bucket = "GEOTUCO storage";
    const folder = "clients logo";
    const file = "sidenor.png";

    const variants = [
        "GEOTUCO%20storage",
        "GEOTUCO+storage",
        "GEOTUCO_storage", // Maybe sanitized?
        "geotuco_storage",
        "GEOTUCO-storage",
        "geotuco-storage"
    ];

    const folderVariants = [
        "clients%20logo",
        "clients+logo",
        "clients_logo"
    ];

    console.log("Checking Variants...");

    for (const b of variants) {
        for (const f of folderVariants) {
            const url = `https://ynfumltvultubcyvahbb.supabase.co/storage/v1/object/public/${b}/${f}/${file}`;
            try {
                const res = await fetch(url, { method: 'HEAD' });
                console.log(`${url} -> ${res.status}`);
                if (res.ok) {
                    console.log("SUCCESS!");
                    return;
                }
            } catch (e) {
                console.log(e.message);
            }
        }
    }
}
check();

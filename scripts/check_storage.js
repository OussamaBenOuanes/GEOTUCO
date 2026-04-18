const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function check() {
    try {
        const envPath = path.resolve(__dirname, '../.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const envVars = {};
        envContent.split('\n').forEach(line => {
            const parts = line.split('=');
            const key = parts.shift();
            const value = parts.join('=');
            if (key && value) envVars[key.trim()] = value.trim();
        });

        const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
        const supabaseKey = envVars['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY'];

        if (!supabaseUrl || !supabaseKey) {
            console.log('Missing credentials in .env.local');
            return;
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        const buckets = ['GEOTUCO storage', 'GEOTUCO_storage', 'geotuco-storage', 'geotuco_storage', 'geotuco storage'];
        const folders = ['reference tunisie', 'reference etranger', 'clients logo'];

        console.log('Checking Supabase Storage...');

        for (const bucket of buckets) {
            console.log(`\n--- Bucket: "${bucket}" ---`);
            for (const folder of folders) {
                const { data, error } = await supabase.storage.from(bucket).list(folder, { limit: 3 });
                if (error) {
                    console.log(`Folder "${folder}": Error - ${error.message}`);
                } else if (data && data.length > 0) {
                    console.log(`Folder "${folder}": Found ${data.length} items.`);
                    console.log(`  First item: ${data[0].name}`);
                    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(`${folder}/${data[0].name}`);
                    console.log(`  Public URL: ${publicUrl}`);
                } else {
                    console.log(`Folder "${folder}": Empty or not found.`);
                }
            }
        }
    } catch (err) {
        console.error('Script error:', err);
    }
}

check();

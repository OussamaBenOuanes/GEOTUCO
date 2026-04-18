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

        console.log('Attempting to list all buckets...');
        const { data: buckets, error } = await supabase.storage.listBuckets();

        if (error) {
            console.log('Error listing buckets:', error.message);
        } else {
            console.log('Buckets found:', buckets);
            if (buckets && buckets.length > 0) {
                console.log('Bucket IDs:', buckets.map(b => b.id));
            }
        }

        // Also retry guessing with capitalized folder names
        const bucket = 'GEOTUCO storage';
        const folders = ['Reference Tunisie', 'Reference Etranger', 'Clients Logo', 'Clients logo', 'clients Logo'];

        console.log(`\nChecking capitalized folders in "${bucket}"...`);
        for (const folder of folders) {
            const { data, error } = await supabase.storage.from(bucket).list(folder, { limit: 1 });
            if (data && data.length > 0) {
                console.log(`FOUND Folder: "${folder}"`);
                console.log(`  File: ${data[0].name}`);
                const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(`${folder}/${data[0].name}`);
                console.log(`  URL: ${publicUrl}`);
            } else if (error) {
                console.log(`  Error accessing "${folder}": ${error.message}`);
            }
        }

    } catch (err) {
        console.error('Script error:', err);
    }
}

check();

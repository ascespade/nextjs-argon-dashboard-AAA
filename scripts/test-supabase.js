const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testSupabase() {
    try {
        console.log('🔍 Testing Supabase connection and tables...');
        console.log('📡 URL:', SUPABASE_URL);

        // Test each table
        const tables = ['pages', 'page_versions', 'components_library', 'uploads', 'users_profiles'];

        for (const tableName of tables) {
            try {
                console.log(`\n⏳ Testing table: ${tableName}...`);

                const { data, error } = await supabase
                    .from(tableName)
                    .select('*')
                    .limit(1);

                if (error) {
                    if (error.code === 'PGRST116') {
                        console.log(`❌ Table ${tableName} does not exist`);
                    } else {
                        console.log(`⚠️  Table ${tableName} error:`, error.message);
                    }
                } else {
                    console.log(`✅ Table ${tableName} exists and accessible`);
                    console.log(`   Records count: ${data ? data.length : 0}`);
                }
            } catch (err) {
                console.log(`❌ Table ${tableName} error:`, err.message);
            }
        }

        console.log('\n📊 Summary:');
        console.log('If all tables show "does not exist", you need to create them first.');
        console.log('If tables exist but show errors, check your RLS policies.');
        console.log('');
        console.log('🚀 Next steps:');
        console.log('1. Create tables using SQL Editor in Supabase Dashboard');
        console.log('2. Run: curl -X POST http://localhost:3000/api/admin/seed-preline');
        console.log('3. Check: http://localhost:3000/editor');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testSupabase();

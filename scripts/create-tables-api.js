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

async function createTablesViaAPI() {
    try {
        console.log('🚀 Attempting to create tables via Supabase API...');

        // Try to create tables using REST API
        const tables = [
            {
                name: 'pages',
                definition: {
                    name: 'pages',
                    columns: [
                        { name: 'id', type: 'uuid', default: 'gen_random_uuid()', primary_key: true },
                        { name: 'slug', type: 'text', unique: true, nullable: false },
                        { name: 'title_json', type: 'jsonb' },
                        { name: 'components_json', type: 'jsonb' },
                        { name: 'status', type: 'text', default: "'draft'" },
                        { name: 'version', type: 'int', default: '1' },
                        { name: 'updated_by', type: 'text' },
                        { name: 'updated_at', type: 'timestamptz', default: 'now()' }
                    ]
                }
            },
            {
                name: 'components_library',
                definition: {
                    name: 'components_library',
                    columns: [
                        { name: 'id', type: 'uuid', default: 'gen_random_uuid()', primary_key: true },
                        { name: 'type', type: 'text', unique: true, nullable: false },
                        { name: 'name', type: 'text', nullable: false },
                        { name: 'category', type: 'text', nullable: false },
                        { name: 'description', type: 'text' },
                        { name: 'preview_meta', type: 'jsonb' },
                        { name: 'props_template', type: 'jsonb' },
                        { name: 'created_at', type: 'timestamptz', default: 'now()' }
                    ]
                }
            }
        ];

        for (const table of tables) {
            try {
                console.log(`⏳ Creating table: ${table.name}...`);

                // Try to create table using SQL
                const { error } = await supabase.rpc('exec_sql', {
                    sql_query: `CREATE TABLE IF NOT EXISTS ${table.name} (id UUID PRIMARY KEY DEFAULT gen_random_uuid())`
                });

                if (error) {
                    console.log(`⚠️  Table ${table.name} creation failed:`, error.message);
                } else {
                    console.log(`✅ Table ${table.name} created successfully`);
                }
            } catch (err) {
                console.log(`⚠️  Table ${table.name} error:`, err.message);
            }
        }

        console.log('');
        console.log('📋 Since API creation failed, please use the manual method:');
        console.log('');
        console.log('1. Go to: https://supabase.com/dashboard');
        console.log('2. Select your project');
        console.log('3. Go to SQL Editor');
        console.log('4. Run the SQL from the previous script');
        console.log('');
        console.log('5. After creating tables, test with:');
        console.log('   curl -X POST http://localhost:3000/api/admin/seed-preline');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

createTablesViaAPI();

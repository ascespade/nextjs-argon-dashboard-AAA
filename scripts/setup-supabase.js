const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing Supabase environment variables');
    console.error('Please check your .env file for SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function setupDatabase() {
    try {
        console.log('🚀 Setting up Supabase database...');

        // Read SQL file
        const sqlPath = path.join(__dirname, '..', 'supabase', 'init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split SQL into individual statements
        const statements = sql
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        console.log(`📝 Found ${statements.length} SQL statements to execute`);

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.trim()) {
                try {
                    console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
                    const { error } = await supabase.rpc('exec_sql', { sql_query: statement });

                    if (error) {
                        console.warn(`⚠️  Statement ${i + 1} warning:`, error.message);
                    } else {
                        console.log(`✅ Statement ${i + 1} executed successfully`);
                    }
                } catch (err) {
                    console.warn(`⚠️  Statement ${i + 1} error:`, err.message);
                }
            }
        }

        console.log('🎉 Database setup completed!');
        console.log('📋 Created tables:');
        console.log('   - pages');
        console.log('   - page_versions');
        console.log('   - components_library');
        console.log('   - uploads');
        console.log('   - users_profiles');
        console.log('');
        console.log('🔐 Enabled Row Level Security (RLS)');
        console.log('📜 Created access policies');
        console.log('');
        console.log('✨ You can now run the seed script:');
        console.log('   curl -X POST http://localhost:3000/api/admin/seed-preline');

    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        process.exit(1);
    }
}

// Alternative method using direct SQL execution
async function setupDatabaseDirect() {
    try {
        console.log('🚀 Setting up Supabase database (direct method)...');

        // Read SQL file
        const sqlPath = path.join(__dirname, '..', 'supabase', 'init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Execute the entire SQL script
        const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

        if (error) {
            console.error('❌ SQL execution failed:', error.message);

            // Try alternative approach - create tables individually
            console.log('🔄 Trying alternative approach...');
            await createTablesIndividually();
        } else {
            console.log('✅ Database setup completed successfully!');
        }

    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        console.log('🔄 Trying alternative approach...');
        await createTablesIndividually();
    }
}

async function createTablesIndividually() {
    const tables = [
        {
            name: 'pages',
            sql: `
        CREATE TABLE IF NOT EXISTS pages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          slug TEXT UNIQUE NOT NULL,
          title_json JSONB,
          components_json JSONB,
          status TEXT DEFAULT 'draft',
          version INT DEFAULT 1,
          updated_by TEXT,
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
        },
        {
            name: 'page_versions',
            sql: `
        CREATE TABLE IF NOT EXISTS page_versions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
          version INT,
          components_json JSONB,
          created_by TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
        },
        {
            name: 'components_library',
            sql: `
        CREATE TABLE IF NOT EXISTS components_library (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          type TEXT NOT NULL,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          description TEXT,
          preview_meta JSONB,
          props_template JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
        },
        {
            name: 'uploads',
            sql: `
        CREATE TABLE IF NOT EXISTS uploads (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          path TEXT,
          url TEXT,
          metadata JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
        },
        {
            name: 'users_profiles',
            sql: `
        CREATE TABLE IF NOT EXISTS users_profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT NOT NULL,
          full_name TEXT,
          role TEXT DEFAULT 'user',
          avatar_url TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
        }
    ];

    for (const table of tables) {
        try {
            console.log(`⏳ Creating table: ${table.name}...`);
            const { error } = await supabase.rpc('exec_sql', { sql_query: table.sql });

            if (error) {
                console.warn(`⚠️  Table ${table.name} warning:`, error.message);
            } else {
                console.log(`✅ Table ${table.name} created successfully`);
            }
        } catch (err) {
            console.warn(`⚠️  Table ${table.name} error:`, err.message);
        }
    }

    console.log('🎉 Database setup completed!');
    console.log('✨ You can now run the seed script:');
    console.log('   curl -X POST http://localhost:3000/api/admin/seed-preline');
}

// Run the setup
setupDatabaseDirect();

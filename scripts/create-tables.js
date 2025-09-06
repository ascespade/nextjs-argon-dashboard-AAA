const { createClient } = require('@supabase/supabase-js');

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

async function createTables() {
    try {
        console.log('🚀 Creating Supabase tables...');

        // Test connection first
        console.log('🔍 Testing Supabase connection...');
        const { data, error } = await supabase.from('pages').select('count').limit(1);

        if (error && error.code === 'PGRST116') {
            console.log('📝 Tables do not exist yet, this is expected');
        } else if (error) {
            console.error('❌ Connection test failed:', error.message);
            return;
        } else {
            console.log('✅ Connection successful');
        }

        console.log('');
        console.log('📋 To create the tables, please run the following SQL in your Supabase dashboard:');
        console.log('');
        console.log('1. Go to: https://supabase.com/dashboard');
        console.log('2. Select your project');
        console.log('3. Go to SQL Editor');
        console.log('4. Run the following SQL:');
        console.log('');
        console.log('-- Copy and paste this SQL:');
        console.log('=====================================');

        const sql = `
-- Supabase demo schema (pages, page_versions, components_library, uploads, users_profiles)

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

CREATE TABLE IF NOT EXISTS page_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  version INT,
  components_json JSONB,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT,
  url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- Enable RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE components_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations for authenticated users" ON pages
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON page_versions
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access to components library" ON components_library
  FOR SELECT USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON uploads
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view own profile" ON users_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON users_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON users_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles" ON users_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
`;

        console.log(sql);
        console.log('=====================================');
        console.log('');
        console.log('5. After running the SQL, come back and run:');
        console.log('   curl -X POST http://localhost:3000/api/admin/seed-preline');
        console.log('');
        console.log('🌐 Your Supabase URL:', SUPABASE_URL);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

createTables();

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

async function setupSupabase() {
    try {
        console.log('🚀 Setting up Supabase database...');
        console.log('📡 Supabase URL:', SUPABASE_URL);

        // Test connection
        console.log('🔍 Testing connection...');
        const { data, error } = await supabase.from('pages').select('count').limit(1);

        if (error && error.code === 'PGRST116') {
            console.log('📝 Tables do not exist yet - this is expected');
        } else if (error) {
            console.log('⚠️  Connection test warning:', error.message);
        } else {
            console.log('✅ Connection successful');
        }

        console.log('');
        console.log('📋 Please follow these steps to create the tables:');
        console.log('');
        console.log('1. Open Supabase Dashboard: https://supabase.com/dashboard');
        console.log('2. Select your project');
        console.log('3. Go to SQL Editor');
        console.log('4. Create a new query');
        console.log('5. Copy and paste the SQL below:');
        console.log('');
        console.log('='.repeat(60));

        const sql = `
-- Create pages table
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

-- Create page_versions table
CREATE TABLE IF NOT EXISTS page_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  version INT,
  components_json JSONB,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create components_library table
CREATE TABLE IF NOT EXISTS components_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  preview_meta JSONB,
  props_template JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create uploads table
CREATE TABLE IF NOT EXISTS uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT,
  url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create users_profiles table
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

-- Enable Row Level Security
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE components_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for pages
CREATE POLICY "Allow all operations for authenticated users" ON pages
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access" ON pages
  FOR SELECT USING (status = 'published');

-- Create policies for page_versions
CREATE POLICY "Allow all operations for authenticated users" ON page_versions
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for components_library
CREATE POLICY "Allow read access to components library" ON components_library
  FOR SELECT USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON components_library
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for uploads
CREATE POLICY "Allow all operations for authenticated users" ON uploads
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for users_profiles
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
        console.log('='.repeat(60));
        console.log('');
        console.log('6. Click "Run" to execute the SQL');
        console.log('7. Wait for success confirmation');
        console.log('');
        console.log('8. After creating tables, run this command:');
        console.log('   curl -X POST http://localhost:3000/api/admin/seed-preline');
        console.log('');
        console.log('🎯 This will populate the database with 100+ components');
        console.log('📄 And create a sample homepage');
        console.log('');
        console.log('🌐 Your Supabase Project URL:', SUPABASE_URL);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

setupSupabase();

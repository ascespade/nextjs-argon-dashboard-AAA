const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Generate secure password
const generatePassword = () => {
  return crypto.randomBytes(12).toString('base64');
};

// Component library data
const componentsLibrary = [
  // Hero Components
  {
    type: 'hero_banner',
    name: 'Hero Banner',
    category: 'hero',
    description: 'Large banner with title, subtitle and CTA button',
    preview_meta: {
      thumbnail:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMTYwIDkwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iOTAiIGZpbGw9IiM2MzY2RjEiLz48dGV4dCB4PSI4MCIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkhlcm8gQmFubmVyPC90ZXh0Pjwvc3ZnPg==',
    },
    props_template: {
      title: { ar: 'عنوان رئيسي', en: 'Main Title' },
      subtitle: { ar: 'وصف فرعي', en: 'Subtitle description' },
      ctaText: { ar: 'ابدأ الآن', en: 'Get Started' },
      ctaHref: '/dashboard',
      backgroundImage: '',
      textColor: 'white',
    },
  },
  {
    type: 'hero_gradient',
    name: 'Gradient Hero',
    category: 'hero',
    description: 'Hero section with gradient background',
    preview_meta: {
      thumbnail:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMTYwIDkwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MzY2RjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM4QjVDQjYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTYwIiBoZWlnaHQ9IjkwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPjx0ZXh0IHg9IjgwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+R3JhZGllbnQgSGVybzwvdGV4dD48L3N2Zz4=',
    },
    props_template: {
      title: { ar: 'عنوان متدرج', en: 'Gradient Title' },
      subtitle: {
        ar: 'وصف مع خلفية متدرجة',
        en: 'Description with gradient background',
      },
      gradientFrom: '#6366F1',
      gradientTo: '#8B5CF6',
      ctaText: { ar: 'اكتشف المزيد', en: 'Learn More' },
    },
  },
  {
    type: 'hero_video',
    name: 'Video Hero',
    category: 'hero',
    description: 'Hero section with background video',
    preview_meta: {
      thumbnail:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMTYwIDkwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iOTAiIGZpbGw9IiMzMzMiLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjQ1IiByPSIyMCIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuOCIvPjxwb2x5Z29uIHBvaW50cz0iNzAsNDAgOTAsNDUgNzAsNTAiIGZpbGw9IiMzMzMiLz48L3N2Zz4=',
    },
    props_template: {
      title: { ar: 'فيديو توضيحي', en: 'Video Hero' },
      subtitle: {
        ar: 'وصف مع فيديو خلفية',
        en: 'Description with background video',
      },
      videoUrl: '',
      overlayOpacity: 0.5,
    },
  },
];

// Add more components (continuing with features, cards, etc.)
const addMoreComponents = () => {
  const categories = [
    { name: 'features', label: 'Features' },
    { name: 'cards', label: 'Cards' },
    { name: 'testimonials', label: 'Testimonials' },
    { name: 'gallery', label: 'Gallery' },
    { name: 'stats', label: 'Statistics' },
    { name: 'cta', label: 'Call to Action' },
    { name: 'headers', label: 'Headers' },
    { name: 'footers', label: 'Footers' },
    { name: 'forms', label: 'Forms' },
    { name: 'faq', label: 'FAQ' },
    { name: 'pricing', label: 'Pricing' },
    { name: 'team', label: 'Team' },
    { name: 'contact', label: 'Contact' },
    { name: 'badges', label: 'Badges' },
    { name: 'banners', label: 'Banners' },
    { name: 'counters', label: 'Counters' },
    { name: 'image_blocks', label: 'Image Blocks' },
    { name: 'sliders', label: 'Sliders' },
    { name: 'accordions', label: 'Accordions' },
    { name: 'maps', label: 'Maps' },
    { name: 'client_logos', label: 'Client Logos' },
  ];

  categories.forEach(category => {
    for (let i = 1; i <= 4; i++) {
      componentsLibrary.push({
        type: `${category.name}_${i}`,
        name: `${category.label} ${i}`,
        category: category.name,
        description: `${category.label} component variant ${i}`,
        preview_meta: {
          thumbnail: `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMTYwIDkwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iOTAiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSI4MCIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+${encodeURIComponent(category.label)} ${i}</dGV4dD48L3N2Zz4=`,
        },
        props_template: {
          title: { ar: `${category.label} ${i}`, en: `${category.label} ${i}` },
          description: {
            ar: `وصف ${category.label} ${i}`,
            en: `Description for ${category.label} ${i}`,
          },
          items: [],
        },
      });
    }
  });
};

addMoreComponents();

// Main seed function
async function seedSupabase() {
  try {
    console.log('🌱 Starting Supabase seeding...');

    // 1. Clear existing data
    console.log('🧹 Clearing existing data...');
    await supabase
      .from('page_versions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase
      .from('pages')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase
      .from('components_library')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    // 2. Insert components library
    console.log('📦 Inserting components library...');
    const { data: componentsData, error: componentsError } = await supabase
      .from('components_library')
      .insert(componentsLibrary)
      .select();

    if (componentsError) throw componentsError;
    console.log(`✅ Inserted ${componentsData.length} components`);

    // 3. Create admin user
    console.log('👤 Creating admin user...');
    const adminPassword = generatePassword();
    const adminEmail = 'info@cw.com.sa';

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
      });

    if (authError) throw authError;

    // 4. Create admin profile
    const { error: profileError } = await supabase
      .from('users_profiles')
      .insert({
        user_id: authData.user.id,
        email: adminEmail,
        full_name: 'Admin User',
        role: 'admin',
      });

    if (profileError) throw profileError;
    console.log('✅ Admin user created');

    // 5. Create homepage
    console.log('🏠 Creating homepage...');
    const homepageComponents = [
      {
        type: 'hero_banner',
        props: {
          title: { ar: 'لوحة التحكم المؤسسية', en: 'Enterprise Dashboard' },
          subtitle: {
            ar: 'لوحة تحكم حديثة ومتجاوبة مع أحدث التقنيات',
            en: 'Modern, responsive dashboard with latest technologies',
          },
          ctaText: { ar: 'ابدأ الآن', en: 'Get Started' },
          ctaHref: '/admin/dashboard',
        },
      },
      {
        type: 'features_1',
        props: {
          title: { ar: 'المميزات الرئيسية', en: 'Key Features' },
          items: [
            {
              title: { ar: 'تصميم متجاوب', en: 'Responsive Design' },
              description: {
                ar: 'يعمل على جميع الأجهزة',
                en: 'Works on all devices',
              },
              icon: 'fas fa-mobile-alt',
            },
            {
              title: { ar: 'أمان عالي', en: 'High Security' },
              description: {
                ar: 'حماية متقدمة للبيانات',
                en: 'Advanced data protection',
              },
              icon: 'fas fa-shield-alt',
            },
            {
              title: { ar: 'أداء سريع', en: 'Fast Performance' },
              description: {
                ar: 'تحميل سريع ومرن',
                en: 'Fast and flexible loading',
              },
              icon: 'fas fa-bolt',
            },
          ],
        },
      },
      {
        type: 'stats_1',
        props: {
          items: [
            { label: { ar: 'المستخدمين', en: 'Users' }, value: '10K+' },
            { label: { ar: 'المشاريع', en: 'Projects' }, value: '500+' },
            { label: { ar: 'المراجعات', en: 'Reviews' }, value: '4.9' },
            { label: { ar: 'الدعم', en: 'Support' }, value: '24/7' },
          ],
        },
      },
    ];

    const { data: pageData, error: pageError } = await supabase
      .from('pages')
      .insert({
        slug: 'home',
        title_json: { ar: 'الرئيسية', en: 'Home' },
        components_json: homepageComponents,
        status: 'published',
        version: 1,
        updated_by: 'system',
      })
      .select()
      .single();

    if (pageError) throw pageError;

    // Create initial version
    await supabase.from('page_versions').insert({
      page_id: pageData.id,
      version: 1,
      components_json: homepageComponents,
      created_by: 'system',
    });

    console.log('✅ Homepage created');

    // 6. Save admin credentials
    const credentialsPath = path.join(
      process.cwd(),
      'docs',
      'ADMIN_CREDENTIALS.md'
    );
    const credentialsContent = `# Admin Credentials

## Generated Admin Account

**Email:** ${adminEmail}
**Password:** ${adminPassword}

## Important Security Notes

⚠️ **CRITICAL:** Change this password immediately after first login!

## How to Change Password

1. Login to the application using the credentials above
2. Go to your profile settings
3. Update your password
4. Delete this file after changing the password

## Creating Additional Admin Users

1. Login as admin
2. Go to /admin/users
3. Click "Add User" and set role to "admin"

## Production Deployment

- Rotate this password before going to production
- Use environment variables for admin credentials
- Enable 2FA for admin accounts
- Monitor admin access logs

---
*This file was generated on ${new Date().toISOString()}*
*Please delete this file after changing the password for security reasons.*
`;

    fs.writeFileSync(credentialsPath, credentialsContent);
    console.log('📝 Admin credentials saved to docs/ADMIN_CREDENTIALS.md');

    console.log('🎉 Seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Components: ${componentsData.length}`);
    console.log(`   - Admin user: ${adminEmail}`);
    console.log(`   - Homepage: Created`);
    console.log(`   - Credentials: docs/ADMIN_CREDENTIALS.md`);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run the seed
seedSupabase();

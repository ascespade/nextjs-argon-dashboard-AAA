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

async function finalTest() {
    console.log('🎯 اختبار نهائي لـ Supabase');
    console.log('='.repeat(50));

    try {
        // Test connection
        console.log('🔍 اختبار الاتصال...');
        const { data, error } = await supabase.from('pages').select('count').limit(1);

        if (error && error.code === 'PGRST116') {
            console.log('❌ الجداول غير موجودة بعد');
            console.log('');
            console.log('📋 يجب عليك إنشاء الجداول أولاً:');
            console.log('1. اذهب إلى: https://supabase.com/dashboard');
            console.log('2. اختر مشروعك');
            console.log('3. اذهب إلى SQL Editor');
            console.log('4. انسخ والصق الكود من ملف QUICK_SUPABASE_SETUP.md');
            console.log('5. اضغط Run');
            console.log('');
            console.log('6. بعد إنشاء الجداول، شغل:');
            console.log('   curl -X POST http://localhost:3000/api/admin/seed-preline');
            return;
        }

        if (error) {
            console.log('⚠️  خطأ في الاتصال:', error.message);
            return;
        }

        console.log('✅ الاتصال ناجح!');

        // Test each table
        const tables = [
            { name: 'pages', required: true },
            { name: 'components_library', required: true },
            { name: 'page_versions', required: false },
            { name: 'uploads', required: false },
            { name: 'users_profiles', required: false }
        ];

        let allTablesExist = true;

        for (const table of tables) {
            try {
                const { data, error } = await supabase
                    .from(table.name)
                    .select('*')
                    .limit(1);

                if (error) {
                    console.log(`❌ جدول ${table.name}: غير موجود`);
                    if (table.required) allTablesExist = false;
                } else {
                    console.log(`✅ جدول ${table.name}: موجود`);
                }
            } catch (err) {
                console.log(`❌ جدول ${table.name}: خطأ - ${err.message}`);
                if (table.required) allTablesExist = false;
            }
        }

        console.log('');

        if (allTablesExist) {
            console.log('🎉 جميع الجداول المطلوبة موجودة!');
            console.log('');
            console.log('🚀 الخطوة التالية: تحميل المكونات');
            console.log('شغل هذا الأمر:');
            console.log('curl -X POST http://localhost:3000/api/admin/seed-preline');
            console.log('');
            console.log('📝 ثم اذهب إلى: http://localhost:3000/editor');
            console.log('وستجد المكونات في القائمة اليمنى!');
        } else {
            console.log('❌ بعض الجداول المطلوبة مفقودة');
            console.log('يجب إنشاء الجداول أولاً كما هو موضح أعلاه');
        }

    } catch (error) {
        console.error('❌ خطأ في الاختبار:', error.message);
    }
}

finalTest();

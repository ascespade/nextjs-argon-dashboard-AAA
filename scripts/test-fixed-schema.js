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

async function testFixedSchema() {
    console.log('🔧 اختبار الإصلاح الجديد لـ Supabase');
    console.log('='.repeat(50));

    try {
        // Test each table
        const tables = [
            { name: 'pages', required: true },
            { name: 'components_library', required: true },
            { name: 'page_versions', required: false },
            { name: 'uploads', required: false },
            { name: 'users_profiles', required: false }
        ];

        let allTablesExist = true;
        let canInsertData = true;

        for (const table of tables) {
            try {
                console.log(`\n⏳ اختبار جدول: ${table.name}...`);

                // Test if table exists
                const { data, error } = await supabase
                    .from(table.name)
                    .select('*')
                    .limit(1);

                if (error) {
                    if (error.code === 'PGRST116') {
                        console.log(`❌ جدول ${table.name}: غير موجود`);
                        if (table.required) allTablesExist = false;
                    } else {
                        console.log(`⚠️  جدول ${table.name}: خطأ - ${error.message}`);
                        if (table.required) allTablesExist = false;
                    }
                } else {
                    console.log(`✅ جدول ${table.name}: موجود`);

                    // Test if we can insert data (for required tables)
                    if (table.required && table.name === 'components_library') {
                        try {
                            const testData = {
                                type: 'test_component',
                                name: 'Test Component',
                                category: 'test',
                                description: 'Test component for validation',
                                props_template: { test: 'value' }
                            };

                            const { error: insertError } = await supabase
                                .from(table.name)
                                .insert([testData]);

                            if (insertError) {
                                console.log(`⚠️  لا يمكن إدراج بيانات في ${table.name}: ${insertError.message}`);
                                canInsertData = false;
                            } else {
                                console.log(`✅ يمكن إدراج بيانات في ${table.name}`);

                                // Clean up test data
                                await supabase
                                    .from(table.name)
                                    .delete()
                                    .eq('type', 'test_component');
                            }
                        } catch (insertErr) {
                            console.log(`⚠️  خطأ في إدراج البيانات: ${insertErr.message}`);
                            canInsertData = false;
                        }
                    }
                }
            } catch (err) {
                console.log(`❌ جدول ${table.name}: خطأ - ${err.message}`);
                if (table.required) allTablesExist = false;
            }
        }

        console.log('\n📊 النتيجة:');
        console.log('='.repeat(30));

        if (allTablesExist && canInsertData) {
            console.log('🎉 جميع الجداول تعمل بشكل صحيح!');
            console.log('');
            console.log('🚀 الخطوة التالية: تحميل المكونات');
            console.log('شغل هذا الأمر:');
            console.log('curl -X POST http://localhost:3000/api/admin/seed-preline');
            console.log('');
            console.log('📝 ثم اذهب إلى: http://localhost:3000/editor');
            console.log('وستجد المكونات في القائمة اليمنى!');
        } else if (allTablesExist && !canInsertData) {
            console.log('⚠️  الجداول موجودة لكن هناك مشكلة في الصلاحيات');
            console.log('تحقق من سياسات RLS في Supabase Dashboard');
        } else {
            console.log('❌ بعض الجداول المطلوبة مفقودة');
            console.log('يجب إنشاء الجداول أولاً باستخدام الكود المُصحح');
            console.log('');
            console.log('📋 استخدم الكود من ملف: FIXED_SUPABASE_SETUP.md');
        }

    } catch (error) {
        console.error('❌ خطأ في الاختبار:', error.message);
    }
}

testFixedSchema();

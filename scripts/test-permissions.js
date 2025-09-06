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

async function testPermissions() {
    console.log('🔐 اختبار صلاحيات Supabase');
    console.log('='.repeat(40));

    try {
        // Test each table with different operations
        const tables = [
            { name: 'pages', required: true },
            { name: 'components_library', required: true },
            { name: 'page_versions', required: false },
            { name: 'uploads', required: false },
            { name: 'users_profiles', required: false }
        ];

        let allPermissionsOK = true;

        for (const table of tables) {
            try {
                console.log(`\n⏳ اختبار صلاحيات جدول: ${table.name}...`);

                // Test SELECT
                const { data: selectData, error: selectError } = await supabase
                    .from(table.name)
                    .select('*')
                    .limit(1);

                if (selectError) {
                    console.log(`❌ SELECT فشل: ${selectError.message}`);
                    if (table.required) allPermissionsOK = false;
                } else {
                    console.log(`✅ SELECT يعمل`);
                }

                // Test INSERT (for required tables)
                if (table.required && table.name === 'components_library') {
                    try {
                        const testData = {
                            type: 'test_component_permissions',
                            name: 'Test Component',
                            category: 'test',
                            description: 'Test component for permissions validation',
                            props_template: { test: 'value' }
                        };

                        const { error: insertError } = await supabase
                            .from(table.name)
                            .insert([testData]);

                        if (insertError) {
                            console.log(`❌ INSERT فشل: ${insertError.message}`);
                            allPermissionsOK = false;
                        } else {
                            console.log(`✅ INSERT يعمل`);

                            // Test UPDATE
                            const { error: updateError } = await supabase
                                .from(table.name)
                                .update({ name: 'Updated Test Component' })
                                .eq('type', 'test_component_permissions');

                            if (updateError) {
                                console.log(`❌ UPDATE فشل: ${updateError.message}`);
                                allPermissionsOK = false;
                            } else {
                                console.log(`✅ UPDATE يعمل`);
                            }

                            // Test DELETE
                            const { error: deleteError } = await supabase
                                .from(table.name)
                                .delete()
                                .eq('type', 'test_component_permissions');

                            if (deleteError) {
                                console.log(`❌ DELETE فشل: ${deleteError.message}`);
                                allPermissionsOK = false;
                            } else {
                                console.log(`✅ DELETE يعمل`);
                            }
                        }
                    } catch (crudErr) {
                        console.log(`❌ عمليات CRUD فشلت: ${crudErr.message}`);
                        allPermissionsOK = false;
                    }
                }

            } catch (err) {
                console.log(`❌ خطأ في اختبار ${table.name}: ${err.message}`);
                if (table.required) allPermissionsOK = false;
            }
        }

        console.log('\n📊 النتيجة:');
        console.log('='.repeat(30));

        if (allPermissionsOK) {
            console.log('🎉 جميع الصلاحيات تعمل بشكل صحيح!');
            console.log('');
            console.log('🚀 الخطوة التالية: تحميل المكونات');
            console.log('شغل هذا الأمر:');
            console.log('curl -X POST http://localhost:3000/api/admin/seed-preline');
            console.log('');
            console.log('📝 ثم اذهب إلى: http://localhost:3000/editor');
            console.log('وستجد المكونات في القائمة اليمنى!');
        } else {
            console.log('❌ هناك مشاكل في الصلاحيات');
            console.log('');
            console.log('🔧 الحل:');
            console.log('1. اذهب إلى Supabase Dashboard');
            console.log('2. اذهب إلى SQL Editor');
            console.log('3. نفذ الكود من ملف: FIX_PERMISSIONS.md');
            console.log('4. أعد تشغيل هذا الاختبار');
        }

    } catch (error) {
        console.error('❌ خطأ في الاختبار:', error.message);
    }
}

testPermissions();

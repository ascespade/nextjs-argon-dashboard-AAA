# إصلاح صلاحيات Supabase (مُصحح) 🔐

## المشكلة السابقة
```
ERROR: 42601: syntax error at or near "TYPES"
LINE 29: GRANT ALL ON ALL TYPES IN SCHEMA public TO postgres;
```

## الحل المُصحح

### الخطوة 1: افتح Supabase Dashboard
1. اذهب إلى: **https://supabase.com/dashboard**
2. اختر مشروعك: `zdkwyoeoaplecltzjkmn`
3. اذهب إلى **SQL Editor**

### الخطوة 2: نفذ الكود المُصحح
انسخ والصق هذا الكود المُصحح:

```sql
-- إصلاح صلاحيات Supabase (مُصحح)
-- هذا الملف يحل مشكلة "permission denied for schema public"

-- إعطاء صلاحيات كاملة للمستخدم الحالي
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;

-- إعطاء صلاحيات على الجداول
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- إعطاء صلاحيات على التسلسلات
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- إعطاء صلاحيات على الوظائف
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- إعطاء صلاحيات على الجداول المحددة
GRANT ALL ON pages TO postgres, anon, authenticated, service_role;
GRANT ALL ON page_versions TO postgres, anon, authenticated, service_role;
GRANT ALL ON components_library TO postgres, anon, authenticated, service_role;
GRANT ALL ON uploads TO postgres, anon, authenticated, service_role;
GRANT ALL ON users_profiles TO postgres, anon, authenticated, service_role;

-- إعطاء صلاحيات على الجداول المستقبلية
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres, anon, authenticated, service_role;
```

### الخطوة 3: تنفيذ الكود
1. اضغط **"Run"** لتنفيذ الكود
2. انتظر رسالة النجاح ✅
3. يجب أن ترى رسالة "Success. No rows returned"

### الخطوة 4: اختبار الصلاحيات
بعد إصلاح الصلاحيات، شغل:

```bash
node scripts/test-permissions.js
```

يجب أن ترى رسائل نجاح بدلاً من أخطاء الصلاحيات.

### الخطوة 5: تحميل المكونات
بعد إصلاح الصلاحيات، شغل:

```bash
curl -X POST http://localhost:3000/api/admin/seed-preline
```

يجب أن ترى رسالة نجاح مع تفاصيل المكونات المحملة.

### الخطوة 6: اختبار المحرر
1. اذهب إلى: **http://localhost:3000/editor**
2. يجب أن ترى المكونات في القائمة اليمنى
3. إذا ظهرت "0 items"، حدث الصفحة

## ما تم إصلاحه:
- ✅ إزالة الأوامر غير المدعومة (TYPES)
- ✅ استخدام صيغة SQL صحيحة
- ✅ التركيز على الجداول والتسلسلات والوظائف الأساسية
- ✅ إعطاء صلاحيات شاملة لجميع المستخدمين

## إذا استمرت المشكلة

### الحل البديل: تعطيل RLS مؤقتاً
إذا استمرت مشكلة الصلاحيات، يمكنك تعطيل Row Level Security مؤقتاً:

```sql
-- تعطيل RLS مؤقتاً
ALTER TABLE pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_versions DISABLE ROW LEVEL SECURITY;
ALTER TABLE components_library DISABLE ROW LEVEL SECURITY;
ALTER TABLE uploads DISABLE ROW LEVEL SECURITY;
ALTER TABLE users_profiles DISABLE ROW LEVEL SECURITY;
```

**تحذير**: هذا الحل أقل أماناً، استخدمه فقط للتطوير.

## النتيجة المتوقعة:
بعد إصلاح الصلاحيات:
- ✅ سيعمل API بنجاح
- ✅ ستظهر 100+ مكون في المحرر
- ✅ يمكنك إنشاء صفحات جديدة
- ✅ يمكنك حفظ ونشر المحتوى

🎉 **بعد هذا الإصلاح، سيعمل النظام بكامل طاقته!**

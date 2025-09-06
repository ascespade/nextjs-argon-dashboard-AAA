# حل بسيط لصلاحيات Supabase 🔧

## المشكلة
```
ERROR: 42601: syntax error at or near "TYPES"
```

## الحل البسيط

### الخطوة 1: افتح Supabase Dashboard
1. اذهب إلى: **https://supabase.com/dashboard**
2. اختر مشروعك: `zdkwyoeoaplecltzjkmn`
3. اذهب إلى **SQL Editor**

### الخطوة 2: نفذ الكود البسيط
انسخ والصق هذا الكود البسيط:

```sql
-- حل بسيط لصلاحيات Supabase
-- هذا الملف يحل مشكلة "permission denied for schema public"

-- إعطاء صلاحيات أساسية
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- إعطاء صلاحيات على الجداول المحددة
GRANT ALL ON pages TO postgres, anon, authenticated, service_role;
GRANT ALL ON page_versions TO postgres, anon, authenticated, service_role;
GRANT ALL ON components_library TO postgres, anon, authenticated, service_role;
GRANT ALL ON uploads TO postgres, anon, authenticated, service_role;
GRANT ALL ON users_profiles TO postgres, anon, authenticated, service_role;
```

### الخطوة 3: تنفيذ الكود
1. اضغط **"Run"** لتنفيذ الكود
2. انتظر رسالة النجاح ✅

### الخطوة 4: اختبار الصلاحيات
```bash
node scripts/test-permissions.js
```

### الخطوة 5: تحميل المكونات
```bash
curl -X POST http://localhost:3000/api/admin/seed-preline
```

### الخطوة 6: اختبار المحرر
اذهب إلى: **http://localhost:3000/editor**

## إذا استمرت المشكلة

### الحل البديل: تعطيل RLS
```sql
ALTER TABLE pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_versions DISABLE ROW LEVEL SECURITY;
ALTER TABLE components_library DISABLE ROW LEVEL SECURITY;
ALTER TABLE uploads DISABLE ROW LEVEL SECURITY;
ALTER TABLE users_profiles DISABLE ROW LEVEL SECURITY;
```

🎉 **هذا الحل البسيط يجب أن يعمل!**

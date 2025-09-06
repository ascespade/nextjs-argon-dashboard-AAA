# إصلاح مشكلة Supabase - أنواع البيانات 🔧

## المشكلة
```
ERROR: 42804: foreign key constraint "page_versions_page_id_fkey" cannot be implemented
DETAIL: Key columns "page_id" and "id" are of incompatible types: uuid and text.
```

## الحل المحدث

### الخطوة 1: افتح Supabase Dashboard
1. اذهب إلى: **https://supabase.com/dashboard**
2. اختر مشروعك: `zdkwyoeoaplecltzjkmn`
3. اذهب إلى **SQL Editor**

### الخطوة 2: استخدم الكود المُصحح
انسخ والصق هذا الكود المُصحح:

```sql
-- إصلاح مشكلة أنواع البيانات في Supabase
-- هذا الملف يحل مشكلة foreign key constraint

-- أولاً، احذف الجداول الموجودة إذا كانت موجودة
DROP TABLE IF EXISTS page_versions CASCADE;
DROP TABLE IF EXISTS pages CASCADE;
DROP TABLE IF EXISTS components_library CASCADE;
DROP TABLE IF EXISTS uploads CASCADE;
DROP TABLE IF EXISTS users_profiles CASCADE;

-- إنشاء جدول الصفحات مع UUID صحيح
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_json JSONB,
  components_json JSONB,
  status TEXT DEFAULT 'draft',
  version INT DEFAULT 1,
  updated_by TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء جدول إصدارات الصفحات مع مرجع صحيح
CREATE TABLE page_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  version INT,
  components_json JSONB,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء جدول مكتبة المكونات
CREATE TABLE components_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  preview_meta JSONB,
  props_template JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء جدول الرفع
CREATE TABLE uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT,
  url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء جدول ملفات المستخدمين
CREATE TABLE users_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- تفعيل أمان مستوى الصفوف
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE components_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_profiles ENABLE ROW LEVEL SECURITY;

-- إنشاء السياسات
CREATE POLICY "Allow all operations for authenticated users" ON pages
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access" ON pages
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow all operations for authenticated users" ON page_versions
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access to components library" ON components_library
  FOR SELECT USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON components_library
  FOR ALL USING (auth.role() = 'authenticated');

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

-- إضافة فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_page_versions_page_id ON page_versions(page_id);
CREATE INDEX IF NOT EXISTS idx_components_library_type ON components_library(type);
CREATE INDEX IF NOT EXISTS idx_components_library_category ON components_library(category);
CREATE INDEX IF NOT EXISTS idx_users_profiles_user_id ON users_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_users_profiles_email ON users_profiles(email);
```

### الخطوة 3: تنفيذ الكود
1. اضغط **"Run"** لتنفيذ الكود
2. انتظر رسالة النجاح ✅
3. يجب أن ترى رسالة "Success. No rows returned"

### الخطوة 4: تحميل المكونات
بعد إنشاء الجداول بنجاح، شغل:

```bash
curl -X POST http://localhost:3000/api/admin/seed-preline
```

### الخطوة 5: اختبار المحرر
1. اذهب إلى: **http://localhost:3000/editor**
2. يجب أن ترى المكونات في القائمة اليمنى
3. إذا ظهرت "0 items"، حدث الصفحة

## ما تم إصلاحه:
- ✅ حل مشكلة أنواع البيانات المتضاربة
- ✅ استخدام UUID صحيح لجميع الجداول
- ✅ إضافة فهارس لتحسين الأداء
- ✅ حذف الجداول القديمة أولاً لتجنب التضارب

## إذا واجهت مشاكل أخرى:
1. تأكد من حذف الجداول القديمة أولاً
2. تأكد من تنفيذ الكود كاملاً
3. تحقق من رسائل الخطأ في Supabase Dashboard

🎉 **بعد هذا الإصلاح، سيعمل النظام بشكل مثالي!**

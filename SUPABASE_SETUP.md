# إعداد Supabase للمشروع

## المشكلة الحالية
المشروع يواجه مشكلة `permission denied for schema public` لأن الجداول غير موجودة في قاعدة بيانات Supabase.

## الحلول المتاحة

### الحل الأول: إعداد Supabase يدوياً (مستحسن)

1. **اذهب إلى لوحة تحكم Supabase:**
   - افتح: https://supabase.com/dashboard
   - سجل دخولك واختر مشروعك

2. **اذهب إلى SQL Editor:**
   - من القائمة الجانبية، اختر "SQL Editor"
   - اضغط "New query"

3. **شغل الكود التالي:**

```sql
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
```

4. **اضغط "Run" لتنفيذ الكود**

### الحل الثاني: استخدام نظام الملفات (بديل مؤقت)

إذا كنت تريد تجربة المشروع بدون Supabase، يمكنك:

1. **تجاهل رسائل الخطأ** - المشروع سيعمل مع نظام الملفات كبديل
2. **استخدام المحرر** - اذهب إلى `/editor` لإنشاء الصفحات
3. **حفظ الملفات محلياً** - سيتم حفظ البيانات في مجلد `data/`

## بعد إعداد الجداول

1. **تعبئة القوالب والمكوّنات:**
   ```bash
   curl -X POST http://localhost:3000/api/admin/seed-preline
   ```

2. **استخدام المحرر:**
   - اذهب إلى: http://localhost:3000/editor
   - اسحب المكوّنات من القائمة اليمنى
   - اضغط Save ثم Publish

3. **عرض الصفحة الرئيسية:**
   - اذهب إلى: http://localhost:3000

## معلومات المشروع

- **Supabase URL:** https://zdkwyoeoaplecltzjkmn.supabase.co
- **المشروع يعمل على:** http://localhost:3000
- **المحرر:** http://localhost:3000/editor
- **لوحة التحكم:** http://localhost:3000/admin/dashboard

## استكشاف الأخطاء

إذا واجهت مشاكل:

1. **تأكد من أن Supabase يعمل:**
   - تحقق من لوحة التحكم
   - تأكد من صحة API Keys

2. **تحقق من الصلاحيات:**
   - تأكد من أن RLS مفعل
   - تحقق من السياسات (Policies)

3. **استخدم نظام الملفات:**
   - المشروع سيعمل تلقائياً مع نظام الملفات إذا فشل Supabase

## ملاحظات مهمة

- المشروع يدعم كلاً من Supabase ونظام الملفات
- البيانات محفوظة في مجلد `data/` عند استخدام نظام الملفات
- يمكنك التبديل بين النظامين في أي وقت

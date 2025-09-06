# إعداد Supabase السريع 🚀

## المشكلة الحالية
الجداول غير موجودة في Supabase، لذلك المكونات لا تظهر في المحرر.

## الحل السريع (5 دقائق)

### الخطوة 1: افتح Supabase Dashboard
1. اذهب إلى: https://supabase.com/dashboard
2. سجل دخولك
3. اختر مشروعك: `zdkwyoeoaplecltzjkmn`

### الخطوة 2: إنشاء الجداول
1. من القائمة الجانبية، اختر **"SQL Editor"**
2. اضغط **"New query"**
3. انسخ والصق الكود التالي:

```sql
-- إنشاء جدول الصفحات
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

-- إنشاء جدول إصدارات الصفحات
CREATE TABLE IF NOT EXISTS page_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  version INT,
  components_json JSONB,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء جدول مكتبة المكونات (الأهم!)
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

-- إنشاء جدول الرفع
CREATE TABLE IF NOT EXISTS uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT,
  url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء جدول ملفات المستخدمين
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
```

4. اضغط **"Run"** لتنفيذ الكود
5. انتظر رسالة النجاح ✅

### الخطوة 3: تحميل المكونات
بعد إنشاء الجداول، شغل هذا الأمر:

```bash
curl -X POST http://localhost:3000/api/admin/seed-preline
```

هذا الأمر سيقوم بـ:
- إضافة 100+ مكون إلى قاعدة البيانات
- إنشاء صفحة رئيسية نموذجية
- تفعيل جميع الميزات

### الخطوة 4: اختبار المحرر
1. اذهب إلى: http://localhost:3000/editor
2. يجب أن ترى المكونات في القائمة اليمنى
3. اسحب المكونات إلى الإطار الأوسط
4. اضغط Save ثم Publish

## إذا واجهت مشاكل

### مشكلة: "permission denied"
**الحل**: تأكد من أنك تستخدم Service Role Key وليس Anon Key

### مشكلة: "table not found"
**الحل**: تأكد من تنفيذ SQL بنجاح في Supabase Dashboard

### مشكلة: "0 items" في المحرر
**الحل**: 
1. تأكد من إنشاء جدول `components_library`
2. شغل أمر التحميل: `curl -X POST http://localhost:3000/api/admin/seed-preline`
3. حدث الصفحة

## معلومات المشروع
- **Supabase URL**: https://zdkwyoeoaplecltzjkmn.supabase.co
- **المشروع المحلي**: http://localhost:3000
- **المحرر**: http://localhost:3000/editor
- **لوحة التحكم**: http://localhost:3000/admin/dashboard

## بعد الإعداد
ستتمكن من:
- ✅ رؤية 100+ مكون في المحرر
- ✅ إنشاء صفحات جديدة
- ✅ حفظ ونشر المحتوى
- ✅ استخدام جميع ميزات النظام

🎉 **بعد الإعداد، سيعمل المشروع بكامل طاقته!**

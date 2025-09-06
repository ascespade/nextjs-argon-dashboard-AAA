-- إصلاح صلاحيات Supabase
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

-- إعطاء صلاحيات على الأنواع
GRANT ALL ON ALL TYPES IN SCHEMA public TO postgres;

GRANT ALL ON ALL TYPES IN SCHEMA public TO anon;

GRANT ALL ON ALL TYPES IN SCHEMA public TO authenticated;

GRANT ALL ON ALL TYPES IN SCHEMA public TO service_role;

-- إعطاء صلاحيات على الجداول المحددة
GRANT ALL ON pages TO postgres,
anon,
authenticated,
service_role;

GRANT ALL ON page_versions TO postgres,
anon,
authenticated,
service_role;

GRANT ALL ON components_library TO postgres,
anon,
authenticated,
service_role;

GRANT ALL ON uploads TO postgres,
anon,
authenticated,
service_role;

GRANT ALL ON users_profiles TO postgres,
anon,
authenticated,
service_role;

-- إعطاء صلاحيات على التسلسلات المحددة
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres,
anon,
authenticated,
service_role;

-- إعطاء صلاحيات على الوظائف المحددة
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres,
anon,
authenticated,
service_role;

-- إعطاء صلاحيات على الأنواع المحددة
GRANT ALL ON ALL TYPES IN SCHEMA public TO postgres,
anon,
authenticated,
service_role;

-- إعطاء صلاحيات على الجداول المستقبلية
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres,
anon,
authenticated,
service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres,
anon,
authenticated,
service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres,
anon,
authenticated,
service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TYPES TO postgres,
anon,
authenticated,
service_role;
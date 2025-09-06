-- حل بسيط لصلاحيات Supabase
-- هذا الملف يحل مشكلة "permission denied for schema public"
-- إعطاء صلاحيات أساسية
GRANT USAGE ON SCHEMA public TO postgres,
anon,
authenticated,
service_role;

GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres,
anon,
authenticated,
service_role;

GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres,
anon,
authenticated,
service_role;

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
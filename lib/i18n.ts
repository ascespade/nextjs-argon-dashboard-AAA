'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Locale = 'ar' | 'en';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Translation keys
const translations = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.dashboard': 'لوحة التحكم',
    'nav.editor': 'المحرر',
    'nav.admin': 'الإدارة',
    'nav.login': 'تسجيل الدخول',
    'nav.logout': 'تسجيل الخروج',

    // Editor
    'editor.save': 'حفظ',
    'editor.publish': 'نشر',
    'editor.undo': 'تراجع',
    'editor.redo': 'إعادة',
    'editor.zoom_in': 'تكبير',
    'editor.zoom_out': 'تصغير',
    'editor.reset_zoom': 'إعادة تعيين التكبير',
    'editor.desktop': 'سطح المكتب',
    'editor.tablet': 'تابلت',
    'editor.mobile': 'جوال',
    'editor.components': 'المكونات',
    'editor.search_components': 'البحث في المكونات',
    'editor.add_component': 'إضافة مكون',
    'editor.edit_mode': 'وضع التحرير',
    'editor.navigation_disabled': 'التنقل معطل في وضع التحرير',

    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.cancel': 'إلغاء',
    'common.confirm': 'تأكيد',
    'common.save': 'حفظ',
    'common.edit': 'تحرير',
    'common.delete': 'حذف',
    'common.close': 'إغلاق',

    // Theme
    'theme.light': 'فاتح',
    'theme.dark': 'داكن',
    'theme.toggle': 'تبديل المظهر',

    // Language
    'lang.ar': 'العربية',
    'lang.en': 'English',
    'lang.toggle': 'تبديل اللغة',

    // Enhanced Features
    'common.just_now': 'الآن',
    'common.minutes_ago': 'منذ {minutes} دقيقة',
    'common.hours_ago': 'منذ {hours} ساعة',
    'common.saving': 'جاري الحفظ...',
    'common.save_error': 'فشل الحفظ',
    'common.saved': 'تم الحفظ',
    'common.all': 'الكل',
    'common.use': 'استخدام',

    'editor.keyboard_shortcuts': 'اختصارات لوحة المفاتيح',
    'editor.shortcuts_tip': 'اضغط Escape لإغلاق هذا الحوار',
    'editor.select_template': 'اختيار قالب',
    'editor.search_templates': 'البحث في القوالب...',
    'editor.no_templates_found': 'لم يتم العثور على قوالب',
    'editor.seo_tools': 'أدوات SEO',
    'editor.templates': 'القوالب',
    'editor.seo': 'SEO',

    'seo.page_title': 'عنوان الصفحة',
    'seo.meta_description': 'الوصف التعريفي',
    'seo.keywords': 'الكلمات المفتاحية',
    'seo.og_title': 'عنوان Open Graph',
    'seo.og_description': 'وصف Open Graph',
    'seo.og_image': 'رابط صورة Open Graph',
    'seo.seo_score': 'نقاط SEO',
    'seo.issues': 'المشاكل',
    'seo.suggestions': 'الاقتراحات'
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.editor': 'Editor',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    'nav.logout': 'Logout',

    // Editor
    'editor.save': 'Save',
    'editor.publish': 'Publish',
    'editor.undo': 'Undo',
    'editor.redo': 'Redo',
    'editor.zoom_in': 'Zoom In',
    'editor.zoom_out': 'Zoom Out',
    'editor.reset_zoom': 'Reset Zoom',
    'editor.desktop': 'Desktop',
    'editor.tablet': 'Tablet',
    'editor.mobile': 'Mobile',
    'editor.components': 'Components',
    'editor.search_components': 'Search components',
    'editor.add_component': 'Add Component',
    'editor.edit_mode': 'Edit Mode',
    'editor.navigation_disabled': 'Navigation disabled in edit mode',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.close': 'Close',

    // Theme
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.toggle': 'Toggle Theme',

    // Language
    'lang.ar': 'العربية',
    'lang.en': 'English',
    'lang.toggle': 'Toggle Language',

    // Enhanced Features
    'common.just_now': 'Just now',
    'common.minutes_ago': '{minutes} minutes ago',
    'common.hours_ago': '{hours} hours ago',
    'common.saving': 'Saving...',
    'common.save_error': 'Save failed',
    'common.saved': 'Saved',
    'common.all': 'All',
    'common.use': 'Use',

    'editor.keyboard_shortcuts': 'Keyboard Shortcuts',
    'editor.shortcuts_tip': 'Press Escape to close this dialog',
    'editor.select_template': 'Select Template',
    'editor.search_templates': 'Search templates...',
    'editor.no_templates_found': 'No templates found',
    'editor.seo_tools': 'SEO Tools',
    'editor.templates': 'Templates',
    'editor.seo': 'SEO',

    'seo.page_title': 'Page Title',
    'seo.meta_description': 'Meta Description',
    'seo.keywords': 'Keywords',
    'seo.og_title': 'Open Graph Title',
    'seo.og_description': 'Open Graph Description',
    'seo.og_image': 'Open Graph Image URL',
    'seo.seo_score': 'SEO Score',
    'seo.issues': 'Issues',
    'seo.suggestions': 'Suggestions'
  }
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ar');

  useEffect(() => {
    // Load locale from localStorage
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && (savedLocale === 'ar' || savedLocale === 'en')) {
      setLocaleState(savedLocale);
    } else {
      // Default to Arabic as specified
      setLocaleState('ar');
    }
  }, []);

  useEffect(() => {
    // Apply locale to document
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';

    // Save to localStorage
    localStorage.setItem('locale', locale);
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const t = (key: string, fallback?: string): string => {
    return translations[locale][key as keyof typeof translations[typeof locale]] || fallback || key;
  };

  const isRTL = locale === 'ar';

  return (
    <I18nContext.Provider value= {{ locale, setLocale, t, isRTL }
}>
  { children }
  </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
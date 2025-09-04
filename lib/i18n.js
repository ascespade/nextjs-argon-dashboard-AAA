const translations = {
  en: { welcome: 'Welcome', edit_mode: 'Editing mode' },
  ar: { welcome: '\u0645\u0631\u062d\u0628\u0627', edit_mode: '\u0648\u0636\u0639 \u0627\u0644\u062a\u0639\u062f\u064a\u0644' }
};

export function t(key, lang='en'){
  return (translations[lang] && translations[lang][key]) || translations['en'][key] || key;
}

export function isRtl(lang){
  return lang === 'ar';
}

export default { t, isRtl };

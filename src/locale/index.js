import Vue from 'vue';
import VueI18n from 'vue-i18n';
import enLocale from './lang/en-US';
import viLocale from './lang/vi-VN';
import enUsLocale from 'view-design/src/locale/lang/en-US';
import viVNLocale from 'view-design/src/locale/lang/vi-VN';

Vue.use(VueI18n);

// const navLang = navigator.language;
// const localLang = (navLang == 'vi-VN' || navLang == 'en-US') ? navLang : false;
// const lang = window.localStorage.lang || localLang || 'vi-VN';
const lang = window.localStorage.lang || 'vi-VN';
// const lang = 'en-US';
window.localStorage.setItem('lang', lang)
Vue.config.lang = lang;

Vue.locale = () => { };
const messages = {
  'en-US': Object.assign(enUsLocale, enLocale),
  'vi-VN': Object.assign(viVNLocale, viLocale)
};
const i18n = new VueI18n({
  locale: lang,
  // fallbackLocale: 'vi-VN',
  messages,
  silentTranslationWarn: true,
  silentFallbackWarn: true
});

export default i18n;

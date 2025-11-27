import { I18n } from 'i18n-js';
import en from './locales/en.json';
import hi from './locales/hi.json';

const i18n = new I18n();
i18n.locale = 'en';
i18n.enableFallback = false;
i18n.translations = { en, hi };
i18n.missingTranslation.get = (text:string) => `${text}`;

export const t = (text: string) => i18n.t(text);

export default i18n;
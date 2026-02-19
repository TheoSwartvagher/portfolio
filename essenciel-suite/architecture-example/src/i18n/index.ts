import { I18n } from 'i18n-js';

import fr from './fr.json';
import en from './en.json';

const i18n = new I18n({
  fr,
  en,
});

i18n.enableFallback = true;
i18n.locale = 'fr';

export const t = (key: string) => i18n.t(key);

export const setLanguage = (lang: 'fr' | 'en') => {
  i18n.locale = lang;
};

import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { t as i18nT } from './index';

export const useTranslation = () => {
  const { language } = useContext(LanguageContext);

  // 👇 le simple fait de lire `language`
  // force le re-render quand il change
  return {
    t: (key: string) => i18nT(key),
    language,
  };
};


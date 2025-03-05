import { createIntl, createIntlCache } from 'react-intl';
import enMessages from './locales/en.json';
import jaMessages from './locales/ja.json';

export const AVAILABLE_LOCALES = ['en', 'ja'] as const;
export type Locale = (typeof AVAILABLE_LOCALES)[number];

export const messages = {
  en: enMessages,
  ja: jaMessages,
} as const;

export const defaultLocale: Locale = 'ja';

// This is optional but highly recommended
// since it prevents memory leak
const cache = createIntlCache();

export function getIntl(locale: Locale = defaultLocale) {
  return createIntl(
    {
      locale,
      messages: messages[locale],
    },
    cache,
  );
}

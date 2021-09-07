import i18n from 'i18n.json';
import { Pizza } from 'src/services/pizza/types';

export const supportedLanguages = i18n.locales as Pizza['lang'][];

import { enUS } from '../lang/en-us';

export interface LanguageData {
    [key: string]: string;
}

export const languages: {
    [key: string]: LanguageData;
} = {
    '': enUS,
    en: enUS,
    'en-US': enUS,
};

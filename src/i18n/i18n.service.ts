import { languages, LanguageData } from './languages';

export class I18nService {
    private _data: LanguageData = languages.enUS;

    get(str: string) {
        return this._data[str] || str;
    }

    set(language: string) {
        for (const lang of [language, language.split('-')[0], '']) {
            const data = languages[lang];

            if (data) {
                this._data = data;
                const html = document.getElementsByTagName('html')[0];

                if (html) {
                    html.setAttribute('lang', language);
                }

                const title = document.getElementsByTagName('title')[0];

                if (title) {
                    title.textContent = this.get('app.title');
                }

                return;
            }
        }
    }

    update(obj: { [key: string]: string }) {
        for (const key of Object.keys(obj)) {
            obj[key] = this.get(key);
        }
    }
}

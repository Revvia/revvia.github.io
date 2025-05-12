import { component, css, di, html } from 'fudgel';
import { I18nService } from './i18n/i18n.service';

component('page-title', {
    attr: ['id'],
    style: css`
        h2 {
            margin-top: 0;
        }
    `,
    template: html`
        <h2>{{title}}</h2>
    `,
}, class {
    _i18nService = di(I18nService);
    id = '';
    title = '';

    onChange(propName: string) {
        if (propName === 'id') {
            this.title = this._i18nService.get(this.id);
        }
    }
});

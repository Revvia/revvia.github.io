import { Component, css, di, html } from 'fudgel';
import { I18nService } from './i18n.service';

@Component('i18n-img', {
    attr: ['alt', 'src', 'ws'],
    style: css`
        :host {
            display: block;
        }

        img {
            max-width: 100%;
            max-height: 100%;
            height: auto;
            width: auto;
        }
    `,
    template: html`
        <img *if="src" src="{{src}}" alt="{{value}}" />
    `,
})
export class I18nImgComponent {
    private _i18nService = di(I18nService);
    alt: string = '';
    value: string = '';

    onChange(propName: string) {
        if (propName === 'id') {
            this.value = this._i18nService.get(this.alt);
        }
    }
}

import { Component, di, html } from 'fudgel';
import { I18nService } from './i18n.service';

@Component('i18n-label', {
    attr: ['id', 'ws'],
    // Spaces are necessary because vite/esbuild removes them
    template: html`{{ws}}{{value}}{{ws}}`,
})
export class I18nLabelComponent {
    private _i18nService = di(I18nService);
    id: string = '';
    ws: string = ' '; // Overwritten by attr
    value: string = '';

    onInit() {
        if (typeof this.ws !== 'string') {
            this.ws = ' ';
        }
    }

    onChange() {
        this.value = this._i18nService.get(this.id);
    }
}

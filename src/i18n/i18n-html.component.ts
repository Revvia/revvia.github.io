import { Component, di, rootElement } from 'fudgel';
import { I18nService } from './i18n.service';

@Component('i18n-html', {
    attr: ['id'],
    template: '',
})
export class I18nHtmlComponent {
    private _i18nService = di(I18nService);
    id: string = '';

    onViewInit() {
        const root = rootElement(this);

        if (root) {
            root.innerHTML = this._i18nService.get(this.id);
        }
    }
}

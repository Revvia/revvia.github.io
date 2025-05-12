import { addDirective, setAttribute, Controller, di } from 'fudgel';
import { I18nService } from './i18n.service';

export const i18nAlt = () => {
    const i18nService = di(I18nService);

    addDirective(
        '#i18n-alt',
        (_controller: Controller, node: HTMLElement, attrValue: string) => {
            setAttribute(node, 'alt', i18nService.get(attrValue));
        }
    );
};

import { di } from 'fudgel';
import { i18nAlt, I18nService } from './i18n/i18n.module';
import { InstallPwaService, UpdatePwaService } from './pwa/pwa.module';
import { LightDarkMode } from './datatypes/light-dark-mode';
import { PreferenceService } from './services/preference.service';

export const bootstrap = () => {
    i18nAlt();
    const lightDarkMode = di(PreferenceService).lightDarkMode.getItem();

    if (lightDarkMode === LightDarkMode.DARK) {
        document.body.classList.add('dark');
    } else if (lightDarkMode === LightDarkMode.LIGHT) {
        document.body.classList.add('light');
    }

    setTimeout(() => {
        document.body.classList.add('transition');
    });

    di(I18nService).set(navigator.language || '');
    di(InstallPwaService).listenForEvents();
    di(UpdatePwaService).listenForEvents();
};

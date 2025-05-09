import { component, css, di, html } from 'fudgel';
import { LightDarkMode } from './datatypes/light-dark-mode';
import { PreferenceService } from './services/preference.service';

component(
    'color-scheme',
    {
        style: css`
            @media (prefers-color-scheme: light) {
                .light {
                    display: none;
                }
            }
            @media (prefers-color-scheme: dark) {
                .dark {
                    display: none;
                }
            }
        `,
        template: html`
            <button *if="isAuto" class="light toggle" @click="light()">
                <i18n-label id="colorScheme.light"></i18n-label>
            </button>
            <button *if="!isAuto" class="auto toggle" @click="auto()">
                <i18n-label id="colorScheme.auto"></i18n-label>
            </button>
            <button *if="isAuto" class="dark toggle" @click="dark()">
                <i18n-label id="colorScheme.dark"></i18n-label>
            </button>
        `,
    },
    class {
        isAuto = true;
        _preferenceService = di(PreferenceService);

        constructor() {
            if (document.body.classList.contains('dark') || document.body.classList.contains('light')) {
                this.isAuto = false;
            }
        }

        auto() {
            this._preferenceService.lightDarkMode.reset();
            document.body.classList.remove('dark');
            document.body.classList.remove('light');
            this.isAuto = true;
        }

        light() {
            this._preferenceService.lightDarkMode.setItem(LightDarkMode.LIGHT);
            document.body.classList.remove('dark');
            document.body.classList.add('light');
            this.isAuto = false;
        }

        dark() {
            this._preferenceService.lightDarkMode.setItem(LightDarkMode.DARK);
            document.body.classList.remove('light');
            document.body.classList.add('dark');
            this.isAuto = false;
        }
    }
);

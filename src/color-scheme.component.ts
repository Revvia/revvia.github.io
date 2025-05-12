import { component, css, di, emit, html } from 'fudgel';
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
        _observer: MutationObserver | null = null;
        _preferenceService = di(PreferenceService);

        constructor() {
            this._update();
        }

        onViewInit() {
            this._observer = new MutationObserver(() => {
                this._update();
            });
            this._observer.observe(document.body, {
                attributes: true,
                attributeFilter: ['class'],
            });
        }

        onDestroy() {
            this._observer?.disconnect();
            this._observer = null;
        }

        auto() {
            this._preferenceService.lightDarkMode.reset();
            document.body.classList.remove('dark');
            document.body.classList.remove('light');
            this._update();
        }

        light() {
            this._preferenceService.lightDarkMode.setItem(LightDarkMode.LIGHT);
            document.body.classList.remove('dark');
            document.body.classList.add('light');
            this._update();
        }

        dark() {
            this._preferenceService.lightDarkMode.setItem(LightDarkMode.DARK);
            document.body.classList.remove('light');
            document.body.classList.add('dark');
            this._update();
        }

        _update() {
            this.isAuto = !document.body.classList.contains('dark') && !document.body.classList.contains('light');
        }
    }
);

import { component, css, html } from 'fudgel';

component('app-settings', {
    style: css`
        :host {
            box-sizing: border-box;
            display: block;
            padding: 0.5em;
            width: 100%;
        }

        .option {
            display: flex;
            align-items: top;
            gap: 1em;
        }

        .setting {
            width: 100px;
            flex-shrink: 0
        }

        .description {
            flex: 1;
        }
    `,
    template: html`
    <page-title id="settings.title"></page-title>
    <div class="option">
        <div class="setting">
            <color-scheme></color-scheme>
        </div>
        <div class="description"><i18n-label id="settings.colorScheme"></i18n-label></div>
    </div>
    `,
});

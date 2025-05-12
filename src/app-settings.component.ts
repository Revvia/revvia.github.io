import { component, css, html } from 'fudgel';

component('app-settings', {
    style: css`
        :host {
            box-sizing: border-box;
            display: block;
            padding: 0.5em;
            width: 100%;
        }
    `,
    template: html`
    <color-scheme></color-scheme>
    <p>Toggle between light and dark mode. The system's color scheme is detected and used as the default, but can be overridden here.</p>
    `,
});

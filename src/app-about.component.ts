import { component, css, html } from 'fudgel';

component('app-about', {
    style: css`
        :host {
            box-sizing: border-box;
            display: block;
            padding: 0.5em;
            width: 100%;
        }
    `,
    template: html` <i18n-html id="about.html" ></i18n-html> `,
});

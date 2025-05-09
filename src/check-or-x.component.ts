import { component, css, html } from 'fudgel';

component('check-or-x', {
    attr: ['checked'],
    style: css`
        :host {
            display: inline-flex;
            width: 1em;
            height: 1em;
            text-align: center;
            justify-content: center;
            align-items: center;
            font-size: 1.5em;
            font-weight: bold;
        }
        .checkmark {
            color: green;
        }
        .xmark {
            color: red;
        }
    `,
    template: html`
        <span *if="checkedValue" class="checkmark">&#10003;</span>
        <span *if="!checkedValue" class="xmark">&#10006;</span>
    `,
}, class {
    checked: any;
    checkedValue = false;
    onChange(propName: string) {
        if (propName === 'checked') {
            this.checkedValue = typeof this.checked === 'string';
        }
    }
});

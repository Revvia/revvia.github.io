import { component, css, html } from 'fudgel';

component(
    'menu-item',
    {
        attr: ['href', 'id'],
        prop: ['active'],
        style: css`
            :host {
                box-sizing: border-box;
                display: block;
                padding: 0.25em;
            }

            a {
                display: block;
                padding: 0.25em 0.5em;
                font-size: 1.2em;
                border-radius: 0.5em;
            }

            a:hover {
                background-color: var(--hover-background-color);
            }

            .active {
                background-color: var(--active-background-color);
            }
        `,
        template: html`<a href="{{href}}" class="{{classList}}"
            ><i18n-label id="{{id}}"></i18n-label
        ></a>`,
    },
    class {
        active: boolean = false;
        classList = '';

        onChange(propName: string) {
            if (propName === 'active') {
                this.classList = this.active ? 'active' : '';
            }
        }
    }
);

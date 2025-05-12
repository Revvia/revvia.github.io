import { component, controllerToElement, css, html } from 'fudgel';

component(
    'flyout-menu',
    {
        style: css`
            :host {
                background: var(--menu-bg-color);
                color: var(--fg-color);
                display: none;
                left: calc(-1 * var(--menu-width) - var(--menu-handle-size));
                padding: 8px;
                position: fixed;
                top: 0;
                transition: left 0.5s;
                transition-timing-function: ease-in-out;
                width: calc(var(--menu-width) + var(--menu-handle-size));
                border-right: var(--menu-border);
                border-bottom: var(--menu-border);
                box-sizing: border-box;
            }

            :host.open {
                left: 0;
            }

            .toggle {
                background: var(--menu-bg-color);
                border-bottom: var(--menu-border);
                border-right: var(--menu-border);
                display: block;
                left: 100%;
                padding: 8px;
                position: absolute;
                top: 0;
            }

            svg {
                fill: var(--fg-color);
                width: var(--menu-handle-size);
                height: var(--menu-handle-size);
            }

            @media (max-width: 600px) {
                :host {
                    display: block;
                }
            }
        `,
        template: html`
            <a href="#" class="toggle" @click.stop.prevent="toggle()">
                <svg viewBox="0 0 100 100">
                    <rect x="5" y="14" width="90" height="16" rx="10"></rect>
                    <rect x="5" y="42" width="90" height="16" rx="10"></rect>
                    <rect x="5" y="70" width="90" height="16" rx="10"></rect>
                </svg>
            </a>
            <menu-items class="menu"></menu-items>
        `,
    },
    class {
        _listener = () => this._routeUpdate();

        onInit() {
            document.body.addEventListener('routeChange', this._listener);
        }

        onDestroy() {
            document.body.removeEventListener('routeChange', this._listener);
        }

        toggle() {
            controllerToElement(this)?.classList.toggle('open');
        }

        _routeUpdate() {
            controllerToElement(this)?.classList.remove('open');
        }
    }
);

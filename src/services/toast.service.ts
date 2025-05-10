import { di } from 'fudgel';
import { html } from 'fudgel';
import { I18nService } from '../i18n/i18n.service';

// Toast service based off of this example:
// https://www.youtube.com/watch?v=EWveKYaX-P0
// https://codepen.io/Coding-in-Public/pen/ZEaKENX

export class ToastService {
    private _i18nService = di(I18nService);
    private _toastContainer: HTMLElement | null = null;

    pop(text: string) {
        this._getContainer().insertAdjacentHTML(
            'beforeend',
            html`<div class="toast">${text}</div>`
        );
        const toast = this._getContainer().lastElementChild!;
        toast.addEventListener('animationend', () => {
            toast.remove();

            if (this._toastContainer && !this._toastContainer.children.length) {
                this._toastContainer.remove();
                this._toastContainer = null;
            }
        });
    }

    popI18n(id: string) {
        this.pop(this._i18nService.get(id));
    }

    _getContainer() {
        if (this._toastContainer) {
            return this._toastContainer;
        }

        document.body.insertAdjacentHTML(
            'beforeend',
            html`<div class="toast-container"></div>
                <style>
                    .toast-container {
                        position: fixed;
                        top: 1rem;
                        right: 1.5rem;
                        display: grid;
                        justify-items: end;
                        gap: 1.5rem;
                    }

                    .toast {
                        font-size: 1.5rem;
                        font-weight: bold;
                        line-height: 1;
                        padding: 0.5em 1em;
                        background-color: var(--toast-bg-color);
                        border: var(--toast-border);
                        animation: toastIt 3000ms
                            cubic-bezier(0.785, 0.135, 0.15, 0.86) forwards;
                    }

                    @keyframes toastIt {
                        0%,
                        100% {
                            transform: translateY(-150%);
                            opacity: 0;
                        }
                        10%,
                        90% {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }
                </style>`
        );
        this._toastContainer = document.querySelector('.toast-container')!;

        return this._toastContainer;
    }
}

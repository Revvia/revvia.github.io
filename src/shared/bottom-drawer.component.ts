import { Component, controllerToElement, css, html } from 'fudgel';

let lock = Promise.resolve();

@Component('bottom-drawer', {
    style: css`
        :host {
            top: 200vh;
            position: fixed;
            display: flex;
            transition: bottom 1s ease-in-out 0s;
            left: 50%;
            transform: translate(-50%);
        }

        .tab {
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            border-top: 2px solid;
            border-left: 2px solid;
            border-right: 2px solid;
            padding: 0.3em 0.6em;
            background-color: var(--button-bg-color);
            display: flex;
            align-items: center;
        }
    `,
    template: html`
        <div class="tab">
            <slot></slot>
        </div>
    `,
    useShadow: true,
})
export class BottomDrawerComponent {
    private _lockRelease = () => {};
    private _timeout?: ReturnType<typeof setTimeout>;

    onInit() {
        const element = this._element() as any;
        element.show = () => this._show();
        element.hide = () => this._hide();
    }

    onDestroy() {
        if (this._timeout) {
            clearTimeout(this._timeout);
        }

        if (this._lockRelease) {
            this._lockRelease();
        }
    }

    private _hide() {
        if (this._timeout) {
            clearTimeout(this._timeout);
        }

        this._element().style.bottom = `-${this._height()}px`;
        this._timeout = setTimeout(() => this._destroy(), 2000);
    }

    private _show() {
        lock = lock.then(() => {
            return new Promise((resolve) => {
                this._lockRelease = resolve;
                const style = this._element().style;
                style.top = 'auto';
                style.bottom = `-${this._height()}px`;
                this._timeout = setTimeout(() => {
                    style.bottom = '0';
                    this._timeout = setTimeout(() => {
                        this._hide();
                    }, 15000);
                }, 400);
            })
        });
    }

    private _destroy() {
        this._lockRelease();
        this._element().remove();
    }

    private _element() {
        return controllerToElement(this)!;
    }

    private _height() {
        // Round any partials up and then add a 1 pixel buffer to ensure no
        // artifacts are visible by accident or with antialiasing.
        const rect = this._element().getBoundingClientRect();

        return Math.ceil(rect.height + 1);
    }
}

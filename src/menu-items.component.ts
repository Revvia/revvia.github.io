import { component, css, html } from 'fudgel';

interface MenuItemInfo {
    active: boolean;
    href: string;
    id: string;
}

component('menu-items', {
    style: css`
        :host {
            background-color: var(--menu-bg-color);
        }
    `,
    template: html`
        <menu-item *for="item of items"
            id="{{item.id}}"
            href="{{item.href}}"
            .active="item.active"
        ></menu-item>
    `,
}, class {
    items: MenuItemInfo[] = [
        { id: 'menu.connect', href: '/connect', active: false },
        { id: 'menu.settings', href: '/settings', active: false },
        { id: 'menu.about', href: '/about', active: false },
    ];
    _listener = (e: Event) => this._update((e as CustomEvent).detail);

    onInit() {
        document.body.addEventListener(
            'routeChange',
            this._listener
        );
    }

    onDestroy() {
        document.body.removeEventListener(
            'routeChange',
            this._listener
        );
    }

    _update(path: string) {
        this.items = this.items.map((item) => ({
            ...item,
            active: item.href === path,
        }));
    }
});

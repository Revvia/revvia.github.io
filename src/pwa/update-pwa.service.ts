import { registerSW } from 'virtual:pwa-register';

export class UpdatePwaService {
    private _updateSW: ReturnType<typeof registerSW> | null = null;

    listenForEvents() {
        // Allow for local development without the "reload" drawer opening.
        // If you want to see the drawer, comment out this code.  This is
        // always hosted at a secure site, so "http:" only works during
        // development.
        if (
            window.location.hostname === 'localhost' ||
            window.location.protocol === 'http:'
        ) {
            return;
        }

        this._updateSW = registerSW({
            onNeedRefresh: () => {
                this._showCustomUi();
            },
        });
    }

    performUpdate() {
        if (this._updateSW) {
            this._updateSW();
        }
    }

    private _showCustomUi() {
        document.body.appendChild(document.createElement('update-pwa'));
    }
}

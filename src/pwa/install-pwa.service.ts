export class InstallPwaService {
    private _event: Event | null = null;

    listenForEvents() {
        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            this._event = event;
            this._showCustomUi();
        });
    }

    triggerSavedEvent() {
        if (this._event) {
            // Not official enough for TypeScript to include.
            (this._event as any).prompt();

            // The prompt method can only be used once.
            this._event = null;
        }
    }

    private _showCustomUi() {
        document.body.appendChild(document.createElement('install-pwa'));
    }
}

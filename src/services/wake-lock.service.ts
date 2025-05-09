import { AvailabilityState } from '../datatypes/availability-state';
import { di } from 'fudgel';
import { from, of } from 'rxjs';
import { ToastService } from './toast.service';

export class WakeLockService {
    private _currentLock: WakeLockSentinel | null = null;
    private _toastService = di(ToastService);

    availabilityState() {
        if (!window.navigator.wakeLock) {
            return of(AvailabilityState.UNAVAILABLE);
        }

        if (this._currentLock) {
            return of(AvailabilityState.ALLOWED);
        }

        return from(
            this._getLock().then((waitLock) => {
                if (waitLock) {
                    waitLock.release();

                    return AvailabilityState.ALLOWED;
                }

                return AvailabilityState.DENIED;
            })
        );
    }

    release() {
        if (this._currentLock) {
            this._currentLock.release();
            this._currentLock = null;
            this._toastService.popI18n('service.wakeLock.released');
        }
    }

    request() {
        if (!window.navigator.wakeLock) {
            return;
        }

        if (this._currentLock) {
            return;
        }

        return this._getLock().then((waitLock) => {
            if (waitLock) {
                this._currentLock = waitLock;
                this._toastService.popI18n('service.wakeLock.obtained');
            }
        });
    }

    private _getLock() {
        return window.navigator.wakeLock.request().catch(() => {});
    }
}

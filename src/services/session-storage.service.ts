import { concat, Observable, of, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export const TERMS_ACCEPTED = 'termsAccepted';

interface SessionStorageChangeEvent {
    key: string;
    newValue: any;
}

// Saves values in session storage and also allows observables to notice when
// the value changes for the current tab.
export class SessionStorageService {
    private readonly _subject = new Subject<SessionStorageChangeEvent>();

    observe(key: string): Observable<any> {
        let value = sessionStorage.getItem(key);

        try {
            value = JSON.parse(value ?? '');
        } catch (_ignore) {
            value = null;
        }

        return concat(of(value), this._subject.asObservable().pipe(
            filter((event: SessionStorageChangeEvent) => event.key === key),
            map((event: SessionStorageChangeEvent) => event.newValue)
        ));
    }

    set(key: string, value: any): void {
        sessionStorage.setItem(key, JSON.stringify(value));
        this._subject.next({ key, newValue: value });
    }
}

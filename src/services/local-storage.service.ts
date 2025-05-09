export interface LocalStorageInterface<T> {
    getItem: () => T | null;
    reset: () => void;
    setItem: (value: T) => void;
}

export class LocalStorageService {
    static boolean(key: string, version = 1): LocalStorageInterface<boolean> {
        return {
            getItem: () =>
                this._get(key, version, (value) => typeof value === 'boolean'),
            reset: () => localStorage.removeItem(key),
            setItem: (value: boolean) => this._set(key, value, version),
        };
    }

    static enum<T>(
        key: string,
        enumObject: { [key: string]: T },
        version = 1
    ): LocalStorageInterface<T> {
        return this.list(key, [...Object.values(enumObject)], version);
    }

    static json<T>(
        key: string,
        version = 1,
        validator: (value: T) => boolean
    ): LocalStorageInterface<T> {
        return {
            getItem: () => this._get(key, version, validator),
            reset: () => localStorage.removeItem(key),
            setItem: (value: T) => this._set(key, value, version),
        };
    }

    static list<T>(
        key: string,
        allowedValues: T[],
        version = 1
    ): LocalStorageInterface<T> {
        return {
            getItem: () => {
                const value = this._get<T>(key, version, (value) =>
                    allowedValues.includes(value)
                );

                return allowedValues.includes(value as T) ? (value as T) : null;
            },
            reset: () => localStorage.removeItem(key),
            setItem: (value: T) =>
                allowedValues.includes(value)
                    ? this._set(key, value, version)
                    : localStorage.removeItem(key),
        };
    }

    static number(key: string, version = 1): LocalStorageInterface<number> {
        return {
            getItem: () =>
                this._get(key, version, (value) => typeof value === 'number'),
            reset: () => localStorage.removeItem(key),
            setItem: (value: number) => this._set(key, value, version),
        };
    }

    static string(key: string, version = 1): LocalStorageInterface<string> {
        return {
            getItem: () =>
                this._get(key, version, (value) => typeof value === 'string'),
            reset: () => localStorage.removeItem(key),
            setItem: (value: string) => this._set(key, value, version),
        };
    }

    static _get<T>(
        key: string,
        version: number,
        validator: (value: T) => boolean
    ): T | null {
        const encoded = localStorage.getItem(key);

        if (!encoded) {
            return null;
        }

        try {
            const parsed = JSON.parse(encoded);

            if (parsed[0] === version && validator(parsed[1])) {
                return parsed[1];
            }
        } catch (_ignore) {}

        return null;
    }

    static _set(key: string, value: any, version: number) {
        try {
            localStorage.setItem(key, JSON.stringify([version, value]));
        } catch (_ignore) {
            // On error, clear the storage. There was a value that ran away.
            localStorage.clear();
        }
    }
}

import { BehaviorSubject } from 'rxjs';
import { FieldDef } from '../fields';

export class ControllerStateService {
    private state = new BehaviorSubject<number[] | null>(null);

    clearState() {
        this.state.next(null);
    }

    fromHex(hex: string) {
        const numbers = [];

        for (let i = 0; i < hex.length; i += 2) {
            const byte = hex.substr(i, 2);
            const number = parseInt(byte, 16);

            if (isNaN(number)) {
                throw new Error(`REV_9762 Invalid hex byte: ${byte}`);
            }

            numbers.push(number);
        }

        this._setState(numbers);
    }

    fromIni(iniFileContents: string) {
        // There are 119 lines of base-10 numbers in the file.
        const lines = iniFileContents.split('\n');
        const numbers = lines
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
            .map((line) => parseInt(line, 10));

        this._setState(numbers);
    }

    getField(fieldDef: FieldDef) {
        const state = this._getState();
        let byte = state[fieldDef.byte];
        let mask = 0xff;

        if (fieldDef.word) {
            byte <<= 8;
            byte |= state[fieldDef.byte + 1];
            mask = 0xffff;
        }

        if (fieldDef.shift) {
            byte >>= fieldDef.shift;
        }

        if (fieldDef.mask) {
            byte &= fieldDef.mask;
            mask = fieldDef.mask;
        }

        if (fieldDef.signed) {
            if (byte > mask >> 1) {
                byte = 1 + mask - byte;
            }
        }

        if (fieldDef.decimals) {
            byte /= Math.pow(10, fieldDef.decimals);
        }

        return byte;
    }

    getObservable() {
        return this.state.asObservable();
    }

    setField(fieldDef: FieldDef, value: number) {
        const state = this._getState();
        let byte = value;

        if (fieldDef.decimals) {
            byte *= Math.pow(10, fieldDef.decimals);
        }

        if (fieldDef.signed) {
            byte = 0x10000 + byte;
        }

        if (fieldDef.word) {
            state[fieldDef.byte] = (byte >> 8) & 0xff;
            state[fieldDef.byte + 1] = byte & 0xff;
        } else if (!fieldDef.mask) {
            state[fieldDef.byte] = byte & 0xff;
        } else {
            let mask = fieldDef.mask;

            if (fieldDef.shift) {
                byte <<= fieldDef.shift;
                mask <<= fieldDef.shift;
            }

            state[fieldDef.byte] = (state[fieldDef.byte] & ~mask) | byte;
        }

        this.state.next(state);
    }

    toHex(): string {
        return this._getState()
            .map((number) => number.toString(16).padStart(2, '0'))
            .join('');
    }

    toIni(): string {
        return this._getState()
            .map((number) => number.toString(10))
            .join('\n')
            .trim();
    }

    _getState(): number[] {
        const state = this.state.getValue();

        if (!state) {
            throw new Error('REV_4641 No loaded state');
        }

        return state;
    }

    _setState(state: number[]) {
        if (state.length !== 119) {
            throw new Error(
                `REV_3229 Expected 119 numbers, but got ${state.length}`
            );
        }

        for (let i = 0; i < state.length; i++) {
            if (isNaN(state[i])) {
                throw new Error(
                    `REV_3645 Number #${i + 1} failed validation: NaN`
                );
            }

            if (state[i] < 0 || state[i] > 255) {
                throw new Error(
                    `REV_1793 Number #${i + 1} failed validation: ${state[i]} is not in range 0-255`
                );
            }
        }

        this.state.next(state);
    }
}

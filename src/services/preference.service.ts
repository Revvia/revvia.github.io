import { DistanceSystem } from '../datatypes/distance-system';
import { LightDarkMode } from '../datatypes/light-dark-mode';
import {
    LocalStorageInterface,
    LocalStorageService,
} from './local-storage.service';

export class PreferenceService {
    distanceSystem: LocalStorageInterface<DistanceSystem>;
    lightDarkMode: LocalStorageInterface<LightDarkMode>

    constructor() {
        const preferenceVersion =
            LocalStorageService.number('preferenceVersion');

        if (preferenceVersion.getItem() !== 1) {
            preferenceVersion.setItem(1);
        }

        this.distanceSystem = LocalStorageService.enum<DistanceSystem>(
            'distanceSystem',
            DistanceSystem
        );
        this.lightDarkMode = LocalStorageService.enum<LightDarkMode>(
            'lightDarkMode',
            LightDarkMode
        );
    }
}

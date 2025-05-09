export interface FieldDefSourceBase {
    byte: number; // 0-based index for location of byte
    word?: boolean; // If true, the value is a 16-bit word (2 bytes)
    shift?: number; // Shift value's bits right, used with mask
    mask?: number; // Mask off bits after shifting
}

export interface FieldDefSourceByte {
    byte: number;
    word?: false | undefined;
    shift?: undefined;
    mask?: undefined;
}

export interface FieldDefSourceWord {
    byte: number;
    word: true;
    shift?: undefined;
    mask?: undefined;
}

export interface FieldDefSourceBits {
    byte: number;
    word?: false | undefined;
    shift?: number | undefined;
    mask: number;
}

export type FieldDefSource = FieldDefSourceBase &
    (FieldDefSourceByte | FieldDefSourceWord | FieldDefSourceBits);

export interface FieldDefDataBase {
    signed?: boolean; // If true, the value is signed
    decimals?: number; // Number of decimal places, default is 0
    type: 'number' | 'boolean' | 'list';
    unit?: string; // Unit of measurement, e.g., 'V', 'A', '%'
    min?: number; // Minimum value, default is 0
    max?: number; // Maximum value, default is 255 (or 127 if signed)
}

export interface FieldDefDataNumber {
    type: 'number';
}

export interface FieldDefDataBoolean {
    signed?: false | undefined;
    decimals?: false | undefined;
    type: 'boolean';
    unit?: false | undefined;
    min?: false | undefined;
    max?: false | undefined;
}

export interface FieldDefDataList {
    signed?: false | undefined;
    decimals?: false | undefined;
    type: 'list';
    unit?: false | undefined;
    min?: false | undefined;
    max?: false | undefined;
}

export const portSettings: Record<string, FieldDef> = {
    sw: { byte: 0, mask: 0x01, type: 'boolean' },
    fud: { byte: 0, shift: 1, mask: 0x06, type: 'list' },
    la: { byte: 0, shift: 3, mask: 0x01, type: 'boolean' },
    // Next 4 bits are unknown
    program: { byte: 1, mask: 0x7f, type: 'list' },
    io: { byte: 1, shift: 7, mask: 0x1, type: 'boolean' },
};

export interface FieldDefDataPortSettings {
    signed?: false | undefined;
    decimals?: false | undefined;
    type: 'complex';
    unit?: false | undefined;
    min?: false | undefined;
    max?: false | undefined;
    fieldDefs: Record<string, FieldDef>;
}

export type FieldDefData = FieldDefDataBase &
    (
        | FieldDefDataNumber
        | FieldDefDataBoolean
        | FieldDefDataList
    );

export type FieldDef = FieldDefSource & FieldDefData;

// Fields are listed in the same order as the bytes returned from LDGET request
// through the serial protocol.
export const fields: Record<string, FieldDef> = {
    // Settings 1, byte indexes 0 - 16
    model: { byte: 0, type: 'list' },
    voltage: { byte: 1, shift: 0, mask: 0x0f, type: 'list' },
    brand: { byte: 1, shift: 4, mask: 0x0f, type: 'list' },
    overvoltage: {
        byte: 2,
        word: true,
        decimals: 1,
        type: 'number',
        unit: 'V',
    },
    softUndervoltage: {
        byte: 4,
        word: true,
        decimals: 1,
        type: 'number',
        unit: 'V',
    },
    undervoltageVariation: { byte: 6, decimals: 1, type: 'number', unit: 'V' },
    regenCurrent: { byte: 7, word: true, type: 'number', unit: 'A' },
    phaseCurrentMax: { byte: 9, word: true, type: 'number', unit: 'A' },
    underVoltage: { byte: 11, word: true, type: 'number', unit: 'V' },
    voltageCalibration: {
        byte: 13,
        word: true,
        signed: true,
        type: 'number',
        unit: 'V',
    },
    currentCalibration: {
        byte: 15,
        word: true,
        signed: true,
        type: 'number',
        unit: 'A',
    },

    // Settings 2, byte indexes 17 - 33
    busCurrentLimitMax: { byte: 17, word: true, type: 'number', unit: 'A' },
    maxRpmGear1: { byte: 19, type: 'number', unit: '%', max: 100 },
    maxRpmGear2: { byte: 20, type: 'number', unit: '%', max: 100 },
    maxRpmGear3: { byte: 21, type: 'number', unit: '%', max: 100 },
    fluxWeakeningKP: { byte: 22, word: true, type: 'number', unit: 'A' },
    highFluxWeakening: { byte: 24, word: true, type: 'number', unit: 'A' },
    midFluxWeaking: { byte: 26, word: true, type: 'number', unit: 'A' },
    speedLimiter: { byte: 28, shift: 0, mask: 0x01, type: 'boolean' },
    defaultGear: { byte: 28, shift: 1, mask: 0x07, type: 'list' },
    motorVType: { byte: 28, shift: 4, mask: 0x01, type: 'boolean' },
    gearChangingSwitch: { byte: 28, shift: 5, mask: 0x01, type: 'boolean' },
    lowBrake: { byte: 28, shift: 6, mask: 0x01, type: 'boolean' },
    softStart: { byte: 28, shift: 7, mask: 0x01, type: 'boolean' },
    speedLimit: { byte: 29, type: 'number', unit: '%', max: 100 },
    softStartGrade: { byte: 30, type: 'number', max: 16, min: 1 },
    sportModeAutoDisableTime: { byte: 31, type: 'number', unit: 's' },
    sportModeRecoveryTime: { byte: 32, type: 'number', unit: 's' },
    fluxCompensationMTPA: { byte: 33, type: 'number', unit: 'Nm/A' },

    // Settings 3, byte indexes 34 - 50
    hallShiftAngle: {
        byte: 34,
        word: true,
        type: 'number',
        signed: true,
        unit: '°',
        min: -180,
        max: 180,
    },
    controllerHighTemp: { byte: 36, type: 'number', unit: '°C' },
    controllerOverTemp: { byte: 37, type: 'number', unit: '°C' },
    controllerMaxTemp: { byte: 38, type: 'number', unit: '°C' },
    externalTempLimitTC1: { byte: 39, word: true, type: 'number', unit: '°C' },
    dampeningTractionControlTC2: { byte: 41, word: true, type: 'number' },
    displaySpeedAdjustmentTC3: { byte: 43, word: true, type: 'number' },
    reverseSpeedMax: { byte: 45, type: 'number', unit: '%', max: 100 },
    // unknownBit1: { byte: 46, shift: 0, mask: 0x01, type: 'boolean' },
    // unknownBit2: { byte: 46, shift: 1, mask: 0x01, type: 'boolean' },
    // unknownBit3: { byte: 46, shift: 2, mask: 0x01, type: 'boolean' },
    hillHoldControlHHC: { byte: 46, shift: 3, mask: 0x01, type: 'boolean' },
    exchangePhaseBlueGreen: { byte: 46, shift: 4, mask: 0x01, type: 'boolean' },
    exchangeHallYellowBlue: { byte: 46, shift: 5, mask: 0x01, type: 'boolean' },
    autoDisableSportMode: { byte: 46, shift: 6, mask: 0x01, type: 'boolean' },
    motorRotationReversed: { byte: 46, shift: 7, mask: 0x01, type: 'boolean' },
    polePairs: { byte: 47, type: 'number' },
    regenerativeBrakingEBS: { byte: 48, type: 'number', unit: '%', max: 100 },
    softwareVersion: { byte: 49, type: 'number', decimals: 2 },
    hardwareVersion: { byte: 50, type: 'number', decimals: 2 },

    // Settings 4, byte indexes 51 - 67
    movingVehicleBooster: { byte: 51, mask: 0x01, type: 'boolean' },
    hillDescentControlHDC: { byte: 51, shift: 1, mask: 0x01, type: 'boolean' },
    speedometerOutputOneLin: {
        byte: 51,
        shift: 2,
        mask: 0x01,
        type: 'boolean',
    },
    cruiseControl: { byte: 51, shift: 3, mask: 0x01, type: 'boolean' },
    doubleVoltageDetection: { byte: 51, shift: 4, mask: 0x01, type: 'boolean' },
    doubleVoltageDetectHigh: {
        byte: 51,
        shift: 5,
        mask: 0x01,
        type: 'boolean',
    },
    secureBoot: { byte: 51, shift: 6, mask: 0x01, type: 'boolean' },
    // unknown: { byte: 51, shift: 7, mask: 0x01, type: 'boolean' },
    movingVehicleBoosterSpeed: {
        byte: 52,
        word: true,
        type: 'number',
        unit: 'rpm',
    },
    movingVehicleBoosterTorque: {
        byte: 54,
        word: true,
        type: 'number',
        unit: 'Nm',
    },
    hillDescentControlMaxSpeed: {
        byte: 56,
        word: true,
        type: 'number',
        unit: 'rpm',
    },
    gear1AmpMax: { byte: 58, type: 'number', unit: '%', max: 100 },
    gear2AmpMax: { byte: 59, type: 'number', unit: '%', max: 100 },
    gear3OverCurrent: { byte: 60, type: 'number', unit: '%' },
    fluxWeakeningValueKI: { byte: 61, word: true, type: 'number', unit: 'A' },
    phaseLimitCurrent: { byte: 63, word: true, type: 'number', unit: 'A' },
    phaseLimitTime: { byte: 65, word: true, type: 'number', unit: 's' },
    weakFluxCalibration: { byte: 67, type: 'number' },

    // Settings 5, byte indexes 68 - 84
    portPd0Sw: { byte: 68, mask: 0x01, type: 'boolean' },
    portPd0Fud: { byte: 68, shift: 1, mask: 0x06, type: 'list' },
    portPd0La: { byte: 68, shift: 3, mask: 0x01, type: 'boolean' },
    // portPd0Unknown: { byte: 68, shift: 4, mask: 0x0f, type: 'number' },
    portPd0Program: { byte: 69, mask: 0x7f, type: 'list' },
    portPd0Io: { byte: 69, shift: 7, mask: 0x1, type: 'boolean' },
    portJtckSw: { byte: 70, mask: 0x01, type: 'boolean' },
    portJtckFud: { byte: 70, shift: 1, mask: 0x06, type: 'list' },
    portJtckLa: { byte: 70, shift: 3, mask: 0x01, type: 'boolean' },
    // portJtckUnknown: { byte: 70, shift: 4, mask: 0x0f, type: 'number' },
    portJtckProgram: { byte: 71, mask: 0x7f, type: 'list' },
    portJtckIo: { byte: 71, shift: 7, mask: 0x1, type: 'boolean' },
    portSwdSw: { byte: 72, mask: 0x01, type: 'boolean' },
    portSwdFud: { byte: 72, shift: 1, mask: 0x06, type: 'list' },
    portSwdLa: { byte: 72, shift: 3, mask: 0x01, type: 'boolean' },
    // portSwdUnknown: { byte: 72, shift: 4, mask: 0x0f, type: 'number' },
    portSwdProgram: { byte: 73, mask: 0x7f, type: 'list' },
    portSwdIo: { byte: 73, shift: 7, mask: 0x1, type: 'boolean' },
    portPa11Sw: { byte: 74, mask: 0x01, type: 'boolean' },
    portPa11Fud: { byte: 74, shift: 1, mask: 0x06, type: 'list' },
    portPa11La: { byte: 74, shift: 3, mask: 0x01, type: 'boolean' },
    // portPa11Unknown: { byte: 74, shift: 4, mask: 0x0f, type: 'number' },
    portPa11Program: { byte: 75, mask: 0x7f, type: 'list' },
    portPa11Io: { byte: 75, shift: 7, mask: 0x1, type: 'boolean' },
    portPb3Sw: { byte: 76, mask: 0x01, type: 'boolean' },
    portPb3Fud: { byte: 76, shift: 1, mask: 0x06, type: 'list' },
    portPb3La: { byte: 76, shift: 3, mask: 0x01, type: 'boolean' },
    // portPb3Unknown: { byte: 76, shift: 4, mask: 0x0f, type: 'number' },
    portPb3Program: { byte: 77, mask: 0x7f, type: 'list' },
    portPb3Io: { byte: 77, shift: 7, mask: 0x1, type: 'boolean' },
    portPd1Sw: { byte: 78, mask: 0x01, type: 'boolean' },
    portPd1Fud: { byte: 78, shift: 1, mask: 0x06, type: 'list' },
    portPd1La: { byte: 78, shift: 3, mask: 0x01, type: 'boolean' },
    // portPd1Unknown: { byte: 78, shift: 4, mask: 0x0f, type: 'number' },
    portPd1Program: { byte: 79, mask: 0x7f, type: 'list' },
    portPd1Io: { byte: 79, shift: 7, mask: 0x1, type: 'boolean' },
    portPa12Sw: { byte: 80, mask: 0x01, type: 'boolean' },
    portPa12Fud: { byte: 80, shift: 1, mask: 0x06, type: 'list' },
    portPa12La: { byte: 80, shift: 3, mask: 0x01, type: 'boolean' },
    // portPa12Unknown: { byte: 80, shift: 4, mask: 0x0f, type: 'number' },
    portPa12Program: { byte: 81, mask: 0x7f, type: 'list' },
    portPa12Io: { byte: 81, shift: 7, mask: 0x1, type: 'boolean' },
    portPc15Sw: { byte: 82, mask: 0x01, type: 'boolean' },
    portPc15Fud: { byte: 82, shift: 1, mask: 0x06, type: 'list' },
    portPc15La: { byte: 82, shift: 3, mask: 0x01, type: 'boolean' },
    // portPc15Unknown: { byte: 82, shift: 4, mask: 0x0f, type: 'number' },
    portPc15Program: { byte: 83, mask: 0x7f, type: 'list' },
    portPc15Io: { byte: 83, shift: 7, mask: 0x1, type: 'boolean' },
    // unknown: { byte: 84, type: 'number' },

    // Settings 6, byte indexes 85 - 101
    portPa0Sw: { byte: 85, mask: 0x01, type: 'boolean' },
    portPa0Fud: { byte: 85, shift: 1, mask: 0x06, type: 'list' },
    portPa0La: { byte: 85, shift: 3, mask: 0x01, type: 'boolean' },
    // portPa0Unknown: { byte: 85, shift: 4, mask: 0x0f, type: 'number' },
    portPa0Program: { byte: 86, mask: 0x7f, type: 'list' },
    portPa0Io: { byte: 86, shift: 7, mask: 0x1, type: 'boolean' },
    portPb9Sw: { byte: 87, mask: 0x01, type: 'boolean' },
    portPb9Fud: { byte: 87, shift: 1, mask: 0x06, type: 'list' },
    portPb9La: { byte: 87, shift: 3, mask: 0x01, type: 'boolean' },
    // portPb9Unknown: { byte: 87, shift: 4, mask: 0x0f, type: 'number' },
    portPb9Program: { byte: 88, mask: 0x7f, type: 'list' },
    portPb9Io: { byte: 88, shift: 7, mask: 0x1, type: 'boolean' },
    portPb4Sw: { byte: 89, mask: 0x01, type: 'boolean' },
    portPb4Fud: { byte: 89, shift: 1, mask: 0x06, type: 'list' },
    portPb4La: { byte: 89, shift: 3, mask: 0x01, type: 'boolean' },
    // portPb4Unknown: { byte: 89, shift: 4, mask: 0x0f, type: 'number' },
    portPb4Program: { byte: 90, mask: 0x7f, type: 'list' },
    portPb4Io: { byte: 90, shift: 7, mask: 0x1, type: 'boolean' },
    portPa15Sw: { byte: 91, mask: 0x01, type: 'boolean' },
    portPa15Fud: { byte: 91, shift: 1, mask: 0x06, type: 'list' },
    portPa15La: { byte: 91, shift: 3, mask: 0x01, type: 'boolean' },
    // portPa15Unknown: { byte: 91, shift: 4, mask: 0x0f, type: 'number' },
    portPa15Program: { byte: 92, mask: 0x7f, type: 'list' },
    portPa15Io: { byte: 92, shift: 7, mask: 0x1, type: 'boolean' },
    portPb2Sw: { byte: 93, mask: 0x01, type: 'boolean' },
    portPb2Fud: { byte: 93, shift: 1, mask: 0x06, type: 'list' },
    portPb2La: { byte: 93, shift: 3, mask: 0x01, type: 'boolean' },
    // portPb2Unknown: { byte: 93, shift: 4, mask: 0x0f, type: 'number' },
    portPb2Program: { byte: 94, mask: 0x7f, type: 'list' },
    portPb2Io: { byte: 94, shift: 7, mask: 0x1, type: 'boolean' },
    portPc14Sw: { byte: 95, mask: 0x01, type: 'boolean' },
    portPc14Fud: { byte: 95, shift: 1, mask: 0x06, type: 'list' },
    portPc14La: { byte: 95, shift: 3, mask: 0x01, type: 'boolean' },
    // portPc14Unknown: { byte: 95, shift: 4, mask: 0x0f, type: 'number' },
    portPc14Program: { byte: 96, mask: 0x7f, type: 'list' },
    portPc14Io: { byte: 96, shift: 7, mask: 0x1, type: 'boolean' },
    portPb5Sw: { byte: 97, mask: 0x01, type: 'boolean' },
    portPb5Fud: { byte: 97, shift: 1, mask: 0x06, type: 'list' },
    portPb5La: { byte: 97, shift: 3, mask: 0x01, type: 'boolean' },
    // portPb5Unknown: { byte: 97, shift: 4, mask: 0x0f, type: 'number' },
    portPb5Program: { byte: 98, mask: 0x7f, type: 'list' },
    portPb5Io: { byte: 98, shift: 7, mask: 0x1, type: 'boolean' },
    portPd15Sw: { byte: 99, mask: 0x01, type: 'boolean' },
    portPd15Fud: { byte: 99, shift: 1, mask: 0x06, type: 'list' },
    portPd15La: { byte: 99, shift: 3, mask: 0x01, type: 'boolean' },
    // portPd15Unknown: { byte: 99, shift: 4, mask: 0x0f, type: 'number' },
    portPd15Program: { byte: 100, mask: 0x7f, type: 'list' },
    portPd15Io: { byte: 100, shift: 7, mask: 0x1, type: 'boolean' },
    // unknown: { byte: 101, type: 'number' },

    // Settings 7, byte indexes 102 - 118
    throttleStart: { byte: 102, type: 'number', unit: 'V' },
    throttleEnd: { byte: 103, type: 'number', unit: 'V' },
    throttleLowProtect: { byte: 104, type: 'number', unit: 'V' },
    throttleHighProtect: { byte: 105, type: 'number', unit: 'V' },
    rateOfDecline: { byte: 106, type: 'number' },
    rateOfRise: { byte: 107, type: 'number' },
    startingTorque: { byte: 108, word: true, type: 'number', unit: 'Nm' },
    torqueSmoothingFactor: { byte: 110, word: true, type: 'number' },
    // unknown: { byte: 112, type: 'number' },
    // unknown: { byte: 113, type: 'number' },
    // unknown: { byte: 114, type: 'number' },
    // unknown: { byte: 115, type: 'number' },
    // unknown: { byte: 116, type: 'number' },
    // unknown: { byte: 117, type: 'number' },
    // unknown: { byte: 118, type: 'number' },
};

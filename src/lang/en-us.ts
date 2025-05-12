import { html } from 'fudgel';
import type { LanguageData } from '../i18n/languages';

export const enUS: LanguageData = {
    // About page
    'about.buildInformation': 'Build information:',
    'about.html': html`
        <p>
            Revvia is an open-source, web-based app for programming Votol
            controllers.
        </p>
        <p>
            Have a suggestion, bug report, or other way that this software can
            be better? Go to the project page on
            <a href="https://github.com/fidian/revvia/">GitHub</a> and create an
            issue. You can also contact the author directly
            <a href="mailto:fidian@rumkin.com">through email</a>.
        </p>
    `,
    'about.title': 'About',

    // Application-related and global strings
    'app.title': 'Revvia',

    // Connection page
    'connect.bluetoothConnect': 'Connect to Bluetooth Serial Port',
    'connect.bluetoothDescriptionHtml': html`
        <ul>
            <li>
                Requires the Bluetooth adapter, which can come in a black or a
                white case.
            </li>
            <li>
                Should work with EM50-4, EM80GTSP (with CAN), EM100SP,
                EM150-2SP, EM200-2SP, EM260SP, SV120 (with CAN).
            </li>
        </ul>
    `,
    'connect.bluetoothState.CONNECTED': 'Bluetooth Connected',
    'connect.bluetoothState.CONNECTING': 'Bluetooth Connecting ...',
    'connect.bluetoothState.RECONNECTING': 'Bluetooth Reconnecting ...',
    'connect.bluetoothState.PENDING': 'Bluetooth Request Pending ...',
    'connect.bluetoothImageAlt': 'Bluetooth Serial Adapter',
    'connect.oldBlackSerialDescriptionHtml': html`
        <p>
            Unsupported controllers because they require the older serial
            adapter that's coated in black tape - they could be added in the
            future. This cable should support CAN.
        </p>
        <ul>
            <li>
                EM50 (EM50S), EM100, EM100-4P, EM150 (EM150SP), EM200 (EM200SP).
            </li>
        </ul>
    `,
    'connect.oldBlackSerialImageAlt': 'USB to Serial Adapter (Black)',
    'connect.oldBlueSerialDescriptionHtml': html`
        <p>
            Unsupported controllers that use the blue USB to serial adapter,
            which does not support CAN bus. These could also be added in the
            future.
        </p>
        <ul>
            <li>
                EM25P, EM30SP, EM50SP LIN, EM50-4 (without CAN), EM50-6,
                EM80GTSP (without CAN), SV120 (without CAN).
            </li>
        </ul>
    `,
    'connect.oldBlueSerialImageAlt': 'USB to Serial Adapter (Blue)',
    'connect.selectConnection':
        'Select the type of connection you want to use:',
    'connect.serialConnect': 'Connect to Serial Port (CAN)',
    'connect.serialDescriptionHtml': html`
        <ul>
            <li>
                Requires the USB to CAN adapter. It is blue with a band of black
                electrical tape.
            </li>
            <li>Confirmed with EM200-2SP.</li>
            <li>
                Should work with EM50-4, EM80GTSP (with CAN), EM100SP,
                EM150-2SP, EM260SP, SV120 (with CAN).
            </li>
        </ul>
    `,
    'connect.serialImageAlt': 'USB to CAN Adapter',
    'connect.serialState.CONNECTED': 'Serial Connected',
    'connect.serialState.OPEN': 'Serial Open ...',
    'connect.serialState.PENDING': 'Serial Request Pending ...',
    'connect.title': 'Connection',

    // Color scheme
    'colorScheme.auto': 'System Colors',
    'colorScheme.dark': 'Dark Mode',
    'colorScheme.light': 'Light Mode',

    // Install
    'installPwa.action': 'Install',
    'installPwa.message': 'Install to Home Screen',

    // Menu - Navigation between pages
    'menu.about': 'About',
    'menu.connect': 'Connection',
    'menu.settings': 'Settings',

    // Shared components
    'shared.permissionDenied.heading': 'Denied or Unavailable',
    'shared.permissionDenied.message':
        'Because the necessary permission was denied or the hardware is unavailable, the button in the menu will be removed.',
    'shared.permissionError.heading': 'Error',
    'shared.permissionError.message':
        'There was an error obtaining the necessary permission or information. Perhaps the device is already in use. This may be temporary.',
    'shared.permissionPrompt.goBack': 'Not Right Now',
    'shared.permissionPrompt.grantPermission': 'Grant Permission',
    'shared.permissionPrompt.heading': 'Permission Required',
    'shared.prettyInput.close': 'Close Help',

    // Settings
    'settings.colorScheme': 'Toggle between light and dark mode. The system\'s color scheme is detected and used as the default, but can be overridden here.',
    'settings.title': 'Settings',

    // Services
    'service.wakeLock.released': 'Letting Screen Turn Off',
    'service.wakeLock.obtained': 'Keeping Screen On',

    // Update
    'updatePwa.message': 'Update Available!',
    'updatePwa.reload': 'Reload Now',
    'updatePwa.skip': 'Next Launch',

    // Welcome page
    'welcome.acceptTerms': 'I Agree To These Terms',
    'welcome.browserSupported': 'Revvia supports this browser.',
    'welcome.browserUnsupported': 'Revvia is not supported on this browser.',
    'welcome.overviewHtml': html`
        <p>
            This is a web-based Votol controller programmer. It's not sponsored
            nor endorsed by Votol. It's able to program Votol ES200-2SP and
            other CAN bus controllers.
        </p>

        <p>
            To use this, you must have Web Serial API or Web Bluetooth API
            support in your browser. Chrome, Edge, and Chromium-based browsers
            are required. You will also need an adapter cable or a Bluetooth
            adapter for communication to the controller.
        </p>
    `,
    'welcome.pleaseHelpHtml': html`
        <p>
            Please send your bug reports, feature suggestions, and improvements
            to the
            <a href="https://github.com/fidian/revvia/">GitHub page</a> or by
            contacting
            <a href="mailto:fidian@rumkin.com">the author directly</a>.
        </p>
    `,
    'welcome.supportsBluetooth': 'Browser has Bluetooth support.',
    'welcome.supportsSerial': 'Browser has serial support.',
    'welcome.termsOfUseHtml': html`
        <p>
            By using this software, the individual or entity ("the user") agrees
            to the following terms:
        </p>
        <ul>
            <li>
                <b>GOODNESS:</b> The user agrees to perform any unprompted act
                of kindness for someone else, without expecting anything in
                return, within one week.
            </li>
            <li>
                <b>RISK:</b> This software is provided "as is", without
                warranties of any kind. The author and contributors are not
                liable for any damages or losses. Use of the software is at the
                user's own risk.
            </li>
            <li>
                <b>LEGALITY:</b> This software must only be used for lawful and
                ethical purposes. It may not be used in any jurisdiction where
                such use is unlawful or imposes obligations on the author or
                contributors.
            </li>
            <li>
                <b>SCOPE:</b> If used on behalf of an organization, company, or
                other legal entity, the user affirms that they have the
                authority to bind that entity to these terms, which shall then
                apply to both the individual user and the entity.
            </li>
        </ul>
    `,
    'welcome.title': 'Revvia',
};

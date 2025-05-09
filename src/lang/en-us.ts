import { html } from 'fudgel';
import type { LanguageData } from '../i18n/languages';

export const enUS: LanguageData = {
    // Application-related and global strings
    'app.title': 'Revvia',

    // Color scheme
    'colorScheme.auto': 'System Colors',
    'colorScheme.dark': 'Dark Mode',
    'colorScheme.light': 'Light Mode',

    // Install
    'installPwa.action': 'Install',
    'installPwa.message': 'Install to Home Screen',

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

    // Services
    'service.wakeLock.released': 'Letting Screen Turn Off',
    'service.wakeLock.obtained': 'Keeping Screen On',

    // Update
    'updatePwa.message': 'Update Available!',
    'updatePwa.reload': 'Reload Now',
    'updatePwa.skip': 'Next Launch',

    // Welcome page
    'welcome.acceptTerms': 'I Agree To These Terms',
    'welcome.browserSupported':
        'Revvia appears to be supported on this browser.',
    'welcome.browserUnsupported': 'Revvia is not supported on this browser.',
    'welcome.overviewHtml': html`
        <p>
            This is a web-based Votol controller programmer. It's not sponsored
            nor endorsed by Votol. It's able to program Votol ES200-2SP and
            other CAN bus controllers.
        </p>

        <p>
            To use this, you must have Web Serial API support in your browser.
            Chrome, Edge, and Chromium-based browsers are required.
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

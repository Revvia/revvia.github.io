import { component, css, html } from 'fudgel';

component(
    'app-about',
    {
        style: css`
            :host {
                box-sizing: border-box;
                display: block;
                padding: 0.5em;
                width: 100%;
            }
        `,
        template: html`
            <page-title id="about.title"></page-title>
            <i18n-html id="about.html"></i18n-html>
            <i18n-label id="about.buildInformation"></i18n-label>
            <ul>
                <li>{{buildDate}}</li>
                <li>
                    <a
                        href="https://github.com/fidian/revvia/commit/{{version}}"
                        target="_blank"
                        >{{shortVersion}}</a
                    >
                </li>
                <li>Node.js {{nodeVersion}} ({{hostPlatform}} {{hostArch}})</li>
            </ul>
        `,
    },
    class {
        buildDate = __BUILD_DATE__;
        hostPlatform = __HOST_PLATFORM__;
        hostArch = __HOST_ARCH__;
        nodeVersion = __NODE_VERSION__;
        shortVersion = __REVVIA_VERSION__.substr(0, 7);
        version = __REVVIA_VERSION__;
        website = __WEBSITE__;
    }
);

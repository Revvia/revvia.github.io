import { bootstrap } from '../src/index';

// Handle 404 redirections for hosting a single page app on GitHub.
// https://www.smashingmagazine.com/2016/08/sghpa-single-page-app-hack-github-pages/
const redirectKey = 'redirect';
const redirect = sessionStorage.getItem(redirectKey);
sessionStorage.removeItem(redirectKey);

if (redirect && redirect !== location.href) {
    history.pushState(null, null, redirect);
}

const startApp = () => {
    bootstrap();
    document.body.append(document.createElement('app-root'));
};

// Enable Eruda (a developer console) when "eruda" is in the URL or flagged via
// localStorage.
const src = '//cdn.jsdelivr.net/npm/eruda';
const eruda = 'eruda';

if (window.location.toString().indexOf(eruda) >= 0 || localStorage.getItem(eruda)) {
    try {
        sessionStorage.setItem(eruda, '1');
    } catch (_ignore) {
        sessionStorage.clear();
    }

    const script = document.createElement('script');
    script.src = '//cdn.jsdelivr.net/npm/eruda';
    script.onload = () => {
        (window as any).eruda.init();
        startApp();
    };
    document.body.append(script);
} else {
    startApp();
}

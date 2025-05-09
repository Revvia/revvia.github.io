import { component } from 'fudgel';

component('app-redirect', {
    template: ''
}, class {
    constructor() {
        // Need to delay - can't route during routing.
        setTimeout(() => {
            history.pushState({}, document.title, '/connect');
        });
    }
});

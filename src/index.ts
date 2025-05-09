export * from './app-root.component';
export * from './app-connect.component';
export * from './app-redirect.component';
export * from './app-welcome.component';
export * from './check-or-x.component';
export * from './color-scheme.component';
export * from './i18n/i18n.module';
export * from './pwa/pwa.module';
export * from './shared/shared.module';

export { bootstrap } from './bootstrap';
import { defineRouterComponent } from 'fudgel';

defineRouterComponent('app-router');

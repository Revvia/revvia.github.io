export * from './app-about.component';
export * from './app-connect.component';
export * from './app-redirect.component';
export * from './app-root.component';
export * from './app-settings.component';
export * from './app-welcome.component';
export * from './check-or-x.component';
export * from './color-scheme.component';
export * from './flyout-menu.component';
export * from './i18n/i18n.module';
export * from './menu-item.component';
export * from './menu-items.component';
export * from './pwa/pwa.module';
export * from './shared/shared.module';

export { bootstrap } from './bootstrap';
import { defineRouterComponent } from 'fudgel';

defineRouterComponent('app-router');

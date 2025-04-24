import 'react-i18next';
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: typeof import('../public/locales/vi/common.json');
  }
}
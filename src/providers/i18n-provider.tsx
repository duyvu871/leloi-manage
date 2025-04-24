'use client';

import { I18nextProvider } from 'react-i18next';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { useEffect, useState } from 'react';

const i18n = createInstance();

export default function I18nProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const [instance, setInstance] = useState(i18n);

  useEffect(() => {
    instance
      .use(initReactI18next)
      .use(
        resourcesToBackend(
          (language: string) => import(`../../public/locales/${language}/common.json`)
        )
      )
      .init({
        lng: locale,
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false,
        },
      });
    setInstance(instance);
  }, [locale, instance]);

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
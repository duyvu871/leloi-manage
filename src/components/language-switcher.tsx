'use client';

import { useTransition } from 'react';
import { Select, Group, Text } from '@mantine/core';
import { Locale } from 'next-intl';
import { usePathname, useRouter } from 'src/i18n/navigation';
import { useParams } from 'next/navigation';
import { IconLanguage } from '@tabler/icons-react';

const languageNames = {
  en: 'English',
  vi: 'Tiếng Việt',
  ja: '日本語',
};

const languageFlags = {
  en: '🇬🇧',
  vi: '🇻🇳',
  ja: '🇯🇵',
};

type Props = {
  defaultValue?: string;
  w?: number | string;
};

export default function LanguageSwitcher({ defaultValue, w = 120 }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  
  // Get current locale from params or use defaultValue
  const currentLocale = (params?.lang as string) || defaultValue || 'vi';
  
  // Available locales
  const locales = ['en', 'vi', 'ja'];

  const handleLanguageChange = (newLocale: string | null) => {
    if (!newLocale) return;
    
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: newLocale as Locale }
      );
    });
  };

  return (
    <Select
      value={currentLocale}
      onChange={handleLanguageChange}
      data={locales.map((locale) => ({
        value: locale,
        label: languageNames[locale as keyof typeof languageNames] || locale,
      }))}
      leftSection={<IconLanguage size={16} />}
      disabled={isPending}
      w={w}
      size="sm"
      styles={(theme) => ({
        input: {
          fontWeight: 500,
        },
      })}
      comboboxProps={{
        transitionProps: { transition: 'pop', duration: 200 },
      }}
      renderOption={({ option }) => (
        <Group gap="xs">
          <Text>{languageFlags[option.value as keyof typeof languageFlags]}</Text>
          <Text>{option.label}</Text>
        </Group>
      )}
    />
  );
}
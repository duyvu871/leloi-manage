export const SUPPORTED_LOCALES = ["en", "vi", "ja"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export function getLocale(): Locale {
    const locale = localStorage.getItem("locale") as Locale;
    if (SUPPORTED_LOCALES.includes(locale)) {
        return locale;
    }
    return "en";
}

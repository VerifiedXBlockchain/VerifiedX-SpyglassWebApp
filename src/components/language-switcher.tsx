import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import styles from "./language-switcher.module.scss";

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const LOCALE_LABELS: Record<string, string> = {
  en: "EN",
  es: "ES",
};

export const LanguageSwitcher = ({ className }: { className?: string }) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { locales, locale: active, asPath } = router;

  if (!locales || locales.length < 2) return null;

  const handleSelect = (next: string) => {
    if (next === active) return;
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=${LOCALE_COOKIE_MAX_AGE};samesite=lax`;
    router.push(asPath, asPath, { locale: next });
  };

  return (
    <div className={[styles.group, className].filter(Boolean).join(" ")} role="group" aria-label={t("nav.switcherAria") as string}>
      {locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => handleSelect(loc)}
          className={[styles.option, loc === active ? styles.optionActive : ""].filter(Boolean).join(" ")}
          aria-current={loc === active ? "true" : undefined}
        >
          {LOCALE_LABELS[loc] ?? loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

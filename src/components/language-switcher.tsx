import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const LOCALE_LABELS: Record<string, string> = {
  en: "EN",
  es: "ES",
};

export const LanguageSwitcher = () => {
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
    <div className="nav-link p-0 d-flex align-items-center" role="group" aria-label={t("nav.switcherAria") as string}>
      {locales.map((loc, i) => (
        <span key={loc} className="d-flex align-items-center">
          {i > 0 && <span className="text-muted px-1">/</span>}
          <button
            type="button"
            onClick={() => handleSelect(loc)}
            className={`btn btn-sm btn-link px-1 py-0 ${loc === active ? "text-white fw-bold" : "text-muted"}`}
            style={{ textDecoration: "none", fontSize: 14 }}
            aria-current={loc === active ? "true" : undefined}
          >
            {LOCALE_LABELS[loc] ?? loc.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
};

import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = i18n.language?.startsWith("ar") ? "ar" : "en";

  return (
    <div
      className="lang-switcher-group"
      aria-label={t("nav_language")}
      title={t("nav_language")}
    >
      <button
        type="button"
        onClick={() => i18n.changeLanguage("en")}
        className={current === "en" ? "lang-active" : ""}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => i18n.changeLanguage("ar")}
        className={current === "ar" ? "lang-active" : ""}
      >
        ع
      </button>
    </div>
  );
}

export default LanguageSwitcher;

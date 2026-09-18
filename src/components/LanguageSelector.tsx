import { languageLabels, SUPPORTED_LANGUAGES, type Language, useI18n } from '../contexts/I18nContext';

export function LanguageSelector() {
  const { language, setLanguage } = useI18n();

  return (
    <label className="flex items-center gap-2 text-sm font-medium">
      <span>🌐</span>
      <select
        aria-label="Language selector"
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
        className="min-h-11 rounded-lg border border-slate-300 bg-white px-3"
      >
        {SUPPORTED_LANGUAGES.map((code) => (
          <option key={code} value={code}>
            {languageLabels[code]}
          </option>
        ))}
      </select>
    </label>
  );
}

import { defaultLocale, translations, type Locale } from '../i18n';

type Theme = 'light' | 'dark';

const storageKey = 'david-talavera-theme';
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function isTheme(value: string | null): value is Theme {
  return value === 'dark' || value === 'light';
}

function readSavedTheme(): Theme | null {
  try {
    const saved = window.localStorage.getItem(storageKey);
    return isTheme(saved) ? saved : null;
  } catch {
    return null;
  }
}

function currentLocale(): Locale {
  const lang = document.documentElement.lang;
  return lang === 'en' || lang === 'es' ? lang : defaultLocale;
}

function resolveTheme(): Theme {
  const saved = readSavedTheme();
  if (saved) return saved;
  return darkQuery.matches ? 'dark' : 'light';
}

function activeTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function applyTheme(theme: Theme, persist = false): void {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.classList.toggle('light', theme === 'light');
  root.style.colorScheme = theme;

  const meta = document.querySelector<HTMLMetaElement>('[data-theme-color]');
  if (meta) meta.content = theme === 'dark' ? '#0b0b0d' : '#ffffff';

  if (persist) {
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch {
      /* Storage can be unavailable; the choice still holds for this visit. */
    }
  }

  updateControls(theme);
}

function updateControls(theme: Theme): void {
  const dictionary = translations[currentLocale()];
  const action =
    theme === 'dark'
      ? (dictionary['theme.switchToLight'] ?? 'Switch to light mode')
      : (dictionary['theme.switchToDark'] ?? 'Switch to dark mode');

  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
    button.setAttribute('aria-checked', String(theme === 'dark'));
    button.setAttribute('title', action);
  });
}

function initializeTheme(): void {
  applyTheme(resolveTheme());

  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const next: Theme = activeTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next, true);
    });
  });

  // Keep the icon and label honest when the OS changes and no choice is stored.
  darkQuery.addEventListener('change', () => {
    if (!readSavedTheme()) applyTheme(resolveTheme());
  });

  document.addEventListener('localechange', () => {
    updateControls(activeTheme());
  });
}

initializeTheme();

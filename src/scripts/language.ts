import { defaultLocale, translations, type Locale } from '../i18n';

const storageKey = 'david-talavera-language';
const originalText = new WeakMap<HTMLElement, string>();
const originalHtml = new WeakMap<HTMLElement, string>();
const originalAriaLabel = new WeakMap<HTMLElement, string>();
let originalTitle = '';

function format(value: string, element: HTMLElement) {
  const params = JSON.parse(
    element.dataset.i18nParams ?? document.documentElement.dataset.i18nParams ?? '{}',
  ) as Record<string, string>;
  return value.replace(/\{(\w+)\}/g, (_, key) => params[key] ?? '');
}

function isLocale(value: string | null): value is Locale {
  return value === 'en' || value === 'es';
}

function applyLocale(locale: Locale) {
  const dictionary = translations[locale];
  document.documentElement.lang = locale;
  document.documentElement.dataset.locale = locale;

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((element) => {
    const fallback = originalText.get(element) ?? element.textContent ?? '';
    originalText.set(element, fallback);
    const value = dictionary[element.dataset.i18n ?? ''] ?? fallback;
    element.textContent = format(value, element);
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach((element) => {
    const fallback = originalHtml.get(element) ?? element.innerHTML;
    originalHtml.set(element, fallback);
    const value = dictionary[element.dataset.i18nHtml ?? ''] ?? fallback;
    element.innerHTML = format(value, element);
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-aria-label]').forEach((element) => {
    const fallback = originalAriaLabel.get(element) ?? element.getAttribute('aria-label') ?? '';
    originalAriaLabel.set(element, fallback);
    const value = dictionary[element.dataset.i18nAriaLabel ?? ''] ?? fallback;
    element.setAttribute('aria-label', format(value, element));
  });

  document.querySelectorAll<HTMLImageElement>('[data-i18n-alt]').forEach((image) => {
    const fallback = image.getAttribute('data-i18n-alt-default') ?? image.alt;
    image.setAttribute('data-i18n-alt-default', fallback);
    image.alt = format(dictionary[image.dataset.i18nAlt ?? ''] ?? fallback, image);
  });

  document.querySelectorAll<HTMLMetaElement>('[data-i18n-content]').forEach((meta) => {
    const fallback = meta.getAttribute('data-i18n-content-default') ?? meta.content;
    meta.setAttribute('data-i18n-content-default', fallback);
    meta.content = format(dictionary[meta.dataset.i18nContent ?? ''] ?? fallback, meta);
  });

  const titleKey = document.documentElement.dataset.i18nTitle;
  originalTitle ||= document.title;
  if (titleKey) {
    document.title = format(dictionary[titleKey] ?? originalTitle, document.documentElement);
  }

  document.querySelectorAll<HTMLElement>('[data-locale-option]').forEach((button) => {
    const active = button.dataset.localeOption === locale;
    button.setAttribute('aria-pressed', String(active));
    button.classList.toggle('is-active', active);
  });

  document.documentElement.classList.remove('i18n-loading');
  document.dispatchEvent(new CustomEvent('localechange', { detail: { locale } }));
}

function setLocale(locale: Locale) {
  try {
    window.localStorage.setItem(storageKey, locale);
  } catch {
    /* Storage can be unavailable; the page still switches for this visit. */
  }
  applyLocale(locale);
}

function initializeLanguage() {
  let saved: string | null = null;
  try {
    saved = window.localStorage.getItem(storageKey);
  } catch {
    /* Storage can be unavailable; fall back to the default locale. */
  }
  const locale = isLocale(saved) ? saved : defaultLocale;
  applyLocale(locale);

  document.querySelectorAll<HTMLElement>('[data-locale-option]').forEach((button) => {
    button.addEventListener('click', () => {
      const next = button.dataset.localeOption;
      if (isLocale(next)) setLocale(next);
    });
  });
}

initializeLanguage();

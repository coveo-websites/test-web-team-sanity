// Keep in sync with studio/languages.ts.
export const LANGUAGES = [
  {id: 'en', title: 'English'},
  {id: 'fr', title: 'Français'},
] as const

export type Language = (typeof LANGUAGES)[number]['id']

export const DEFAULT_LANGUAGE: Language = 'en'

export const LANGUAGE_IDS: readonly string[] = LANGUAGES.map((language) => language.id)

export function hasLanguage(value: string): value is Language {
  return LANGUAGE_IDS.includes(value)
}

/** Prefix a site-relative path with a language, unless it already has one: "/about" → "/fr/about". */
export function localizePath(path: string, language: Language) {
  const firstSegment = path.split('/')[1] ?? ''
  if (hasLanguage(firstSegment)) return path
  return path === '/' ? `/${language}` : `/${language}${path}`
}

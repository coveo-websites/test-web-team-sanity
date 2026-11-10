// Single source of truth for the site's languages, shared by the plugin config,
// singletons, structure and validation. Keep in sync with web/src/i18n.ts.
export const LANGUAGES = [
  {id: 'en', title: 'English'},
  {id: 'fr', title: 'Français'},
  {id: 'de', title: 'German'}
] as const

export type LanguageId = (typeof LANGUAGES)[number]['id']

export const DEFAULT_LANGUAGE: LanguageId = 'en'

import Link from 'next/link'
import {stegaClean} from 'next-sanity'

import {LANGUAGES, type Language} from '@/i18n'

type Translation = {language: string | null; slug: string | null; isHome: boolean | null}

type Props = {
  current: Language
  translations: Translation[] | null
}

// Links to this page's other language versions. Languages without a translation
// fall back to that language's home page, so readers never land on a 404.
export function LanguageSwitcher({current, translations}: Props) {
  return (
    <nav aria-label="Language" className="mx-auto w-full max-w-5xl px-6 pt-4">
      <ul className="flex justify-end gap-3 text-sm">
        {LANGUAGES.map((language) => {
          const translation = translations?.find((t) => stegaClean(t.language) === language.id)
          const href =
            translation?.slug && !translation.isHome
              ? `/${language.id}/${stegaClean(translation.slug)}`
              : `/${language.id}`

          return (
            <li key={language.id}>
              {language.id === current ? (
                <span aria-current="true" className="font-semibold">
                  {language.title}
                </span>
              ) : (
                <Link href={href} hrefLang={language.id} lang={language.id} className="underline">
                  {language.title}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

import type {Metadata} from 'next'
import {Geist, Geist_Mono} from 'next/font/google'
import {draftMode} from 'next/headers'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {VisualEditing} from 'next-sanity/visual-editing'

import {DisableDraftMode} from '@/components/DisableDraftMode'
import {SanityLink} from '@/components/SanityLink'
import {hasLanguage, LANGUAGES, type Language} from '@/i18n'
import {cachedSanity, SanityLive} from '@/sanity/live'
import {SETTINGS_QUERY} from '@/sanity/queries'

import '../globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export async function generateStaticParams() {
  return LANGUAGES.map((language) => ({lang: language.id}))
}

async function getSettings(language: Language) {
  const {data} = await cachedSanity({
    query: SETTINGS_QUERY,
    params: {language},
    perspective: 'published',
    stega: false,
  })
  return data
}

export async function generateMetadata(props: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const {lang} = await props.params
  if (!hasLanguage(lang)) return {}

  const settings = await getSettings(lang)
  const title = settings?.title ?? 'test-web-team'

  return {
    title: {template: `%s | ${title}`, default: title},
    description: settings?.description ?? undefined,
  }
}

export default async function RootLayout(props: LayoutProps<'/[lang]'>) {
  const {lang} = await props.params
  if (!hasLanguage(lang)) notFound()

  const settings = await getSettings(lang)
  const {isEnabled: isDraftMode} = await draftMode()

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="border-b border-line">
          <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-6 px-6 py-4">
            <Link href={`/${lang}`} className="font-semibold">
              {settings?.title ?? 'test-web-team'}
            </Link>
            {settings?.navigation && settings.navigation.length > 0 && (
              <ul className="flex flex-wrap gap-5 text-sm">
                {settings.navigation.map((link) => (
                  <li key={link._key}>
                    <SanityLink label={link.label} href={link.href} />
                  </li>
                ))}
              </ul>
            )}
          </nav>
        </header>
        <main className="flex flex-1 flex-col">{props.children}</main>
        <SanityLive includeDrafts={isDraftMode} />
        {isDraftMode && (
          <>
            <VisualEditing />
            <DisableDraftMode />
          </>
        )}
      </body>
    </html>
  )
}

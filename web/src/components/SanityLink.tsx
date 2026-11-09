import Link from 'next/link'
import {lang} from 'next/root-params'
import {stegaClean} from 'next-sanity'

import {hasLanguage, localizePath} from '@/i18n'

type Props = {
  label: string | null
  href: string | null
  className?: string
}

export async function SanityLink({label, href: rawHref, className}: Props) {
  // Links must not carry Draft Mode's invisible click-to-edit markers.
  const href = stegaClean(rawHref)
  if (!label || !href) return null

  // Internal paths use client-side navigation and stay in the current language:
  // editors write "/about" and readers of /fr get "/fr/about".
  if (href.startsWith('/')) {
    const language = await lang()
    const localized = hasLanguage(language) ? localizePath(href, language) : href
    return (
      <Link href={localized} className={className}>
        {label}
      </Link>
    )
  }

  return (
    <a href={href} className={className}>
      {label}
    </a>
  )
}

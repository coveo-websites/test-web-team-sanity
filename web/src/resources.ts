import type {Language} from '@/i18n'

// The resource templates in the Studio. `path` is the URL segment: /en/resources/ebooks/<slug>.
export const RESOURCE_KINDS = [
  {type: 'ebook', path: 'ebooks', title: 'Ebooks', label: 'Ebook'},
  {type: 'caseStudy', path: 'case-studies', title: 'Case studies', label: 'Case study'},
  {type: 'report', path: 'reports', title: 'Reports', label: 'Report'},
  {type: 'webinar', path: 'webinars', title: 'Webinars', label: 'Webinar'},
] as const

export type ResourceKind = (typeof RESOURCE_KINDS)[number]

export const RESOURCE_TYPES: string[] = RESOURCE_KINDS.map((kind) => kind.type)

export function kindByPath(path: string): ResourceKind | undefined {
  return RESOURCE_KINDS.find((kind) => kind.path === path)
}

export function kindByType(type: string): ResourceKind | undefined {
  return RESOURCE_KINDS.find((kind) => kind.type === type)
}

export function resourcePath(language: Language | string, kind: ResourceKind, slug?: string) {
  const base = `/${language}/resources/${kind.path}`
  return slug ? `${base}/${slug}` : base
}

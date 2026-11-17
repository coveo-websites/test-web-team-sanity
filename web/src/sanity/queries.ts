import {defineQuery} from 'next-sanity'

const LINK_FIELDS = /* groq */ `_key, label, href`

// Page-builder blocks, shared by pages and resources so one PageBuilder renders both
const CONTENT_PROJECTION = /* groq */ `
  content[]{
    _key,
    _type,
    _type == "hero" => { title, text, image, links[]{ ${LINK_FIELDS} } },
    _type == "features" => { title, intro, items[]{ _key, title, text } },
    _type == "splitImage" => { orientation, title, body, image },
    _type == "callToAction" => { title, text, links[]{ ${LINK_FIELDS} } },
    _type == "richText" => { title, body },
    _type == "cardGrid" => { title, intro, cards[]{ _key, title, text, image, link{ label, href } } },
    _type == "video" => { title, url, caption },
    _type == "faq" => { title, items[]{ _key, question, answer } },
    _type == "stats" => { title, items[]{ _key, value, label } },
    _type == "logoCloud" => { title, logos[]{ _key, name, href, image } },
    _type == "testimonials" => { title, items[]{ _key, quote, name, role, company, photo } },
    _type == "form" => {
      title,
      intro,
      fields[]{ _key, label, name, type, choices, required, placeholder },
      submitLabel,
      successMessage,
      hubspotPortalId,
      hubspotFormId
    }
  }
`

const FORM_FIELDS = /* groq */ `
  title,
  intro,
  fields[]{ _key, label, name, type, choices, required, placeholder },
  submitLabel,
  successMessage,
  hubspotPortalId,
  hubspotFormId
`

const PAGE_FIELDS = /* groq */ `
  _id,
  title,
  language,
  "slug": slug.current,
  seo,
  ${CONTENT_PROJECTION},
  // Every language version of this page, linked by @sanity/document-internationalization
  "translations": *[_type == "translation.metadata" && references(^._id)][0].translations[]{
    language,
    "slug": value->slug.current,
    "isHome": value._ref in *[_type == "settings"].homePage._ref
  }
`

// Site settings are one document per language: settings-en, settings-fr, …
export const SETTINGS_QUERY = defineQuery(`
  *[_id == "settings-" + $language][0]{
    title,
    description,
    navigation[]{ ${LINK_FIELDS} }
  }
`)

export const HOME_PAGE_QUERY = defineQuery(`
  *[_id == "settings-" + $language][0].homePage->{ ${PAGE_FIELDS} }
`)

export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && language == $language && slug.current == $slug][0]{ ${PAGE_FIELDS} }
`)

export const PAGE_SLUGS_QUERY = defineQuery(`
  *[_type == "page" && language == $language && defined(slug.current)]{ "slug": slug.current }
`)

const RESOURCE_CARD_FIELDS = /* groq */ `
  _id,
  _type,
  title,
  "slug": slug.current,
  summary,
  coverImage,
  publishDate,
  topics
`

// Ebooks, case studies, reports and webinars; the type-specific fields depend on _type.
// The file URL is only sent for ungated resources so the gate can't be bypassed from the page data.
const RESOURCE_FIELDS = /* groq */ `
  ${RESOURCE_CARD_FIELDS},
  language,
  seo,
  "gate": gate{ _type, "_key": "gate", ${FORM_FIELDS} },
  "downloadUrl": select(defined(gate.fields) => null, file.asset->url),
  _type == "ebook" => { authors, pageCount, tableOfContents },
  _type == "report" => { edition, pageCount, keyFindings },
  _type == "caseStudy" => {
    customer,
    customerLogo,
    industry,
    challenge,
    solution,
    results,
    metrics[]{ _key, value, label },
    quote{ text, person, role }
  },
  _type == "webinar" => {
    status,
    startsAt,
    durationMinutes,
    registrationUrl,
    recordingUrl,
    speakers[]{ _key, name, role, company, photo }
  },
  ${CONTENT_PROJECTION},
  "translations": *[_type == "translation.metadata" && references(^._id)][0].translations[]{
    language,
    "slug": value->slug.current,
    "isHome": false
  }
`

export const RESOURCE_QUERY = defineQuery(`
  *[_type == $type && language == $language && slug.current == $slug][0]{ ${RESOURCE_FIELDS} }
`)

export const RESOURCE_SLUGS_QUERY = defineQuery(`
  *[_type in $types && language == $language && defined(slug.current)]{
    _type,
    "slug": slug.current
  }
`)

export const RESOURCE_LIST_QUERY = defineQuery(`
  *[_type in $types && language == $language && defined(slug.current)]
    | order(publishDate desc, _createdAt desc){ ${RESOURCE_CARD_FIELDS} }
`)

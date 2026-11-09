import {defineQuery} from 'next-sanity'

const LINK_FIELDS = /* groq */ `_key, label, href`

const PAGE_FIELDS = /* groq */ `
  _id,
  title,
  language,
  "slug": slug.current,
  seo,
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
  },
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

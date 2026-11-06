import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'
import {DocumentsIcon} from '@sanity/icons/Documents'
import {TranslateIcon} from '@sanity/icons/Translate'

import {LANGUAGES} from './languages'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // One settings singleton per language
      S.listItem()
        .title('Site settings')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Site settings')
            .items(LANGUAGES.map((language) => S.listItem().singleton(`settings-${language.id}`))),
        ),
      S.divider(),
      // Pages grouped by language, like language versions in a Sitecore content tree
      S.listItem()
        .title('Pages')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Pages')
            .items([
              ...LANGUAGES.map((language) =>
                S.listItem()
                  .id(`pages-${language.id}`)
                  .title(`${language.title} (${language.id.toUpperCase()})`)
                  .icon(TranslateIcon)
                  .child(
                    S.documentTypeList('page')
                      .title(`Pages · ${language.title}`)
                      .filter('_type == "page" && language == $language')
                      .params({language: language.id})
                      .initialValueTemplates([S.initialValueTemplateItem(`page-${language.id}`)]),
                  ),
              ),
              S.divider(),
              S.documentTypeListItem('page').title('All pages'),
            ]),
        ),
    ])

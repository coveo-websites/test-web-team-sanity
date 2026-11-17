import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import {BarChartIcon} from '@sanity/icons/BarChart'
import {BookIcon} from '@sanity/icons/Book'
import {CaseIcon} from '@sanity/icons/Case'
import {CogIcon} from '@sanity/icons/Cog'
import {PlayIcon} from '@sanity/icons/Play'
import {DocumentsIcon} from '@sanity/icons/Documents'
import {FolderIcon} from '@sanity/icons/Folder'
import {TranslateIcon} from '@sanity/icons/Translate'

import {LANGUAGES} from './languages'

const RESOURCE_TEMPLATES = [
  {type: 'ebook', title: 'Ebooks', icon: BookIcon},
  {type: 'caseStudy', title: 'Case studies', icon: CaseIcon},
  {type: 'report', title: 'Reports', icon: BarChartIcon},
  {type: 'webinar', title: 'Webinars', icon: PlayIcon},
]

// One list per language for a localized document type, plus an "All" list
function languageLists(S: StructureBuilder, schemaType: string, title: string) {
  return [
    ...LANGUAGES.map((language) =>
      S.listItem()
        .id(`${title.toLowerCase()}-${language.id}`)
        .title(`${language.title} (${language.id.toUpperCase()})`)
        .icon(TranslateIcon)
        .child(
          S.documentTypeList(schemaType)
            .title(`${title} · ${language.title}`)
            .filter('_type == $schemaType && language == $language')
            .params({schemaType, language: language.id})
            .initialValueTemplates([S.initialValueTemplateItem(`${schemaType}-${language.id}`)]),
        ),
    ),
    S.divider(),
    S.documentTypeListItem(schemaType).title(`All ${title.toLowerCase()}`),
  ]
}

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
              ...languageLists(S, 'page', 'Pages'),
              S.divider(),
              S.listItem()
                .title('Resources')
                .icon(FolderIcon)
                .child(
                  S.list()
                    .title('Resources')
                    .items([
                      // One list per template, each split by language
                      ...RESOURCE_TEMPLATES.map(({type, title, icon}) =>
                        S.listItem()
                          .id(`resources-${type}`)
                          .title(title)
                          .icon(icon)
                          .child(S.list().title(title).items(languageLists(S, type, title))),
                      ),
                      S.divider(),
                      S.listItem()
                        .id('resources-other')
                        .title('Other resources')
                        .icon(FolderIcon)
                        .child(
                          S.list()
                            .title('Other resources')
                            .items(languageLists(S, 'resource', 'Other resources')),
                        ),
                    ]),
                ),
            ]),
        ),
    ])

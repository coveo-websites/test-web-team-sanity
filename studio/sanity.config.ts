import {defineConfig, defineSingleton} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {documentInternationalization} from '@sanity/document-internationalization'
import {CogIcon} from '@sanity/icons/Cog'
import {LANGUAGES} from './languages'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

const projectId = 't5oqz7o2'

// Types translated as one document per language
const LOCALIZED_TYPES = ['page']

// Shared by every workspace so production and staging always have the same schema and Studio.
const sharedConfig = {
  projectId,

  plugins: [
    structureTool({structure}),
    documentInternationalization({
      supportedLanguages: [...LANGUAGES],
      schemaTypes: LOCALIZED_TYPES,
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    singletons: LANGUAGES.map((language) =>
      defineSingleton({
        documentId: `settings-${language.id}`,
        schemaType: 'settings',
        title: `Site settings (${language.id.toUpperCase()})`,
        icon: CogIcon,
        initialValue: {language: language.id},
      }),
    ),
    // Hide the language-less "Page" template; the plugin adds "Page (English)", "Page (Français)", …
    newDocumentOptions: (prev: {templateId: string}[]) =>
      prev.filter((item) => !LOCALIZED_TYPES.includes(item.templateId)),
  },
}

export default defineConfig([
  {
    ...sharedConfig,
    name: 'production',
    title: 'test-web-team',
    subtitle: 'Production',
    dataset: 'production',
    basePath: '/production',
  },
  {
    ...sharedConfig,
    name: 'staging',
    title: 'test-web-team',
    subtitle: 'Staging',
    dataset: 'staging',
    basePath: '/staging',
  },
])

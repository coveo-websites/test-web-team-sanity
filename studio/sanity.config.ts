import {defineConfig, defineSingleton} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {documentInternationalization} from '@sanity/document-internationalization'
import {CogIcon} from '@sanity/icons/Cog'
import {presentationTool} from 'sanity/presentation'
import {DEFAULT_LANGUAGE, LANGUAGES} from './languages'
import {resolve} from './presentation/resolve'
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

// The Next.js site that the Presentation tool shows. It reads the production dataset,
// so the visual editor is only added to the production workspace.
const previewOrigin = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'

const visualEditor = presentationTool({
  title: 'Visual editor',
  resolve,
  previewUrl: {
    initial: `${previewOrigin}/${DEFAULT_LANGUAGE}`,
    previewMode: {enable: '/api/draft-mode/enable'},
  },
  allowOrigins: [previewOrigin],
})

export default defineConfig([
  {
    ...sharedConfig,
    plugins: [visualEditor, ...sharedConfig.plugins],
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

import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId, studioUrl} from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  // Click-to-edit markers (stega) are only added in Draft Mode, per fetch. studioUrl tells
  // them which Studio workspace to open when an editor clicks something in the preview.
  stega: {studioUrl},
})

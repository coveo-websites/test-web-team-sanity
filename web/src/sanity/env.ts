export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID',
)

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET',
)

// The Studio workspace that shows this dataset (studio/sanity.config.ts → basePath).
export const studioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333/production'

// Keep hard-coded; bump deliberately when you want newer API behavior.
export const apiVersion = '2026-11-06'

function assertValue<T>(value: T | undefined, errorMessage: string): T {
  if (value === undefined) throw new Error(errorMessage)
  return value
}

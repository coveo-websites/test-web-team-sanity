# test-web-team

Proof of concept for replacing Sitecore with **Sanity** as the CMS of our marketing site.
It is used to test the questions from the CMS comparison (Sanity vs Storyblok vs Agility):
can non-technical editors build a page on their own, how well does the Media Library track
unused assets, and how long does it take the team to set up the Studio.

The repo has two apps:

| Folder | What it is | Runs on |
|---|---|---|
| [`studio/`](studio) | Sanity Studio, where editors write content | http://localhost:3333 |
| [`web/`](web) | Next.js site that shows the content | http://localhost:3000 |

Both use the Sanity project `t5oqz7o2`.

## Getting started

Requirements: Node.js 22 and access to the Sanity project (ask a project admin to invite you).

1. Install dependencies in both apps:

   ```bash
   npm install --prefix studio
   ```

   ```bash
   npm install --prefix web
   ```

2. Create `web/.env.local` from [`web/.env.example`](web/.env.example):

   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=t5oqz7o2
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_READ_TOKEN=<your Viewer token>
   ```

   Create the token in [sanity.io/manage](https://www.sanity.io/manage) → project → **API → Tokens**,
   with **Viewer** rights. It is only needed for the visual editor; the site works without it.
   `.env.local` is ignored by git: never commit a token.

3. Start both apps, each in its own terminal:

   ```bash
   npm run dev --prefix studio
   ```

   ```bash
   npm run dev --prefix web
   ```

4. Open the Studio at http://localhost:3333, sign in, and pick a workspace.

## Studio

### Workspaces

| Workspace | Dataset | URL | Visual editor |
|---|---|---|---|
| Production | `production` | `/production` | Yes |
| Staging | `staging` | `/staging` | No (the site reads `production`) |

Both workspaces share the same schema and Studio setup ([`studio/sanity.config.ts`](studio/sanity.config.ts)).

### Content

- **Pages** (`page`): title, slug, SEO fields and a page builder. One document per language,
  linked as translations. Slugs only need to be unique within a language.
- **Site settings** (`settings-en`, `settings-fr`): site title, default description,
  navigation, and the page used as home page for that language.

Languages are English and French, defined in [`studio/languages.ts`](studio/languages.ts) and
[`web/src/i18n.ts`](web/src/i18n.ts) (keep both in sync). Pages are grouped by language in the
Studio, like language versions in a Sitecore content tree.

### Page builder blocks

Editors build pages from 12 blocks, grouped in the insert menu:

| Group | Block | Purpose |
|---|---|---|
| Intro | Hero | Title, text, image and up to 2 buttons. The first hero gets the page's `<h1>` |
| Content | Text | Formatted text with headings, lists, quotes and links |
| | Features | Title, intro and a list of features |
| | Split image | Image beside text, image left or right |
| | Cards | Up to 9 cards with image, text and link |
| | Video | YouTube or Vimeo link, embedded without tracking cookies |
| | FAQ | Questions that open to show their answer |
| Social proof | Key figures | 2 to 4 large numbers with a label |
| | Logo cloud | 2 to 12 customer logos |
| | Testimonials | Customer quotes with name, role, company and photo |
| Conversion | Call to action | Highlighted band with a title, text and buttons |
| | Form | Fields described in the CMS, answers sent to HubSpot |

Each block has a schema in [`studio/schemaTypes/blocks/`](studio/schemaTypes/blocks) and a
React component in [`web/src/components/blocks/`](web/src/components/blocks).
Every image requires alt text and supports a focal point (hotspot).

**Form:** fill in the HubSpot portal and form IDs (HubSpot tab of the block) to send answers
to HubSpot. Leave them empty to test the form without sending anything.

### Visual editor

The **Visual editor** tab (Sanity's Presentation tool) shows the site next to the edit form.
Editors click any text on the page to open its field, and see changes before publishing.

It needs `SANITY_API_READ_TOKEN` in `web/.env.local` and the site running on port 3000.
How it works:

- The Studio opens `/api/draft-mode/enable` on the site, which turns on Next.js Draft Mode.
- In Draft Mode, pages load drafts and live updates, and strings carry invisible
  click-to-edit markers (stega). Published pages stay static and never include them.
- Strings used for logic (links, video URLs, form field types, orientation) must go through
  `stegaClean()` before being compared or used. `BlockOf<'…'>` types enforce this.

Config: [`studio/presentation/resolve.ts`](studio/presentation/resolve.ts) (which URL shows which
document) and [`web/src/sanity/live.ts`](web/src/sanity/live.ts) (Draft Mode fetching).

## Site

- **Next.js 16** with the App Router, Cache Components and Tailwind CSS 4.
  This Next.js version has breaking changes: read [`web/AGENTS.md`](web/AGENTS.md) first.
- Routes: `/en`, `/fr` (home page from site settings) and `/{lang}/{slug}`.
  Visitors without a language prefix are redirected based on their browser language
  ([`web/src/proxy.ts`](web/src/proxy.ts)).
- Content updates appear without a rebuild, through Sanity Live.
- **Colors** come from coveo.com's design tokens and are defined once in
  [`web/src/app/globals.css`](web/src/app/globals.css): use the token classes (`bg-surface`,
  `text-muted`, `text-brand`, `border-line`, `btn-primary`, `btn-secondary`) rather than raw colors.
  The site is light mode only.
- The font is Geist; coveo.com's font (Canada Type Gibson) is licensed through Adobe Fonts.

## Common tasks

### Add a page builder block

1. Create the schema in `studio/schemaTypes/blocks/` and add it to
   [`schemaTypes/index.ts`](studio/schemaTypes/index.ts) and
   [`pageBuilderType.ts`](studio/schemaTypes/pageBuilderType.ts) (including an insert menu group).
2. Add its fields to `content[]` in [`web/src/sanity/queries.ts`](web/src/sanity/queries.ts).
3. Regenerate types: `npm run typegen --prefix studio`.
4. Create the component in `web/src/components/blocks/` and add it to
   [`PageBuilder.tsx`](web/src/components/PageBuilder.tsx).

### Regenerate TypeScript types

Run after any schema or query change. It writes [`web/sanity.types.ts`](web/sanity.types.ts):

```bash
npm run typegen --prefix studio
```

### Check and build

```bash
npm run build --prefix studio
```

```bash
npm run lint --prefix web
```

```bash
npm run build --prefix web
```

### Deploy the Studio

Set `SANITY_STUDIO_PREVIEW_URL` (see [`studio/.env.example`](studio/.env.example)) to the deployed
site URL first, so the visual editor points at it, then:

```bash
npm run deploy --prefix studio
```

When the site is deployed, also set `NEXT_PUBLIC_SANITY_STUDIO_URL` on it, and add its URL to the
project's CORS origins (with credentials) in sanity.io/manage.

## Known limits

- The staging workspace has no visual editor, because the site reads the `production` dataset.
- The header navigation shows published content only, even in the visual editor.
- Sending forms to HubSpot has not been tested yet.

## Tooling

- [`.mcp.json`](.mcp.json) connects AI assistants to the Sanity MCP server.
- `.claude/skills/sanity-best-practices` holds Sanity's best-practice guides for AI assistants
  (tracked in [`skills-lock.json`](skills-lock.json)).

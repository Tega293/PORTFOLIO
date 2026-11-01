# Project CMS setup

The admin is available at `/admin`. It uses protected Vercel Functions to read and publish `public/projects.json` and `public/skills.json` through GitHub. A publish creates one Git commit containing the project and skill catalogs and any uploaded cover images. If this repository is connected to Vercel with production deployments enabled for the target branch, that commit starts the live build.

## Required deployment settings

In the Vercel project settings, add these **server-side environment variables** to Production (and Preview too if you want to test publishing from previews):

| Variable | Value |
| --- | --- |
| `CMS_ADMIN_PASSWORD` | A unique, long password used only for `/admin`. |
| `CMS_SESSION_SECRET` | A separate random secret used to sign eight-hour admin sessions. |
| `CMS_GITHUB_TOKEN` | A GitHub fine-grained personal access token for this repository, with **Contents: Read and write**. Do not expose it to browser code. |
| `CMS_GITHUB_REPOSITORY` | `Tega293/PORTFOLIO` (the current default). |
| `CMS_GITHUB_BRANCH` | `master` (the current default production branch). |

Generate independent secrets locally with Node:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Run it once for `CMS_ADMIN_PASSWORD` and again for `CMS_SESSION_SECRET`, then set the values directly in Vercel. Never commit them, put them in `REACT_APP_*` variables, or paste them into the CMS editor. The GitHub token should be limited to this one repository; Contents access is the only permission the publisher needs.

After setting the variables, redeploy the Vercel project and visit `/admin`. The sign-in cookie is HTTP-only, secure in production, SameSite Strict, and expires after eight hours. The admin API rejects cross-origin writes and checks the catalog revision before publishing to avoid overwriting a newer edit.

For local end-to-end CMS work, run the project with `npx vercel dev` after adding the same variables to a local `.env.local` file. Keep `.env.local` untracked and never commit it. `npm start` alone serves the React interface but does not run the Vercel API routes.

## Publishing behavior

- The admin creates, edits, reorders, and removes project cards.
- The Skills tab creates, edits, reorders, and removes the capability cards shown in the public skills section.
- **Publish changes** commits the project catalog, skills catalog, and any uploaded image files to the configured branch. The portfolio reads the deployed `/projects.json` and `/skills.json` files, so cards and skills update with the next successful deployment.
- Deleting a project publishes the removal immediately. Use a Vercel Preview deployment and a non-production `CMS_GITHUB_BRANCH` to test risky changes first.
- Uploaded cover images may be JPG, PNG, WebP, or AVIF. Each image is limited to 3 MB, and new uploads are limited to 3 MB per publish. Existing images remain in the Git repository when no longer referenced so accidental deletion does not break another card.
- Case study content is Markdown. Headings, paragraphs, lists, block quotes, bold, italics, inline code, and HTTPS links are supported. Raw HTML is never rendered.

## GitHub and live deployment connection

The code in this repository can create the GitHub commit, but it cannot create Vercel environment variables or enable Vercel’s Git integration. Confirm the Vercel project is connected to `Tega293/PORTFOLIO`, that `master` is its Production Branch (or set `CMS_GITHUB_BRANCH` to the production branch), and that automatic production deployments are enabled. If those settings are absent, publishing still commits the content to GitHub, but the live site will not change until the deployment connection is enabled.

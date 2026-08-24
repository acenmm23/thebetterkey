# theBetterKey v2 website

A ground-up landing page for theBetterKey, built with React + Vite.

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```

The production output will be in `dist/`.

## What is already wired

- Responsive one-page product landing page
- Interactive lock / fob demo in the hero
- Existing Google Form waitlist preserved as a temporary fallback
- Instagram link to `@ahsonmade`
- No fake pricing, launch dates, or speculative product tiers
- GitHub Pages deploy workflow included

## Preview on GitHub Pages

1. Create a new repository under the account or organization you want to own BetterKey long-term.
2. Push these files to `main`.
3. In **Settings → Pages**, set the source to **GitHub Actions**.
4. The included workflow will build and publish a preview.
5. Do **not** move `thebetterkey.com` yet. Keep the existing site live until this preview is approved.

## Before launch

1. Replace the stylized CSS prototype art with real V2 photos/video when available.
2. Connect the email field to a true inline waitlist endpoint (Formspree, Loops, Supabase, etc.).
3. Add analytics (Plausible, PostHog, Google Analytics, etc.).
4. Confirm Instagram URL / desired public build account.
5. Only move `thebetterkey.com` after the preview is approved.

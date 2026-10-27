# docs

This is a Next.js application generated with
[Create Fumadocs](https://github.com/fuma-nama/fumadocs).

Run development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open http://localhost:3000 with your browser to see the result.

## Learn More

To learn more about Next.js and Fumadocs, take a look at the following
resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Fumadocs](https://fumadocs.vercel.app) - learn about Fumadocs

## Install every uniwind component from this fork

`public/r/uniwind` doubles as a shadcn registry root, so the stock CLI's `--all` flag installs the
32 `registry:ui` components and resolves their registry dependencies from the fork:

```bash
REGISTRY_URL=https://raw.githubusercontent.com/pattobrien/react-native-reusables/main/apps/docs/public/r/uniwind \
  pnpx shadcn@4.21.4 add --all --yes --overwrite
```

The consumer's `components.json` needs `"style": "new-york"` with `"tailwind": { "config": "" }`,
which shadcn maps to `styles/new-york-v4`, and `"baseColor": ""`, because a non-empty base color
makes shadcn fetch `colors/<baseColor>.json`, which this registry does not serve. Blocks stay out of
`index.json` but remain installable by name, for example `shadcn add sign-in-form`.

`pnpm registry:build:uniwind` regenerates `index.json` and `styles/new-york-v4/` through
`scripts/build-shadcn-root.mts`. To host the registry elsewhere, rerun the script with
`--base-url <registry root>`.

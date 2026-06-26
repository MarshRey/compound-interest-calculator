# Compound Interest Calculator

A free, fast, and SEO-friendly compound interest calculator built with [Astro](https://astro.build/), [Tailwind CSS](https://tailwindcss.com/), and deployed to [Vercel](https://vercel.com/).

## Features

- Compound interest calculator with principal, monthly contributions, rate, years, and compounding frequency.
- Year-by-year breakdown table.
- Inline SVG bar chart visualization.
- Copy results to clipboard.
- Multiple SEO landing pages for related keywords.
- Educational blog posts about investing and compound interest.
- AdSense and affiliate link monetization.
- Dark mode support.

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `PUBLIC_ADSENSE_CLIENT` | AdSense publisher ID, e.g. `ca-pub-XXXXXXXXXXXXXXXX` |
| `PUBLIC_GA4_ID` | Google Analytics 4 measurement ID, e.g. `G-XXXXXXXXXX` |

## Project Structure

```
├── public/
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── scripts/
│   └── styles/
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
└── vercel.json
```

## License

MIT

# JAGA — Protection for Malaysia's Gig Workers

Minimalist React Native (Expo) app prototype for the FIN62504 fintech project.
Built from the research in `../Problem_Statement_Outline.md` and
`../JAGA_Gig_Worker_Insurance_Products_Malaysia.xlsx`.

## Flow

1. **Intro** — JAGA logo + what the app is (3M+ gig workers, <1 in 10 protected)
2. **Create account** — Google link (mock) or manual: username, email, password, full name, phone, age, religion. Religion is asked respectfully and drives product filtering: Muslim users see only Shariah-compliant PRS funds; everyone else sees both series.
3. **Occupation** — pick from 8 gig/freelance occupations
3. **Tabs (bottom bar)**:
   - **Home** — dashboard: total monthly protection cost, insurance-areas-covered score (x/5, counting the five insurance categories), active plans acquired in-app, optional bank-account linking (auto-debit toggle), and suggestions for uncovered areas
   - **Insurance** — five sections: SOCSO · Personal Accident · Health & Hospital Income · Vehicle & E-Hailing · Work & Equipment (full catalogue from the team's Google Sheet, incl. PruBSN AnugerahMax, Zurich Auto Cover/Z-Rider, and Grab's Etiqa/Zurich daily covers as reference-only benchmarks)
   - **Retirement** — 8 options from the team's PRS sheet: i-Saraan, i-Saraan Plus (6.15% 2025 EPF dividend), 3 conventional AHAM PRS funds and 3 AHAM Aiiman Shariah PRS funds, each with real YTD/1Y/3Y returns (1Y default, from PPA's table as of 7 Jul 2026). Plus a retirement-calculator sub-menu and an **Emergency Fund** group with the AHAM Aiiman Money Market Fund — first tap runs a goal questionnaire (single = 3 months, married = 6, with children = 12 months of expenses).
   - **Loans** — micro-loans menu: TEKUN, BSN Micro, Direct Lending, Funding Societies, Boost Credit (indicative rates)
4. **Products** — real provider logo left, plan name, monthly price right; detail page with coverage bullets and a "Get covered" button that adds the plan to the dashboard

Products are filtered and re-ranked by occupation (e.g. Tokio Marine rider PA
only shows for riders/e-hailing; PolicyStreet freelancer plans get a "For you"
badge for creatives).

## Design

Chocolate Truffle palette (Figma) on the 60-30-10 rule: 60% cream `#FDFBD4`
base, 30% browns `#38240D`/`#713600` (text, summary card, tab bar accents),
10% orange `#C05800` (prices, CTAs, active tab).

Provider logos in `assets/logos/` were fetched from Wikipedia/official
favicons. `assets/logo.png` is an SVG recreation of the team's JAGA logo —
replace that file with the original export for pixel-perfect branding.

## Run

Node is installed at `~/.local/node` (not on the default PATH):

```sh
export PATH="$HOME/.local/node/bin:$PATH"
cd jaga-app
npm run web        # browser preview at http://localhost:8081
npm start          # QR code for Expo Go on a real phone
```

## Structure

- `src/data.ts` — occupations, sections, and the 12 integratable products from the research spreadsheet (Grab-exclusive and PTV products excluded by design)
- `src/theme.ts` — minimalist palette (white / ink / teal accent)
- `src/components.tsx` — LogoMark, ProductCard, Badge, buttons
- `src/screens.tsx` — Intro, Occupation, Home, Section, Product detail
- `App.tsx` — simple state-based navigation

Pricing is indicative (converted to RM/month where possible, `est.` where
estimated) — confirm with providers before quoting real users.

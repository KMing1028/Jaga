# JAGA — store screenshot brief (for manual Canva assembly)

All raw screenshots live in `store-assets/raw-screenshots/`. Each screen exists in both target sizes,
already RGB with no alpha channel:

- **iPhone canvas:** 1320 × 2868 px, portrait, PNG (Apple 6.9" requirement; Apple auto-scales for other iPhones)
- **Google Play canvas:** 1080 × 1920 px, portrait, PNG (9:16; Play allows 2–8 phone screenshots)

**Layout convention for every slide (don't deviate):** top third = headline + subhead on flat cream,
bottom two-thirds = the device screenshot (optionally inside a simple device frame). Headline in Extra
Bold, subhead Regular. Left-align text with ~80 px side margin on the iPhone canvas (~64 px on Play).

**Palette (from `src/theme.ts` — no new colors):**

| Role | Hex |
|---|---|
| Background cream | `#FDFBD4` |
| Headline / body ink | `#38240D` |
| Accent (highlight word or underline) | `#C05800` |
| Subhead muted brown | `#713600` |

---

## Slide 1 — Hero / stat
- **Screenshot:** `00-hero-stat_iphone-1320x2868.png` / `00-hero-stat_play-1080x1920.png`
- **Headline:** `Only 1 in 4 gig workers have injury cover.`
- **Subhead:** `JAGA exists to fix that.`
- **Highlight word (accent #C05800):** `1 in 4`
- **Tiny type, bottom of slide (10–11 pt, #713600):** `Source: SESSS participation data, ISEAS Perspective 2026/48`
- ⚠️ Re-verify this figure against the published ISEAS paper before the listing goes live (same flag as in the app's intro carousel code).

## Slide 2 — Dashboard
- **Screenshot:** `01-dashboard_iphone-1320x2868.png` / `01-dashboard_play-1080x1920.png`
- **Headline:** `Your safety net, in one app.`
- **Subhead:** `Plans, payments and progress — one dashboard.`
- **Highlight word:** `safety net`

## Slide 3 — Insurance
- **Screenshot:** `02-insurance_iphone-1320x2868.png` / `02-insurance_play-1080x1920.png`
- **Headline:** `Insurance that matches your gig.`
- **Subhead:** `Riders see rider cover. Freelancers don't.`
- **Highlight word:** `your gig`

## Slide 4 — Retirement
- **Screenshot:** `03-retirement_iphone-1320x2868.png` / `03-retirement_play-1080x1920.png`
- **Headline:** `Small amounts, real government top-ups.`
- **Subhead:** `PRS funds matched to your risk profile.`
- **Highlight word:** `government top-ups`

## Slide 5 — Emergency fund
- **Screenshot:** `05-emergency-fund_iphone-1320x2868.png` / `05-emergency-fund_play-1080x1920.png`
- **Headline:** `A cushion for the slow months.`
- **Subhead:** `Withdraw anytime. No lock-in. Shariah-compliant.`
- **Highlight word:** `slow months`

## Slide 6 — Micro-loans
- **Screenshot:** `06-loans_iphone-1320x2868.png` / `06-loans_play-1080x1920.png`
- **Headline:** `Fair credit, built for gig income.`
- **Subhead:** `Licensed lenders that accept gig earnings as proof.`
- **Highlight word:** `Fair credit`

## Optional slide 7 — Calculator (Play allows up to 8)
- **Screenshot:** `04-calculator_iphone-1320x2868.png` / `04-calculator_play-1080x1920.png`
- **Headline:** `See what RM100/mo becomes.`
- **Subhead:** `Set a goal, track it honestly.`
- **Highlight word:** `RM100/mo`

---

## Google Play feature graphic (required, banner at top of listing)

- **Canvas:** exactly **1024 × 500 px**, JPEG or 24-bit PNG, no alpha, no screenshot inside it.
- **Background:** flat cream `#FDFBD4`.
- **Content:** JAGA umbrella logo (`assets/logo.png`) at left, ~360 px tall, vertically centered.
  To its right: wordmark `JAGA` in Extra Bold `#38240D` (~120 pt), and beneath it the tagline
  `Protection for Malaysia's gig workers` in `#713600` (~36 pt).
- **Nothing else** — no screenshots, no feature bullets, no store badges (Google overlays its own UI).

---

*Dimensions verified against Apple App Store Connect and Google Play Console specs as of July 2026 —
re-check both if assembling later, the requirements change periodically.*

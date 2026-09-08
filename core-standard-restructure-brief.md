# The Core Standard — site restructure brief

**For:** Claude Code, run against the GitHub repo for thecorestandard.co.uk
**Date:** 8 September 2026
**Goal:** make the site legible to Google as one thing — the scenario-based EA assessment that employers commission when hiring — and stop the homepage suppressing the page that takes money.

Work through the tasks in order. Tasks 1 and 2 are the ones that matter; the rest are cleanup.

---

## Context you need before editing

- Static HTML site, ~27 pages, deployed via Vercel from this repo. Committing to the deploy branch publishes.
- Canonical host is `https://thecorestandard.co.uk` (no www). `www` 308-redirects to it. Do not introduce `www` URLs anywhere.
- The site has rich structured data (Organization, Service, Product, Offer, FAQPage, HowTo, BreadcrumbList, Article, Person), canonical tags and a clean sitemap. **Preserve all of it. Add schema, never strip it.**
- Certified level names are **Operational EA / EA to Senior Leadership / Executive Business Partner**. Never reintroduce "Professional / Trusted Partner / Executive Partner".
- The money page is `ea-hire.html`. Everything commercial funnels there.

---

## Task 1 — Stop the homepage cannibalising `ea-hire.html`

**The problem.** `index.html` and `ea-hire.html` are near-duplicates. Both carry the five pillars in full, the three levels with prices, the report breakdown and an FAQ. Both target "executive assistant test":

- `index.html` title: `Executive Assistant Test | The Core Standard`
- `ea-hire.html` title: `Executive Assistant & PA Test for Hiring | The Core Standard`

Google will rank one and suppress the other, and it will pick the homepage because that is where the links point. The page with the Stripe buttons loses.

**The fix.** The homepage introduces and proves. `ea-hire.html` sells. Remove the duplicated depth from `index.html`:

| Section on `index.html` | Action |
|---|---|
| Hero | Keep |
| "Two ways in" | Keep, but see Task 4 |
| Stats block | Keep, but fix the pillar count (Task 3) |
| "Three steps / report in 48 hours" | Keep — short, unique framing |
| "The Problem" | Keep |
| Five pillars, full detail | **Cut to a short summary** — name the five, one line each, link to `methodology.html` for the detail. `ea-hire.html` keeps the full version. |
| "Inside the simulation" | Keep |
| "Send a link. Get a competency report." full breakdown | **Cut to a short summary** and link to `how-it-works.html#sample-report`. |
| "The Difference" comparison table | Keep — unique to this page |
| Testimonials | Keep |
| "The three EA levels" with prices | **Cut.** Replace with a single line and a link to `ea-hire.html`. Pricing belongs on the money page and `pricing.html`, not three places. |
| Level finder | Keep — genuinely useful and unique |
| "Assessment Options / Choose your track" | **Cut heavily.** This is a third copy of the product list. Reduce to two links: employers → `ea-hire.html`, candidates → `certified.html`. |
| Full FAQ | **Cut to three questions** and link to `faq.html`. The full set is duplicated there. |
| Who We Are | Keep |
| Ecosystem | Keep |
| Newsletter | Keep |

**Retitle to separate the two pages:**

- `index.html` → `The Core Standard | Scenario-Based Executive Assistant Assessment`
- `ea-hire.html` → unchanged, it should own "executive assistant test"

Also fix the homepage `og:title`, which currently disagrees with the `<title>` tag.

**Homepage H1.** Currently "Interviews show you who presents well. This shows you who performs." Strong copy, no keyword. Keep the line as the visual hero but ensure an `<h1>` exists containing "executive assistant assessment" — or demote this to `<h2>` and add a keyword-bearing `<h1>` above it. Do not weaken the copy to do it.

---

## Task 2 — Remove the four dead product pages from the index

`ea-manager.html`, `private-pa.html`, `chief-of-staff.html` and `tcs-match.html` are all "coming soon". They sell nothing, they are in the main nav and in the footer of every page, and they are indexed. Every page on the site currently passes authority to four pages with no product.

For each of the four:

1. Add `<meta name="robots" content="noindex,follow">` to the `<head>`.
2. Remove the URL from `sitemap.xml`.
3. Remove from the **main nav** dropdown. Keep them in the footer under Products.
4. Point the nav's "coming soon" entries at `register-interest.html?product=<slug>` instead, which already exists and does this job properly.

Leave `canonical` tags in place. When a product launches, reverse all four steps for that page.

**Do not noindex** `certified.html` or `benchmark-your-team.html` — both are live products.

---

## Task 3 — Fix the pillar count error

`index.html` stats block says **"4 — Pillars Scored Per Report"**. The same page then lists five pillars and says candidates are scored "across five dimensions". The sample report mock on `index.html` shows four scores; the one on `ea-hire.html` shows five.

Change the stat to `5`, and add Partnership to the homepage sample report mock so it matches `ea-hire.html`.

Then grep the whole repo for "four pillars" and "4 pillars" and correct every instance. Check `methodology.html` in particular — its page title may still say "Four Pillars".

---

## Task 4 — Rebalance the homepage audience split

The hero offers "I'm hiring an EA" and "I'm the EA" as equal choices, and puts a £175 candidate product beside a £495–£995 employer product. The business is employers.

- Make the employer route the primary CTA — full-weight button, first position.
- Make the candidate route a secondary text link.
- Point the employer CTA at `ea-hire.html` directly, not `products.html#employers`. Remove the extra hop.

**Also on `ea-hire.html`:** it currently carries a "For candidates" block linking to `certified.html`. On the page whose only job is employer conversion, this sends the buyer elsewhere mid-page. Reduce it to one line near the foot of the page: candidates who have been asked to sit an assessment get a link to `how-to-prepare.html`, not to a product they might buy instead.

---

## Task 5 — Internal linking (hub and spoke)

Build the hierarchy explicitly. Every link below is a contextual in-body link, not a nav or footer link.

**Money page:** `ea-hire.html`
**Traffic hub:** `how-to-hire-an-ea.html`
**Spokes (hiring-manager intent):** `executive-assistant-interview-questions.html`, `what-makes-a-great-ea.html`
**Proof pages:** `methodology.html`, `how-it-works.html`, `anatomy-of-a-tcs-report.html`

Rules:

1. Every spoke links **up** to `how-to-hire-an-ea.html` and **across** to `ea-hire.html`. At least one of each, in the body copy, early.
2. `how-to-hire-an-ea.html` links **down** to every spoke and **across** to `ea-hire.html`.
3. Spokes link **sideways** to each other where the topic genuinely connects. Do not force it.
4. `ea-hire.html` links to the three proof pages. It does not link to `certified.html` (see Task 4).
5. `certified.html` links **up** to `methodology.html` and to `how-to-prepare.html`. It does **not** link to `ea-hire.html` — different audience, and the link would invite candidates into the employer funnel.
6. Anchor text describes the destination. Use "the executive assistant assessment for employers", not "click here" and not the bare page title every time. Vary it naturally.

`insights.html` is the blog index and should link down to every article; every article links back up to it and across to its cluster hub.

---

## Task 6 — Verify before committing

1. `grep -rn "www.thecorestandard" .` — should return nothing.
2. `grep -rni "four pillars\|4 pillars" .` — should return nothing after Task 3.
3. `grep -rn "Trusted Partner\|Executive Partner\b" .` — should return nothing except legitimate uses of "Executive Business Partner".
4. Confirm every page still has its `<link rel="canonical">` and its structured-data blocks. Diff the `<script type="application/ld+json">` blocks before and after; they should be unchanged except where you have deliberately added.
5. Confirm `sitemap.xml` no longer lists the four noindexed pages, and that the count matches the number of indexable pages.

---

## Not in scope, deliberately

- **GA4.** Still not installed. It is a separate job and it needs a measurement ID first.
- **URL renaming.** `ea-hire.html` does not contain the target keyword, and `/executive-assistant-test/` would be better. Not worth the redirect risk while the site is this young and the www migration is still settling. Revisit in six months.
- **New spoke articles.** Search Console has five days of data. Wait two to three weeks before choosing targets.

---

## Needs checking before you start

`products.html` and `certified.html` were not reviewed when this brief was written. Read both first. If `products.html` also targets "executive assistant test" or reproduces the level-and-price list a third time, it needs the same treatment as the homepage in Task 1 — reduce it to a router that sends people to `ea-hire.html` and `certified.html`, and retitle it so it stops competing.

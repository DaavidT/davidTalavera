# SEO Validation Checklist

Complete this checklist after deploying SEO changes to verify everything is working correctly.

## ✅ Structured Data Validation

### Person Schema
- [ ] Visit: https://search.google.com/test/rich-results
- [ ] Paste entire `<head>` section from built homepage
- [ ] Verify: Person schema renders without errors
- [ ] Check: name, jobTitle, email, sameAs fields present

### Organization Schema
- [ ] Verify: Organization schema in test results
- [ ] Check: name, url, email fields populated

## ✅ Open Graph & Social Preview

### Facebook Open Graph Debugger
- [ ] Visit: https://developers.facebook.com/tools/debug/
- [ ] Enter: https://davidtalavera.com
- [ ] Verify: og:image displays correctly (1200×630px)
- [ ] Check: og:title and og:description match expectations

### Twitter Card Validator
- [ ] Visit: https://cards-dev.twitter.com/validator
- [ ] Enter: https://davidtalavera.com
- [ ] Verify: twitter:card shows "Summary Card with Large Image"
- [ ] Check: twitter:creator tag shows @davidtalavera_
- [ ] Check: Image preview displays correctly

## ✅ Mobile & Performance

### Google Mobile-Friendly Test
- [ ] Visit: https://search.google.com/mobile-friendly
- [ ] Enter: https://davidtalavera.com
- [ ] Expected: "Page is mobile friendly"
- [ ] Verify: Title and description display correctly on mobile

### Lighthouse SEO Audit
- [ ] Open DevTools in Chrome (F12)
- [ ] Go to: Lighthouse tab
- [ ] Select: "SEO" category
- [ ] Run audit on homepage
- [ ] Expected: Score 90+
- [ ] Check: No warnings or errors

## ✅ Schema Validation

### Schema.org Validator
- [ ] Visit: https://validator.schema.org/
- [ ] Paste: Entire `<head>` section from built HTML
- [ ] Expected: No errors or warnings
- [ ] Verify: Both Person and Organization schemas present

## ✅ Search Console Setup

### Google Search Console
- [ ] Visit: https://search.google.com/search-console
- [ ] Add property: https://davidtalavera.com
- [ ] Submit sitemap: /sitemap-index.xml
- [ ] Request indexing for homepage
- [ ] Monitor: Impressions, CTR, Average Position for 30 days
- [ ] Expected keywords:
  - "Solutions Architect remote"
  - "Full-stack developer"
  - "Business automation consultant"
  - "Applied AI development"

## ✅ Analytics Setup

### Google Analytics
- [ ] Visit: https://analytics.google.com
- [ ] Create property for: davidtalavera.com
- [ ] Get Measurement ID (G-XXXXXXXXXX)
- [ ] Replace placeholder in BaseLayout.astro
- [ ] Verify: Real-time data showing traffic after deploy
- [ ] Check: Core Web Vitals data available (after 30 days)

## ✅ Alt Text & Image SEO

### Google Images
- [ ] Search: "David Talavera portfolio" in Google Images
- [ ] After indexing: Verify work card images appear
- [ ] Hover over image: Check alt text displays correctly
- [ ] Example: "HIR Seguros - Digital insurance platform..."

## ✅ Meta Tags Verification

### Title & Description
- [ ] Check current title: "Solutions Architect & Full-Stack Developer | David Talavera"
- [ ] Check current description: "Full-stack developer & solutions architect for startups..."
- [ ] Verify: Both appear in browser tab and SERP preview

### Canonical URL
- [ ] Inspect page source (Ctrl+U)
- [ ] Find: `<link rel="canonical"` tag
- [ ] Verify: Points to https://davidtalavera.com/

## ✅ Link Structure

### Internal Links
- [ ] Verify: Navigation links to /experience, /skills, /contact work
- [ ] Check: Footer links are functional
- [ ] Ensure: No broken links (404s)

### External Links
- [ ] Verify: LinkedIn link opens correct profile
- [ ] Check: Email link triggers mail client

## 📊 Expected Outcomes (30-day window)

| Metric | Baseline | Target |
|--------|----------|--------|
| Organic impressions | Current | +20–30% |
| CTR from SERPs | Current | +10–15% |
| Average position | Current | Better ranking for target keywords |
| Social shares | Current | +30–50% (OG image impact) |

## 🔄 Monthly Monitoring Tasks

- [ ] Check Search Console: impressions, CTR, position trends
- [ ] Review Analytics: traffic sources, user behavior, bounce rate
- [ ] Verify Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Monitor backlinks: New referring domains
- [ ] Check for 404s or crawl errors in Search Console

## 📝 Notes

- **GA ID**: Replace `G-XXXXXXXXXX` in BaseLayout.astro with actual Measurement ID
- **Twitter handle**: Verify @davidtalavera_ is correct account
- **LinkedIn profile**: Ensure https://www.linkedin.com/in/davidtalaveratorres is accessible
- **Sitemap**: Automatically generated at `/sitemap-index.xml` via @astrojs/sitemap

---

*Last updated: October 8, 2026*

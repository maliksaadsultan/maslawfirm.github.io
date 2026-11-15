# Complete implementation plan

Planning gate completed 15 November 2026: repository audit, online research and three-way creative comparison precede any production HTML/CSS/JS changes. Supporting audit/research scripts and documents are not production edits.

## Architecture decision

Retain static HTML and every existing filename. Add a local Python generator using BeautifulSoup to preserve original main content while emitting reusable header, navigation, footer, metadata and layout. Generated root and directory HTML are deployable without Python or Node. A `dist/` packaging step is optional for Actions and excludes documentation, skills, tools, caches and dependencies. No runtime backend, client router or React migration.

Files: `tools/build_site.py`, preserved page source under `content/`, `templates/` for major layouts if useful, new `assets/design/site.css`, `site.js`, local fonts and architecture imagery. Existing shared assets and page graphics remain in place to protect public asset URLs. Update old contact values in dormant scripts too. Do not alter CNAME bytes.

## Stage 1: source and brand (highest priority)

Preserve original main HTML, metadata, form fields/actions and page list before redesign. Integrate full square logo with correct dimensions. Acquire and record licensed imagery and local font licenses. Build navy/blue/paper tokens, typography, grid, utility layouts and focus states. Check logo ratio, no crop/filter, and local asset delivery.

## Stage 2: shared experience

Build shared header, click-based service mega-menu, guide navigation, mobile disclosure, footer, skip link and consultation band. Group business registration, taxation/compliance, IP/legal, and practical guides. Include every service route in directory; use original exact casing. Keep all phone, email and WhatsApp destinations correct in static source and JSON-LD. Check keyboard, Escape, focus, mobile overflow and no-JS usability.

## Stage 3: major pages

- Homepage: two-part architectural hero, useful service families, concise preserved firm introduction, featured guide links, consultation close. No metrics or testimonials.
- About: editorial header, location/service scope, complete existing mission/values/strengths and expertise content. No fictional lawyer portraits.
- Services: complete categorized directory above existing descriptive material; links to all pages. Avoid excessively repeated cards.
- Contact: two-column details and labeled form; preserve verified source address, hours and Formspree endpoint; add WhatsApp-prepared request option that requires visitor action. Keep email/phone available if endpoint fails. Map becomes a privacy-conscious explicit open-map action rather than an automatically loaded tracker.
- 404: shared shell and recovery links. Portfolio template: clearly labeled non-firm template, retained source content, noindex, omitted from public menus.

## Stage 4: all service and guide pages

Apply an interior hero with title, original subtitle, breadcrumb, category and contextual consultation action. Preserve full original main sections, lists, tables, authority links, process steps and document requirements. Add a generated contents sidebar and anchor IDs; original anchor IDs remain. Restyle card grids as editorial information groups; render process steps with a connected vertical line. Provide expandable infographic reference figures to reduce repetition. Add relevant related services and consultation links.

Coverage: company registration, sole proprietor, partnership, LLP, manufacturing, construction, IT/PSEB; income tax, sales tax, NTN, PRA, both audit URLs, appeals; trademarks, copyright, contracts; filer guide, firm/company comparison, WEBOC and chamber membership. Specific content/risks for every route are in the audit inventory. Canonicalize misspelt audit URL without removing it or breaking anchors.

## Stage 5: motion

CSS hero entrance coordinates headline, summary/action and image settling. Native disclosure transitions and pointer/focus feedback respond immediately to actions. Small WAAPI/IntersectionObserver enhancements on selected visual/process elements, never hiding legal content by default. Use transforms/opacity and no perpetual animation loop. `prefers-reduced-motion` disables entrance/scroll effects; live preference changes cancel active animations. No smooth-scroll dependency.

## Stage 6: legal review and SEO

Retain substantive source claims; add specific caution where authoritative evidence contradicts source. Document known weekly-vs-daily ATL issue with FBR reference; SECP single-member exception; questionable chamber/customs office geography; old fees, deadlines, penalty and IP protection assertions. No silent substantive rewrite. Keep detailed `LEGAL_CONTENT_REVIEW.md`. Add consistent canonical, Open Graph, new logo/contact JSON-LD and breadcrumbs. Create sitemap excluding duplicate/noindex pages; robots with sitemap. Do not invent ratings, price range or credentials.

## Stage 7: verification and iteration

1. Validate 27 original HTML paths remain; parse all for title, one h1/main, descriptions, canonical/schema, exact contact destinations, local images/scripts/styles, all internal hrefs/fragments and original section text coverage. Compare CNAME hash.
2. Serve local static output. Use real headless Chromium and screenshots at 375, 768, 1440, 1920. Capture every page desktop/mobile, plus major pages at tablet/wide widths. Inspect contact sheet and full screenshots.
3. Exercise mobile menu, service disclosure, Escape/focus, contents deep links, service filtering only if added, form required validation, success/error via intercepted endpoint and WhatsApp encoding without sending messages. Test no JS and reduced motion. Capture JS/network errors and broken assets.
4. Critique cycle one: hierarchy, hero balance, word breaks, logo readability, service density and mobile spacing. Fix observed shortcomings.
5. Critique cycle two: repeat affected screenshot/layout checks; validate longest guides, tables, nav and footer. Fix remaining defects.
6. Run Lighthouse actual mobile/desktop measurement on home and representative interior/contact; seek 90+ in all four categories, report measured values and limits. Accessibility automated audit complements keyboard testing; no claim of full WCAG certification.
7. Package static output and validate deep routes, sitemap, CNAME and asset links. Remote Pages settings, production delivery of Formspree and real external app handoffs remain unverified without deployment/live messages.

## Deployment and risk controls

Keep root output usable for existing branch publishing. Add `.nojekyll`; provide manual-only optional Actions workflow packaging static content. Do not auto-deploy on push, change Pages settings or DNS, or create a new hosting account. User will choose deployment after local review. Include preview/build/deploy instructions in README and final delivery document. Caches, installed skills and screenshot/report archives stay outside deployment artifact.

## Acceptance criteria

Every original page path preserved; valuable original main content retained; new logo intact throughout; updated contacts in templates, generated pages, legacy source, metadata and schema; no new invented claims; no unresolved local broken links; keyboard/mobile/reduced-motion/no-JS navigation works; honest form success/failure handling; original domain preserved; static artifact serves all pages; screenshot critique and measurements recorded. Report unresolved external links, legal verification, blocked reference sites and untested production services explicitly.

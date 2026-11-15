# MAS Law Firm repository audit

Audit date: 15 November 2026. Completed before production changes. Source: every local HTML page, shared CSS/JS, all asset paths, README, CNAME, and the live homepage. Machine-readable original content, HTML, links, forms, titles and hashes are preserved in `original-content.json`; complete original file inventory is in `original-file-inventory.txt`.

## Architecture and publishing

The site is buildless HTML: each public directory contains `index.html`. Shared styles and interactions are `assets/shared/anjum-main.css` and `anjum-main.js`. There is no React application, package manifest, installed project dependencies, source component system, Git directory or available Git history. Do not migrate to a client-rendered application. Root-relative links require the existing custom-domain root deployment. Route casing is significant on GitHub Pages.

`CNAME` contains exactly `www.maslawfirm.org`. The README claims a deployment workflow, `.nojekyll`, sitemap, robots and infographic-generation tool exist; none are in this supplied export. Remote Pages settings cannot be inferred from the ZIP. Preserve CNAME, provide root static outputs and a separately documented, manually triggered optional workflow. Do not change DNS, push, or publish.

## Complete page inventory and review

| Existing file / public route | Purpose, content and specific treatment |
|---|---|
| `/` | Firm introduction; three featured services; broad tax, registration, IP and disputes positioning. Replace repetitive hero/cards with distinctive introduction, grouped service index, firm story and guide pathways. Preserve existing descriptive copy. |
| `/about/` | Mission, values, team strengths and service areas. Editorial presentation; no invented biographies, testimonials or metrics. Existing 2023 founding claim and court-representation statements need firm verification. |
| `/services/` | Service directory with only nine featured entries. Expand discoverability to every service and guide using grouped links; retain existing overview copy. |
| `/contact/` | Address, hours, phone, email, map and Formspree form. Preserve address and hours; distinguish source-provided hours from independently verified operating status. Replace email. Preserve form endpoint, add honest feedback and WhatsApp alternative. |
| `/company_registration/` | Entity types, incorporation benefits, three-step process, requirements, post-registration setup, advisory list and appointment form. Retain substantive sections; add contents navigation. Minimum capital, blanket liability and director claims need review. |
| `/sole_proprietorship/` | Characteristics, five registration steps, identity/premises documents and annual responsibilities. Use process timeline and clean document lists. |
| `/partnership_firm_registration/` | Partnership definition, requirements, advantages, deed contents and registration documents. Keep Partnership Act reference; member limits and registration effects require review. |
| `/register_LLP/` | LLP features, advantages and registration sequence. Preserve exact mixed-case URL. Repair visibly damaged bullet glyphs without altering legal meaning. |
| `/manufacturing_company_registration/` | Manufacturing incorporation, tax, WEBOC/PRA/IP registrations and ongoing compliance. Maintain all authority links; flag universal-registration assertions. |
| `/real_estate_construction_company_registration/` | SECP, PEC, tax and local approvals; business categories and documents. Applicability varies by activity and jurisdiction; flag blanket LDA/Tehsildar claims. |
| `/IT_company_registration/` | PSEB, software, BPO, cloud/app categories and business documents. Preserve case. Tax incentive, export and registration eligibility claims need current review. |
| `/income_tax_return_filing/` | Taxpayer categories, filing obligations, benefits, wealth statement, refunds, due dates, penalties, unsuccessful returns and appointment form. Flag thresholds, deadlines and penalty amounts. |
| `/sales_tax_registration_sales_tax_return/` | Federal registration, biometric verification, deregistration, Iris mobile, return filing, refund/FASTER, due dates, record retention, POS and appointment form. Long guide needs readable tables and navigation; all rates/time limits require verification. |
| `/NTN_registration/` | NTN and separate individual, proprietor, AOP and company document checklists. Preserve case, documents and authority links. Never request passwords in the new enquiry form. |
| `/registration_return_filing/` | PRA service categories, enrollment, monthly returns, payment and ATL. Clarify presentation as provincial sales-tax guidance; retain content. |
| `/tax_notice_audit_assessment/` | Notices, rectification, audit, TAMS, penalties and appeals. Use canonical spelling for new internal links. Flag audit selection, six-year period and penalties. |
| `/tax_notice_audit_assesement/` | Existing misspelt duplicate of audit route. Preserve functional page and deep links; canonicalize to correctly spelt route. |
| `/tax_appeals_litigation_services/` | Grounds, appeal hierarchy, income/sales-tax disputes and representation. Preserve content; flag jurisdiction, appeal hierarchy and practitioner entitlement claims for legal review. |
| `/register_trademark/` | Definition, eligibility, benefits, documents, searches, classes, colors, eight-stage process, fees, validity, renewal, processing time, offices, helpful links and form. Keep complete guide; current fees, offices and timelines require IPO verification. |
| `/copyright_registration/` | Original works, copyright/IP comparison, IPO functions, eligible work, documents, benefits, procedure, times and offices. Preserve full substance; global/lifetime protection claims need counsel review. |
| `/legal_agreements_contracts/` | Drafting approach, corporate, website, employment, property, financial and business documents. Use restrained editorial list layout. |
| `/become_tax_filer/` | Filing methods, extensive income-specific document checklist, assets/liabilities table, ATL, benefits and statutory claims. Important known contradiction: original says ATL updates weekly; FBR states daily updates. Keep source text with prominent specific review note. |
| `/difference_between_firm_company/` | Partnership/company comparison table and selection criteria. Improve table legibility and horizontal scrolling on small screens. |
| `/weboc_registration/` | Customs overview, office, benefits, seven steps, registration types and company/proprietor/AOP documents. Apparent Lahore address mislabeled Taxila; fee, bank balance, renewal and PSW migration claims need specialist review. Preserve download link, flag missing download if unresolved. |
| `/chamber_of_commerce_registration/` | Membership benefits, chamber functions and documents. LCCI and Taxila identities are mixed in original. Preserve information with explicit verification notice. |
| `/404.html` | Genuine static not-found page and recovery links. Rebuild with shared branding; retain 404 semantics and noindex. |
| `/PORTFOLIO_TEMPLATE.html` | Unrelated personal portfolio with placeholder credentials. Not evidence of firm achievements. Preserve accessible template content, clearly identify it as a template, exclude from public navigation/search indexing. |

## Assets, design and functionality

The supplied 1254 × 1254 JPEG includes generous white margins and the words MAS Tax Firm / Artistry in Tax Planning. Preserve the full square file, without cropping, recoloring, masking or stretching. The website can continue to identify itself as MAS Law Firm. Existing old logo is 1088 × 364; do not reuse that aspect ratio for the new logo.

There are page-specific PNG and WebP infographic pairs, locally bundled Font Awesome families, numerous unused jQuery/WordPress/map/plugin assets and remotely loaded Google fonts. Existing production HTML mostly uses the two `anjum-main` files; `site-appointments.js` is a separate legacy implementation with particles and old email. Retain existing assets for URL compatibility but stop loading obsolete behavior. Inspect all referenced image paths; preserve useful infographics with explicit dimensions and lazy loading. Do not use synthetic staff or office photos as evidence.

The existing visual system is navy/amber, rounded cards, decorative icons and repeated infographic graphics. It has large headings but little editorial differentiation. Nested hover menus obscure secondary services; animation is attached to many repeated elements. Current JS contains contact normalization, mobile navigation, reveals and form enhancements. Preserve the outcomes, replace the implementation with small progressive enhancements and native controls.

## Risks and improvements

- Email `mastaxlawfirm@gmail.com` occurs in visible content, metadata/schema, README and dormant scripts. Update to `mastaxfirm@gmail.com` in production and source. Phone is mostly already correct; verify every `tel:` and WhatsApp destination.
- Existing metadata has canonical, Open Graph and LegalService JSON-LD. Keep useful unique descriptions; update logo/contact/schema, remove unsupported price claims; add breadcrumb schema. Duplicate audit route must share canonical. No fabricated aggregate ratings.
- Forms point to `https://formspree.io/f/mwkapwzv`. Endpoint ownership and delivery are not verifiable without sending a real enquiry. Do not send a test message. Use actual HTTP-success feedback, error handling and independent WhatsApp/email actions.
- Content currently encourages collecting IRIS passwords in some checklists. Preserve legal-source content but add a clear reminder not to send passwords or identity documents in a general enquiry.
- Mobile risk: long service names, nested menus, large document tables, fixed contact controls and sticky header. Test 375/768/1440/1920 widths and keyboard focus; use bounded table scrollers, readable one-column flow and no fixed floating obstruction.
- Reduced-motion users need immediate readable content. No content may depend on an animation library, hydration or JavaScript to become visible.
- Verify internal links against exact filenames, including external downloads that may no longer exist. List unresolved links honestly.
- Legal review is not complete merely because the design is complete. Provide page-specific flags and `LEGAL_CONTENT_REVIEW.md` with authoritative sources and remaining questions.

## Retain and redesign

Retain: complete route inventory, substantive main content, source-provided office details, working phone/WhatsApp actions, authority links, useful illustrations, CNAME and buildless deployment. Redesign: shared shell, homepage narrative, service directory, page heroes, long-form typography, TOCs, contact form behavior, responsive navigation, motion and footer. Add a repeatable local generator and verification tooling while keeping emitted HTML independently deployable.

# MAS Law Firm website

A complete static redesign for https://www.maslawfirm.org/. All 27 original HTML files and route casing are preserved. No backend or runtime framework is needed. The square logo is unchanged.

## Preview

Run `python tools/serve.py` from this directory, then open http://127.0.0.1:8000/. Stop with Ctrl+C.

## Edit and build

```powershell
python -m pip install -r requirements.txt
python tools/build_site.py --package
python tools/verify_site.py
```

Edit page content/metadata in `content/pages.json`; shared layouts are in `tools/build_site.py`. Styles and interactions are `assets/design/site.css` and `site.js`. Root/directory HTML is generated and can be served directly. `dist/` is the deployment artifact, excluding docs, skills, tools and QA caches.

Do not rerun the original audit against redesigned pages: `docs/original-content.json` preserves original content/hashes. The editable production source is `content/pages.json`.

## Contacts

- Email: mastaxfirm@gmail.com
- International: +92 332 7771392
- Pakistan: 03327771392
- WhatsApp: https://wa.me/923327771392
- Office: Khanpur Road, Opposite UET Taxila Main Gate, Tehsil Taxila, District Rawalpindi, Punjab, Pakistan

Shared contacts are in `tools/build_site.py`; form fallback contacts are also in `assets/design/site.js`. Original forms retain Formspree. Endpoint ownership and real delivery need an authorized live check. Tests intercept requests and send no messages. A prepared WhatsApp enquiry still requires the visitor to review and send it.

## GitHub Pages

CNAME remains `www.maslawfirm.org`. Preserve all folder casing, including IT_company_registration, NTN_registration and register_LLP, and both audit spellings. Root static publishing remains possible. This supplied ZIP had no Git history or workflow despite its old README claiming one; confirm actual remote settings.

The optional `.github/workflows/deploy.yml` runs only by manual workflow_dispatch. After approval, commit/upload reviewed files to the real repository, configure Pages for Actions if appropriate, then explicitly run **Publish reviewed static site**. It packages/validates dist before publishing. Confirm the existing domain/HTTPS; keep existing DNS. No deployment or DNS change was performed.

## Evidence

See docs/WEBSITE_REPOSITORY_AUDIT.md, DESIGN_RESEARCH.md, CREATIVE_DIRECTION.md, IMPLEMENTATION_PLAN.md, LEGAL_CONTENT_REVIEW.md, ASSET_PROVENANCE.md and DELIVERY_REPORT.md.

Legal guidance is preserved with visible review notes. Have qualified counsel review flagged claims before treating them as current. The retained portfolio template is noindex and its placeholders are not firm credentials.

## Section-specific imagery

`docs/SECTION_IMAGE_REVIEW.md` records the separate review of all 600 main-content headings and shared sections. Twenty-four individually prompted imagegen illustrations are integrated where useful; forms, legal tables and precise procedural text remain readable HTML. The existing hero photograph and supplied logo are retained.

`docs/GENERATED_SECTION_IMAGES.md` links every image, its original and its independent prompt. Originals are saved in `artifacts/section-image-originals/`; selected responsive WebP files are in `assets/section-images/`. The placement manifest is `content/section-images.json`, with final versions/checksums in `content/generated-image-results.json`. `tools/section_image_layout.py` applies the placements during normal builds. These paths are local static assets and retain GitHub Pages compatibility.

## Section motion

`docs/MOTION_RESPONSIVE_PLAN.md` records the follow-up research, alternatives and section-by-section motion decisions. Native Web Animations and Intersection Observer coordinate headings, framed images, service rows and process steps. Text, tables and forms remain steady; reduced motion, missing APIs and no-JS content are supported. No animation library or Node runtime is required to publish the website.

## Deployment archive and verification

`python tools/build_site.py --archive` regenerates the deployable files and `artifacts/mas-law-firm-github-pages.zip`. The duplicate `dist/` directory is generated on demand; it is not required to preview or maintain the root site.

`python tools/verify_site.py` checks the working website; add `--dist` to check a generated package. It prints results without creating diagnostic files unless `--report` is explicitly supplied. The Pages workflow retains this validation step.

Completed checks are summarized in `docs/DELIVERY_REPORT.md`. Screenshots, preview galleries, test reports, temporary testing scripts, QA dependencies, diagnostic logs and intermediate experiments have been removed at the user's request. Installed design skills and selected source-image originals remain available. The small static validator is retained because the GitHub Pages publishing workflow uses it; it produces no files by default.

Safari/Firefox, physical devices, screen readers, production caching/compression and live Formspree delivery remain unverified.

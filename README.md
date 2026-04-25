# MAS Law Firm Website

Static website for MAS Law Firm, a tax and legal consultancy based in Taxila, Pakistan and serving clients across Pakistan.

## About MAS Law Firm

MAS Law Firm helps individuals, businesses, startups, and companies with tax compliance, business registration, intellectual property registration, and legal documentation. The website presents the firm's services, guidance pages, office contact information, and consultation options.

Official website: `https://www.maslawfirm.org/`

## Main Website Pages

- `index.html` - Homepage introducing MAS Law Firm, core tax and legal services, and calls to action.
- `about/` - Firm profile, service approach, and professional overview.
- `services/` - Main services listing.
- `contact/` - Office address, contact number, WhatsApp consultation link, email, office hours, map, and contact form.
- `404.html` - Fallback page for missing routes.

## Services Covered

MAS Law Firm provides support for:

- Company registration through SECP
- Sole proprietorship registration
- Partnership firm registration
- Limited Liability Partnership registration
- Manufacturing business registration
- Real estate and construction company registration
- IT company and call center registration
- Income tax return filing
- Sales tax registration and sales tax return filing
- NTN registration
- Punjab Revenue Authority registration and return filing
- Tax notices, audit response, appeals, and litigation
- Trademark registration
- Copyright registration
- WEBOC registration
- Chamber of Commerce registration
- Legal agreements and contract drafting

## Guidance Pages

The website also includes practical informational pages for common client questions:

- How to become a tax filer
- Difference between partnership firm and company
- WEBOC registration
- Chamber of Commerce membership
- NTN registration

## Contact Details

- Phone: `+92 332 7771392`
- WhatsApp: `https://wa.me/923327771392`
- Email: `mastaxlawfirm@gmail.com`
- Website: `https://www.maslawfirm.org/`
- Office: Khanpur Road, Opposite UET Taxila Main Gate, Tehsil Taxila, District Rawalpindi, Punjab, Pakistan

WhatsApp links on the site open a chat with MAS Law Firm and prefill a visitor-side message for a tax consultation. True automatic replies from the lawyer or business account require WhatsApp Business greeting messages, WhatsApp Cloud API, or a chatbot provider.

## Project Structure

Each public route is a folder with its own `index.html`. Shared assets are kept under `assets/`.

- `assets/shared/anjum-main.css` - Shared site styles
- `assets/shared/anjum-main.js` - Shared interactions, navigation behavior, and contact link normalization
- `assets/pages/` - Page-specific graphics and service images
- `assets/fonts/` and `assets/webfonts/` - Local font and icon assets
- `tools/refresh_infographics.py` - Optional script for regenerating infographic assets

## Tech Stack

- Static HTML
- Shared CSS
- Shared JavaScript
- Font Awesome assets bundled locally
- No package manager, bundler, framework, or runtime build step required

## Local Preview

Run from the repository root:

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

On Windows, this command may be:

```bash
python -m http.server 8000
```

## Build And Deployment

No build command is required. The site can be served directly as static files.

This repository includes GitHub Pages support:

- `.github/workflows/deploy.yml` for deployment
- `CNAME` for `www.maslawfirm.org`
- `.nojekyll` for direct static asset serving
- `robots.txt` and `sitemap.xml` for indexing
- `404.html` for fallback handling

Recommended GitHub Pages settings:

- Source: GitHub Actions
- Custom domain: `www.maslawfirm.org`
- Enforce HTTPS: enabled

## Optional Asset Refresh

Run this only when regenerating infographic assets:

```bash
python3 tools/refresh_infographics.py
```

## Notes For Contributors

- Keep root-relative links such as `/assets/shared/anjum-main.css`.
- Keep folder names and route casing exactly as committed, including `IT_company_registration/`, `NTN_registration/`, and `register_LLP/`.
- Do not commit secrets, API tokens, private keys, or local `.env` files.

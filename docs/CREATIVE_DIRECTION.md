# Creative direction: structure, clarity, forward movement

Completed before production changes, 15 November 2026. The actual square logo is navy and vivid blue on white, with a rising arrow and architectural geometry. The artwork remains intact. Website identity stays MAS Law Firm; logo text remains MAS Tax Firm.

## Three distinct directions

| Dimension | A — Modern Editorial Luxury | B — Contemporary Corporate Excellence | C — Cinematic Professional Experience |
|---|---|---|---|
| First impression | Quiet confidence; publication-like title and reading rhythm | Crisp expertise; service discovery comes first | Dramatic full-height image and staged headline |
| Typography | Cormorant Garamond display + Manrope body | Manrope throughout with clear weight hierarchy | Large display serif, sparse supporting sans |
| Color | Paper, navy, restrained logo-blue actions | White, navy, larger blue panels | Dark navy, white, blue highlights |
| Homepage | Editorial introduction, service rows, firm story, reading guides | Category-led hero, searchable service directory, process | Image-led hero, full-screen service chapters |
| Hero | Asymmetric two-column text/image | Text and compact service selector | Full-bleed photography with synchronized text |
| Navigation | Quiet persistent header; click disclosure index | Persistent categories and functional directory | Full-screen overlay with fewer immediate links |
| Services | Reading-first pages and contextual side navigation | Modular cards, comparison tools, structured forms | Large scrolling chapters and image interludes |
| About | Mission/values as editorial story | Expertise and process grid | Cinematic narrative; would need authentic media |
| Contact | Direct details beside a simple enquiry | Task-oriented enquiry with routing | Immersive final section with contact overlay |
| Motion | One entrance, tactile interactions, selected image reveals | UI state transitions and process feedback | ScrollTrigger sequences, parallax, page choreography |
| Mobile | Naturally collapses to readable vertical flow | Efficient but potentially dense | High adaptation cost; cinematic pinning would be disabled |
| Performance | Small local fonts, one optimized image, little JS | Good, although added search/filter logic grows | Highest asset/JS cost and reduced-motion complexity |
| Trust | Familiar serious reading experience | Strong practical usability | Risk of spectacle outweighing substance |
| Maintenance | Lowest; evergreen editorial content | Moderate component maintenance | Highest; needs new authentic photography and motion QA |

## Selection

Choose A's reading quality with B's clear service taxonomy and C's single composed hero moment. This is a specific architectural direction suggested by the upward structural line of the MAS logo: an image of a building viewed upward, a broad navy field, and a blue structural accent. No gavels, stock lawyers, justice scales wallpaper or gold imitation luxury.

Comparison scores (design judgment, 5 strongest): suitability/trust A5 B5 C3; distinctiveness A4 B3 C5; long-form clarity A5 B4 C2; mobile/performance A5 B5 C2; maintenance A5 B4 C2. A is the foundation because most routes are detailed legal/tax guides.

## Composition study

```text
A: [logo + identity]         [Firm  Services  Guides  Contact] [Consult]
   [Navy: oversized proposition + actions] [Tall architecture image]
   [Tax & compliance] [Business registration] [IP & legal support]
   [Short editorial introduction] [A deliberately useful service index]

B: [logo] [Navigation] [Consult]
   [Business proposition] [Choose your service / category directory]
   [Service grid] [Process grid] [Contact panel]

C: [overlay navigation]
   [full-viewport image / headline choreography]
   [scroll chapter] [scroll chapter] [contact]
```

Plan critique: generic cream/gold luxury would conflict with the new logo. Revise to cool paper-white and actual blue. A huge newspaper index would be dense on phones; use three service families and short featured rows on home, with the complete directory on Services and in the mega-menu. Avoid random numbering; use numbers only for actual process steps.

## Detailed specification

- Colors: ink navy `#0a233b`, deep panel `#071c30`, logo blue `#0869c7`, paper `#f5f6f3`, white `#ffffff`, muted text `#536373`. Dark panel secondary text `#c3d0dc`. Borders `#d5dce1`. Verify actual contrast after rendering.
- Type: locally served Cormorant Garamond medium for expressive display; Manrope regular/medium/semibold for body and controls. Display 76–108px desktop, 48–58px phone; interior title 44–72px, h2 36–52px, body 16–18px, labels 12–14px. Default prose max 70–78 characters. No compressed body tracking.
- Grid: maximum 1360px, gutters 28–64px desktop/22px phone. Hero text/image approximately 55/45. 12-column conceptual grid; service article 240px sidebar plus 850–940px content. Sections 80–112px desktop, 48–64px phone. Main text left aligned.
- Surfaces: mostly open layouts, occasional quiet information panels, modest radius only on controls/utility panels. No repeated floating shadow cards. Tables have row separators, distinct headers and bounded horizontal scrolling.
- Logo: full original square JPEG at intrinsic 1:1 ratio, object-fit contain; retain all white margins. Pair with separate text identity so navigation remains readable. Footer uses white logo tile without filters.
- Images: licensed architectural photo, clearly illustrative, optimized local WebP with responsive sizes and provenance. Existing informative graphics remain available in their original URLs and appear as expandable reference figures where visually repetitive. No image is presented as MAS premises.
- Buttons: strong blue or white primary action with clear verb; secondary links restrained. Minimum 44px touch targets, obvious focus outline, pressed/hover feedback. No nonfunctional decorative controls.
- Navigation: nonmodal mobile disclosure below header; native grouped service disclosures; Escape closes and returns focus, desktop outside click/focus exit closes; no trapped focus in an ordinary disclosure. All content remains reachable without JS.
- Motion: hero text/image sequence under one second, slight image scale settling; responsive menu state; reading progress and optional section/image reveals. No autoplay loops. Reduced motion removes transform and scroll interpolation; JS failure keeps content visible.
- About: lead with real service scope, retain mission/values, mark existing credentials pending verification. No profile inventing.
- Contact: phone `+92 332 7771392`, local `03327771392`, email `mastaxfirm@gmail.com`, WhatsApp `https://wa.me/923327771392`, preserved office address and source hours. Honest form submission, no simulated success, no credentials requested.

## Acceptance of the direction

The result must look like one firm across every route; the longest guide must be as readable as the homepage. The memorable moment is the hero composition. Navigation, legal details and contact actions remain practical. Verify in actual rendered screenshots at all requested widths and refine based on observed issues.

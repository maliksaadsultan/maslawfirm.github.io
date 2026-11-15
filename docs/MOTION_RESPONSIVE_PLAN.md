# Section motion and responsive refinement

Prepared 15 November 2026, before production changes for this refinement. This extends the repository audit, design research, creative direction and implementation plan already delivered. The firm identity, original logo, 27 routes, contact details, source legal content and static hosting remain the constraints.

## Research and decisions

Verified technical observations:

- [web.dev: high-performance animations](https://web.dev/articles/animations-guide) recommends transform and opacity and explains the layout/paint cost of other properties. Apply this to entrances, image settling and interaction feedback; do not animate layout dimensions or broad shadows.
- [MDN: Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) documents asynchronous viewport observation. Use one observer for finite entrances, then unobserve each target; no continuous scroll handler or animation loop.
- [MDN: Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) documents native timing and cancellation. Use short, cancellable sequences with visible underlying content.
- [GSAP: matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) supports responsive conditions and cleanup. GSAP would suit complex pinned storytelling; the current static documents need neither a large timeline engine nor pinning.
- [Codrops: practical scroll-driven animation introduction](https://tympanus.net/codrops/2024/01/17/a-practical-introduction-to-scroll-driven-animations-with-css-scroll-and-view/) explores independent image entrances and motion-preference gating. Adapt the relationship between image and viewport, rather than its more theatrical demonstrations.

Creative alternatives considered:

1. Cinematic scroll: scrubbed images, pinned sections and split characters. Strong spectacle, but interferes with reading long legal guides, adds mobile complexity and needs more runtime machinery. Reject.
2. Uniform reveal: every block fades and rises. Simple but mechanical, repetitive and weakens the information hierarchy. Reject.
3. Editorial choreography: headline rhythm, images settling inside fixed frames, sequential service rows and actual process steps; stationary body text. Select. It develops the existing architecture/paper metaphor and is practical on every route.

These are MAS-specific proposals, not claims about the reference sites. Use native CSS + Web Animations + Intersection Observer. No new runtime library, smooth-scroll replacement, WebGL or animated raster downloads.

## Section-by-section treatment

| Section / content | Image decision | Motion / interaction | Small screens |
| --- | --- | --- | --- |
| Homepage hero | Keep architectural photograph; no logo effects | Three headline lines enter in sequence, supporting actions follow; photo settles once | Shorter travel and duration; stacked layout |
| Three service families | Text is clearer than three decorative pictures | Brief ordered entrance, directional arrow feedback and a blue rule responding to focus/hover | Each row enters when reached; no delayed offscreen rows |
| Firm introduction | Keep independently generated planning scene | Story heading enters; image and caption settle in their own sequence | Fixed image frame below copy; no parallax |
| Featured expertise | Keep open text rows for easy comparison | Heading entrance, small horizontal row arrival, hover/focus rule | Minimal horizontal travel; normal touch links |
| Consultation process | No extra image: the numbered sequence already explains it | Individual steps enter once; connecting line resolves as each step is reached | Shorter movement and no sticky/pinned sequence |
| Guide selection | Keep three distinct explanatory thumbnails | Thumbnails settle inside frames; controlled image zoom on pointer/focus interaction | No hover-dependent information, full-width images |
| Interior page introductions, including About | Existing typography carries service identity | Headline and introduction coordinate on initial view | One column, no character splitting or clipped titles |
| Legal/service article sections on all routes | Keep reviewed task-specific image placements; no image added to dense requirements/tables | Section headings and selected figures enter separately; paragraphs, forms and tables stay steady | Wrap long headings; keep tables within named scroll regions |
| Article process lists | Keep text/number hierarchy | Step marker and short step heading receive finite emphasis | No animation of large paragraph blocks |
| Services directory | No additional image needed for finding a service | Group headings enter; links have clear keyboard/pointer feedback | Stack groups without horizontal translation |
| Contact methods and enquiry form | No fictional office or staff image | Contact heading and channel groups enter; form remains stable during input | Full-width controls, no moving form panel |
| Office hours / related links | No decorative photo needed | Heading entrance and existing link feedback | Normal document flow |
| Consultation strip and footer | Keep supplied logo intact | Invitation and action coordinate once; footer remains steady | No movement of contact details while selecting them |
| Preserved expandable information / infographics | Keep existing original assets | Native expansion; do not queue entrances inside closed disclosures | Same accessible disclosure behavior |

## Implementation order and file changes

1. Complete this plan before editing production files.
2. `tools/section_image_layout.py`: wrap generated images in a fixed-ratio viewport, preserving source/alt/srcset, captions and placement.
3. `assets/design/site.css`: coordinated hero lines, clipped image frames, service interaction rules, process connectors, fluid long-heading safeguards and reduced-motion overrides.
4. `assets/design/site.js`: replace the lone process reveal with one recipe-based viewport observer. Avoid duplicate parent/child transforms. Observe headings, visual frames, family/expertise rows and process markers. Use short bounded delays, no infinite animation and no hidden-state CSS.
5. Regenerate the 27 HTML pages through the maintained builder. No framework, backend or deployment changes.
6. Real-browser critique, responsive checks and refinement; update screenshots and verification documentation; refresh the GitHub Pages archive and remove temporary QA files.

## Safety, accessibility and acceptance

- Every element is visible without JavaScript and without supported animation APIs. Observer failure leaves a complete static page. Anchors, native menus and forms retain their behavior.
- `prefers-reduced-motion` suppresses CSS and JS motion, including when changed during the visit. Cancel active animations when reduced motion is enabled, on anchor/focus interaction with an animated target and before printing. No animation remains filled after completion.
- Motion uses transform/opacity only, generally 400–850 ms, at most a short stagger. No continuous scroll listeners, page transition interception, character-split headings or global `will-change`.
- All existing image dimensions, responsive sources, lazy loading and conceptual-illustration captions remain. Images do not reflow content during motion.
- Test 375, 768, 1440 and 1920px, plus 320px edge cases. Check every route for horizontal overflow and console errors. Inspect actual screenshots and compare motion start/end states. Test live reduced motion, missing animation APIs, JavaScript-disabled content, mobile navigation, keyboard focus, anchors and enquiry behavior with mocked delivery.
- Run the maintained content/link verifier and measure representative Lighthouse pages after the changes. Retain the explicit limitation that actual Formspree delivery and legal claims are not newly verified.
- Preserve `CNAME`, `.nojekyll`, all URLs and the static package. Do not publish or alter DNS.

## Completed verification

Implemented the selected native approach and reviewed actual entrance/settled image states, the desktop process and mobile guide sections. All 108 route/viewport layout checks and 54 mobile/desktop axe scans passed. Missing animation APIs, no-JS content/navigation, initial/live reduced motion, focus interaction, malformed fragments and direct anchors passed focused browser checks. Ten Chrome/Edge form scenarios passed with delivery intercepted. Lighthouse 12.8.2 scores were 96–100 Performance and 100 Accessibility/Best Practices/SEO on home, contact and company registration; every sampled CLS was 0. Screenshots and generated testing reports were subsequently removed at the user's request. See [DELIVERY_REPORT.md](DELIVERY_REPORT.md) for maintenance details and verification limits.

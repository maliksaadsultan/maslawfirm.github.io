# Design and technical research

Research date: 15 November 2026. Completed before implementation. Text/structure observations below come from fetched pages. Temporary reference-site captures were removed after review during the requested cleanup; some sites blocked browsers or text fetches. Motion not actually observed is identified as a proposal, never attributed as verified behavior.

## Professional references

| Direct URL | Verified observation | MAS adaptation / avoid |
|---|---|---|
| https://www.aoshearman.com/en | Expertise is grouped by legal discipline with explicit “all” pathways; editorial topics follow navigation. | Organize the long service inventory into distinct families. Avoid an international firm's enormous menu and excessive nesting. |
| https://www.quinnemanuel.com/ | Practice area directory and regional practices precede substantive litigation content. | Make tax disputes discoverable separately from routine tax filing. Do not borrow their case outcomes or aggressive claims. |
| https://www.farrer.co.uk/ | Audience navigation distinguishes business, private wealth and institutions, with separate legal services. Browser encountered an anti-bot screen. | Lead with visitor needs; retain straightforward service language. No verified visual/motion claims from blocked capture. |
| https://www.macfarlanes.com/ | Service groups, role-specific insights, topical editorial imagery and clear firm introduction. | Separate evergreen guides from service requests. Avoid a rotating news carousel without an editorial team. |
| https://www.withersworldwide.com/en-gb | Modern building facade, concise positioning, audience routes and immediate contact pathway. | Architectural image as a metaphor for structure and forward progress; direct contact. Image must not be labeled the MAS office. |
| https://normcph.com/ | Architecture, design and creative categories support image-led projects with descriptive prose. | Use proportion, tonal imagery and generous composition for the firm story. Avoid a portfolio interface that hides legal text. |
| https://www.pentagram.com/ | Simple top-level navigation, rich categorized work directory, project-first imagery. | Strong service naming and restrained chrome; no unrelated filters or project claims. |
| https://www.kinfolk.com/ | Editorial issue hierarchy, image-led stories and topic groupings. | Deliberate serif/sans distinction and a compact reading section for existing guides. Avoid editorial novelty overwhelming consultation. |
| https://www.bdo.global/en-gb/home | Professional-services themes, separate service/industry discovery and resource summaries. | Present individual and business needs clearly. Avoid an unmaintainable feed of supposedly current news. |
| https://www.siteinspire.com/ | Curated categories explicitly include typographic, grid, minimal and agencies/consultancies. | Use as comparative index for composition; catalog inclusion alone does not verify a reference's accessibility or awards. |

Ten accessible references are listed; no claim that all are award winners. Additional attempted sources: https://www.awwwards.com/ and `/websites/law/` timed out; https://www.recent.design/ was inaccessible; https://www.behance.net/search/projects/law%20firm%20website returned 403; https://dribbble.com/search/law-firm-website was accessible as a concept gallery. Gallery mockups do not prove real responsive behavior. Linklaters, David Chipperfield and Foster + Partners could not be reliably inspected and are excluded as verified examples.

## Why the strongest references work

The useful pattern is clear hierarchy: strong initial proposition, understandable categories, enough content to judge suitability, then an obvious next action. Their scale differs from MAS. A single Taxila office needs a focused local identity, direct phone/WhatsApp access and complete evergreen guides rather than global-office search and continuous publishing.

Creative proposal: a navy split hero combines substantial serif typography with architectural photography. Blue taken from the supplied logo becomes a small action accent. A readable paper-white content area and mixed editorial/service layouts prevent the repeating-card pattern. A short image entrance provides a memorable opening; interactions explain navigation and form states. No invented metrics, badges, reviews, staff or wins.

## Technology evaluation

| Technology / primary documentation | Evaluation and decision |
|---|---|
| GSAP + ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/ | Appropriate for complex pinned timelines and coordinated scrubbing. Static compatible, but adds an execution dependency and ongoing synchronization work. Not needed for this site's restrained reading experience. |
| Motion: https://motion.dev/docs/quick-start | Supports standalone JS, HTML/SVG and WAAPI-backed animation; optional small mini API. Suitable future upgrade if sequence complexity grows. No React migration justified. |
| Lenis: https://github.com/darkroomengineering/lenis | Optional scroll interpolation requires an animation loop and integration decisions. Native scroll gives reliable anchors, keyboard use and mobile behavior. Omit. |
| Three.js: https://threejs.org/ | WebGL adds GPU/memory, fallback and accessibility burden. No legal-service task benefits enough to justify it. Omit. |
| Native CSS + Web Animations + IntersectionObserver | Use transforms/opacity for hero entrance, action feedback and a small number of thematic image/process reveals. Immediate default content; reduced motion bypasses choreography. Best fit for a static site and limited maintenance. |
| SVG | Small original line icons, arrows and a subtle abstract structural motif are inexpensive and scale well. Decorative icons get `aria-hidden`; logo artwork is not redrawn. |

Motion inspiration reviewed: https://tympanus.net/codrops/2026/11/10/kinetic-typography-gsap/ . Proposal takes the principle of orchestration rather than the tutorial's long pinned scroll distances. Avoid splitting legal text into inaccessible character spans, scroll hijacking, perpetual particles, splash loaders, fake counters and hover-only navigation.

## Accessibility and deployment research

Use native disclosure navigation and ordinary links, based on https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/ . A navigation menu is not an ARIA application menubar. Test Escape, focus restoration and touch.

Apply https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md selectively: semantic controls, visible focus, form labels/status, image dimensions, motion preferences, content wrapping and static performance. Plain language and preservation of legal content override purely stylistic preferences.

GitHub static publishing contract: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site . Root `index.html`, original path casing, CNAME and static assets remain sufficient. Remote publishing settings remain unverified.

## Skills and provenance

Installation uses the supplied `skill-installer` helper with commit-pinned public repositories and a workspace-local `.agents/skills/` destination, avoiding global changes. Provenance hashes and discovered paths: `skill-provenance.json`. No third-party lifecycle hooks or cloud deployment scripts are run. Instructions are reviewed as advisory and never override user constraints.

- Anthropic frontend-design: subject-specific design, alternatives before implementation, deliberate type and visible critique.
- Anthropic webapp-testing: real headless Chromium captures and behavior verification, based on rendered selectors.
- Vercel web-design-guidelines: accessibility/performance review of shared templates, CSS and JS.
- UI UX Pro Max: inspect package and apply compatible design-system recommendations; reject unrelated application scaffolding or framework migration.
- Impeccable: inspect package and use critique/refinement vocabulary where compatible. Exact installation/application status is recorded in the final delivery report.

Installed skills are available to the agent on the next turn; instructions read directly are applied in this session. Do not imply package presence alone means compliance or that third-party repositories carry independent security certification.

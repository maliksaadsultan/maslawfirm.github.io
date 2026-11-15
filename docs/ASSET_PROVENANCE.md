# Asset provenance

The exact user-supplied `MAS_LOGO_Nov15_2026.jpg` is preserved: 1254 × 1254, full square, unchanged bytes, no crop/filter/stretch. It appears directly in header/footer and social metadata. White margins remain part of the artwork.

Architecture source: https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=85 . Local responsive WebP derivatives are `assets/design/architecture-{640,1000,1600}.webp`. This is illustrative architecture, never identified as MAS premises or work. The [Unsplash license](https://unsplash.com/license) permits commercial use with stated restrictions. The photo is also identified as Sean Pollock's February 2017 work in [Wikimedia's record](https://commons.wikimedia.org/wiki/File:Low_angle_view_of_skyscrapers.jpg), which links the original https://unsplash.com/photos/PhYq704ffdA and records CC0 provenance. The Unsplash photo page itself was inaccessible during research.

Cormorant Garamond and Manrope came from Google Fonts CSS endpoints. Original SIL Open Font License texts are bundled as `assets/design/*-OFL.txt`. Local WOFF2 subsets cover English and punctuation, total approximately 31 KB. No remote font requests at runtime.

Existing page PNG/WebP graphics and shared assets remain for public URL compatibility. Their original license was not supplied. They may contain old branding/text and appear as optional references, not new evidence of staff or premises. Four absent personal-template images are represented by explicit missing-media text; no original supplied image was deleted.

Interface icons are small original inline SVG paths with consistent strokes and `aria-hidden`. The user logo is not redrawn.

## Independently generated section illustrations

The user subsequently requested a separate image decision for every section and imagegen production for selected sections. `docs/SECTION_IMAGE_REVIEW.md` records 600 heading-level decisions. Twenty-four independent prompts were executed with built-in `image_gen`; a company illustration then received a targeted imagegen edit removing a growth arrow and bars. No API key or CLI image service was used.

Selected original PNGs are in `artifacts/section-image-originals/`; all selected tool files were copied into the workspace and left in their original tool location as well. The unused first-version company draft was removed during the requested cleanup. `content/generated-image-results.json` maps each final original, dimensions, checksum and responsive variants. `docs/GENERATED_SECTION_IMAGES.md` contains the exact independent base prompts and the refinement instruction.

The three WebP widths per selected image are technical delivery derivatives, retaining the generated composition. Illustrations use task-specific models and stationery, with no people, logo edits, government emblems, legal claims, rates or readable official records. Their captions explicitly describe conceptual illustrations. They are not photographs of MAS premises or evidence of registrations, projects or court outcomes.

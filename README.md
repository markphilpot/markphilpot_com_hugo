# Hugo Build Instructions

This blog uses a modified hugo to enable support for `.textbundle` files ([spec](http://textbundle.org)).

## Patch

[Here](https://github.com/markphilpot/hugo/tree/mark/textbundle-support-v2) is a link to the repo and branch (and [here](https://github.com/gohugoio/hugo/compare/master...markphilpot:hugo:mark/textbundle-support-v2) is the specific diff)

## Build instructions

You will probably have to brew install a few things to get a go build environment up and running...

```bash
# Generates a hugo binary without any of the s3 deployment logic for a smaller executable
HUGO_BUILD_TAGS="extended nodeploy" mage hugo

# Builds a x86 linux executable suitable for netlify
# Note: Fixing extended broke the x86 build from ARM.
# You will need to run this in a codespace or VM
CGO_ENABLED=1 go build -tags extended,nodeploy
mv hugo hugo-x64
```

These are saved to an s3 bucket for ease of use (See Makefile). Reminder to set Read permissions on the files in S3 to World.

# Theme Overrides

Theme files are never edited directly. Instead, files from `themes/blowfish/layouts/` are copied
into the corresponding path under `layouts/` and modified there. Hugo's lookup order picks up the
project-level file first, leaving the upstream theme file untouched.

## Conventions

Every override file follows the same pattern:

**1. Header block** — placed at the very top (after any existing file-level comment), listing each
change with a date and one-line rationale:

```
{{/*
  OVERRIDES (from themes/blowfish/layouts/path/to/file.html):

  YYYY-MM-DD: Short description of what changed and why.
  YYYY-MM-DD: Another change.
*/}}
```

**2. Inline markers** — bracket the actual changed lines:

- Structural reorderings → `{{/* OVERRIDE START: description */}}` … `{{/* OVERRIDE END */}}`
- Single-attribute/line changes → `{{/* OVERRIDE: description */}}` on the same line

## Upgrading the theme

1. For each file under `layouts/` that overrides a theme file, diff it against the new upstream version.
2. Use the header block as your checklist — re-apply each listed change to the new upstream base.
3. Update the header block dates/descriptions to reflect the new state.

## Current overrides

| Project path | Upstream path | Changes |
|---|---|---|
| `layouts/_default/_markup/render-image.html` | `themes/blowfish/layouts/_default/_markup/render-image.html` | `not-prose` + `height: auto` on images; `<div>` replaces `<figure>`; caption hidden; `mt-5` wrapper spacing |
| `layouts/_default/list.html` | `themes/blowfish/layouts/_default/list.html` | Responsive prose sizes (`md:prose-lg 2xl:prose-xl`); centered `max-w-fit` wrapper; larger year headings |
| `layouts/_default/rss.xml` | `themes/blowfish/layouts/_default/rss.xml` | `xmlns:content` namespace; `content:encoded` full content; description fallback; improved image matching |
| `layouts/_default/single.html` | `themes/blowfish/layouts/_default/single.html` | Centered header/footer; responsive prose sizes; centered content div |
| `layouts/partials/article-link/card-related.html` | `themes/blowfish/layouts/partials/article-link/card-related.html` | Improved image matching (`**/*` prefix + hero pattern) |
| `layouts/partials/article-link/card.html` | `themes/blowfish/layouts/partials/article-link/card.html` | Improved image matching; commented out empty padding div |
| `layouts/partials/article-link/simple.html` | `themes/blowfish/layouts/partials/article-link/simple.html` | Micro post inline content; date moved above content; title-conditional classes; improved image matching |
| `layouts/partials/article-meta/basic-center.html` | *(new — no upstream equivalent)* | Centered metadata partial for micro post list view |
| `layouts/partials/hero/background.html` | `themes/blowfish/layouts/partials/hero/background.html` | Improved image matching (`**/*` prefix + hero pattern) |
| `layouts/partials/hero/basic.html` | `themes/blowfish/layouts/partials/hero/basic.html` | Improved image matching (`**/*` prefix + hero pattern) |
| `layouts/partials/hero/big.html` | `themes/blowfish/layouts/partials/hero/big.html` | Improved image matching (`**/*` prefix + hero pattern) |
| `layouts/partials/hero/thumbAndBackground.html` | `themes/blowfish/layouts/partials/hero/thumbAndBackground.html` | Improved image matching in both background and featured sections |
| `layouts/partials/home/background.html` | `themes/blowfish/layouts/partials/home/background.html` | Author name without site title fallback; smaller headline; recent-articles moved after blur JS |
| `layouts/partials/recent-articles/content.html` | *(new — no upstream equivalent)* | Homepage content view rendering recent articles via `simple.html` |
| `layouts/partials/recent-articles/main.html` | `themes/blowfish/layouts/partials/recent-articles/main.html` | Heading text removed; `contentView` option added |
| `layouts/partials/term-link/card.html` | `themes/blowfish/layouts/partials/term-link/card.html` | Improved image matching (`**/*` prefix + hero pattern) |
| `layouts/partials/vendor.html` | `themes/blowfish/layouts/partials/vendor.html` | Mermaid also triggered by store; youtubeLite always included |

# Blog Development

```bash
# Run development server
make serve
```

# Favicon

https://lucide.dev/icons/qr-code
https://realfavicongenerator.net

# Colors

https://color.adobe.com

# PaperModX

https://reorx.github.io/hugo-PaperModX/

# Posts

`featuredImage` and `hero` should be 1920x500. `title` is "hidden" & `Export as` is "hero.jpg"

## Maps

```
<script src="https://unpkg.com/maplibre-gl/dist/maplibre-gl.js"></script>
<link href="https://unpkg.com/maplibre-gl/dist/maplibre-gl.css" rel="stylesheet" />

<div id="map" class="wDiv" style="height: 600px; margin-bottom: 2em;"></div>
<script>
  const map = new maplibregl.Map({
    style: 'https://tiles.openfreemap.org/styles/positron',
    center: [-122.43899, 37.790322],
    zoom: 12.37,
    container: 'map',
  })
</script>
```

For positioning:

```js
map.getCenter()
map.getZoom()

// For Quick Access
JSON.stringify(Object.entries(map.getCenter()).map(([ k, v]) => v))
```

## Youtube

```
<lite-youtube videoid="83E0Fl1qkq4" playlabel="Adobe Answers YOUR Questions on AI, Controversies, and Photography! | The PetaPixel Podcast" params="start=1685"></lite-youtube>
```

## Icons

https://icones.js.org

1. Download SVG to `/assets/icons`


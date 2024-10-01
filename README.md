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

These are saved to an s3 bucket for ease of use (See Makefile).

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
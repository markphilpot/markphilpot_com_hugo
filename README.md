# Hugo Build Instructions

This blog uses a modified hugo to enable support for `.textbundle` files ([spec](http://textbundle.org)).

## Patch

[Here](https://github.com/markphilpot/hugo/tree/mark/textbundle-support-v2) is a link to the repo and branch (and [here](https://github.com/gohugoio/hugo/compare/master...markphilpot:hugo:mark/textbundle-support-v2) is the specific diff)

## Build instructions

You will probably have to brew install a few things to get a go build environment up and running...

```bash
# Generates a hugo binary without any of the s3 deployment logic for a smaller executable
HUGO_BUILD_TAGS=extended HUGO_BUILD_TAGS=nodeploy mage hugo

# Builds a x86 linux executable suitable for netlify
HUGO_BUILD_TAGS=extended HUGO_BUILD_TAGS=nodeploy GOOS=linux GOARCH=amd64 mage hugo
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
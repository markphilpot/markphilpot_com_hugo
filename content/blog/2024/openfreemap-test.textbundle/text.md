---
title: 'A Quick Mapping Diversion'
date: '2024-09-29 11:52:00'
tags: [maps, blog]
category: 
slug: 
summary: "Want to make a quick detour to see if I can use a new mapping project on this site: OpenFreeMap"
hero: assets/hero.jpg
featuredImage: assets/hero.jpg
---

Want to make a quick detour to see if I can use a new mapping project on this site: [OpenFreeMap](https://openfreemap.org/)

<script src="https://unpkg.com/maplibre-gl/dist/maplibre-gl.js"></script>
<link href="https://unpkg.com/maplibre-gl/dist/maplibre-gl.css" rel="stylesheet" />

<div id="map" title="wDiv" style="height: 600px; margin-bottom: 2em;"></div>
<script>
  const map = new maplibregl.Map({
    style: 'https://tiles.openfreemap.org/styles/positron',
    center: [-122.43899, 37.790322],
    zoom: 12.37,
    container: 'map',
  })
</script>

It's really an impressive [project](https://github.com/hyperknot/openfreemap).  Essentially static tiles hosted and served directly from a filesystem with no need for a tile server.  They found host with really cheap bandwidth, so fingers crossed they stick around for a while. It's amazing that map technology has come has far as it has (I have not so fond memories of trying to get Esri's ArcGIS software to behave).

## some notes for my future self
To help craft a map while writing a post

```js
// In the Dev Console
map.getCenter()
map.getZoom()

// For Quick Access
JSON.stringify(Object.entries(map.getCenter()).map(([k, v]) => v))
```

There are now `.ewDiv` and `.wDiv` classes for breaking out of the central column[^1].

The [MapLibre GL](https://maplibre.org/maplibre-gl-js/docs/) project handles the javascript side and has a full featured API.  I don't think the stack can do routing, so that's a limitation.

![](assets/hero.jpg "hidden")

[^1]:	In the next blog rewrite, consider a grid layout for the main content area.  This makes it easier to have a main central column, but allow break outs to the edges (inspired from ghost.org)

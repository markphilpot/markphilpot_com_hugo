---
title: "TriAxis & GCP Web Editors"
date: "2015-05-12 11:45:45"
tags: [music, syx, mesa boogie, ground control]
category: blog
slug: web_editor
summary: Web editor applications for TriAxis & Ground Control Pro
---

I recently built two web applications :: [TriAxis Editor](https://triaxiseditor.com) and [Ground Control Pro Editor](https://gcproeditor.com) to try to fill a gaping hole in the modern guitarist tool belt.

Manually configuring the TriAxis and GCP involves a tremendous amount of tedious button pushing and switch toggling. It's hard to see the complete picture at a glance, and building setlist configurations with the GCP was inconceivable. After searching, no one had built editors for these devices. Sure, there were a few older attempts that had been been lost to the Great 404 Internet Monster and still others that no longer ran on modern hardware. I then set out to build a web application that could manipulate the binary System Ex files that were the memory dumps of these devices. Rather than build a desktop application and be limited to a platform that could become obsolete (see Win32) I decided to try to do it as a web application using pure client side Javascript.

This wouldn't not have been possible even a few years ago. The browser APIs to load a local file into local Javascript and the Javascript APIs to manipulate binary data are all relatively recent additions to the web ecosystem.

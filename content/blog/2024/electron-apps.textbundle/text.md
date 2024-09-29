---
title: 'Running web apps in, you know, the browser'
date: '2024-01-14 09:44:00'
tags: [apps]
category: applications
slug: electron
summary: A preference for running web apps in their native environment
hero: assets/hero.jpg
featuredImage: assets/hero.jpg
---

I have zero issues with Electron. As a framework, it gets a monumental amount of flack from those with a *native* bent, and everyone else simply doesn't care.  As a developer, it's not like there is another cross-platform game in town, so if you need to be (or think you'll need to be) on multiple platforms, it would be my recommendation[^1].

That being said, if your app is designed at all as a *web app* first, then I'm more inclined to run it in its native environment: an actual web browser. I use Orion, a webkit browser (Safari's engine) so I can get the best browser experience on the platform I'm currently using.  For the past year, I've been running Slack, Notion, Linear, Discord and others that offer desktop apps in my web browser and I think the experience has been a great compromise[^2].

I do miss ⌥⇥ occasionally, and for any apps where I feel this is necessary, I use Orion's `Install this Site as an App` or Safari's `Add to Dock` though success has been limited here.  The app has to be fairly self-contained (e.g. link handling, both incoming and outgoing can be tricky) and webkit doesn't yet support PWA's on macOS (despite supporting it on iOS).

Out of curiosity, I ran the following command to find what Electron apps I still have on my system:

```bash
 find /Applications -type f -name "*Electron Framework*" | sed 's/\/Contents/%/' | cut -d "%" -f 1
```

What I ended up with surprised me:

```bash
# Electron Apps on my system
/Applications/Visual Studio Code.app
/Applications/Keybase.app
/Applications/1Password.app
/Applications/Plexamp.app
/Applications/Dropbox.app
/Applications/Min.app
/Applications/DaVinci Resolve/DaVinci Resolve.app
/Applications/Obsidian.app
/Applications/Setapp/Renamer.app
```

VS Code is the *prime* example of the Electron framework put to good use; the fact that I can have a VS Code session *in a browser* via [Codespaces](https://github.com/features/codespaces) is remarkable. DaVinci Resolve and Renamer were the two stand-outs as without this search I never would have even thought about what framework they were built with.

Ultimately, that's the point. An app delivers functionality, and I'll go with the app that best does the job I need it to, regardless of what framework it's built with.

![](assets/hero.jpg "hidden")

[^1]:	[Tauri](https://tauri.app) as a fully featured alternative is getting there. I'm currently working on my own Tauri app and seeing if I can get from prototype to production with the limitations it has. Tauri v2 is coming soon, so I have high hopes that it can eventually supplant Electron as my cross platform framework of choice.

[^2]:	Note for webkit browsers: For web apps that rely heavily on websockets (e.g. Slack) you *must* turn off (uncheck) the following setting from the menu:  
	`Develop -> Experimental Features -> NSURLSession Websocket`  
	Otherwise most websocket heavy apps will just stop updating.
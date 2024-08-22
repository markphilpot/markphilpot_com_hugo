---
title: 'Adobe & Lightroom'
date: '2024-08-21 19:54:00'
tags: [lightroom]
category: software
slug: adobe-lightroom
summary: Discussing Lightroom with Adobe's Maria Yap
hero: assets/hero.jpg
featuredImage: assets/hero.jpg
---

![](assets/hero.jpg "hidden")

The folks over at PetaPixel sat down with Maria Yap, Adobe's Vice President of Digital Imaging to "get some answers" around generative AI, subscriptions, and of particular interest to me: Lightroom.

<lite-youtube videoid="83E0Fl1qkq4" playlabel="Adobe Answers YOUR Questions on AI, Controversies, and Photography! | The PetaPixel Podcast" params="start=1685"></lite-youtube>

They almost got to the heart of the issue, but unfortunately the specter of Lightroom Classic got in the way.  There was some constructive discussion around the bifurcation of Lightroom and Lightroom Classic, but of more interest to me is the bifurcation *within* Lightroom itself (formerly CC)[^1].

What I really want to know is why, after all this time, there is such a drastic feature disparity between devices where Lightroom (the cloud version) runs -- in particular what's available on the desktop version of Lightroom and **not** the iPad version:

- Stacks (creation *and* visual acknowledgement of ones created on the desktop)
- HDR Merge
- Panorama Merge

Why are these features still missing? The first one I will never understand, but the next two made sense only before the M-generation of iPads. Maybe large panoramas are just not possible on an SOC with limited RAM, but it's not as if those features are *disabled* on a MacBook Air with 8GB. Additionally, wouldn't it be great to shoot tethered with an iPad? lol, made you look. Tethering isn't supported by Lightroom CC *at all!* (according to the discussion, there are at least *internal* builds of CC that support it? See below on promises made)

I agree with the overall sentiment of the PetaPixel folks: It's time to unify the Lightroom code base and make the cloud features optional. It *has* to be a development drag to support both of these products (Yap admits as much in the discussion).

## it's all about the travel setup

When I travel, I would only take one device (ideally). Currently, that decision is between an iPad and a MacBook of some sort. When I travel, it's always with my camera and I want to be taking photos *and* processing them at my leisure.  While I can almost do the latter on an iPad, with the above missing features, a considerable chunk of my processing workflow is effectively disabled while I'm traveling[^2].

I think if Apple offered an 11" M-series MacBook Air, I would adopt that as my travel computer. Small, light, and fully capable with an operating system and apps that can cover every scenario.  As it stands now, the second-best option would be a 13" Air with 24GB RAM and 1TB SSD for $1800 (:grimace:).  For comparison, the comparable setup with an 11" iPad Air and Magic Keyboard is $1250 (with a lot less RAM than the laptop setup and unfortunately no FaceID). Additionally, this also means giving up cellular support (which is quite nice when you have it built into the device)

## never make decisions counting on future promises

Jumping from Classic to CC was predicated to a significant extent on the promise that the iPad version would reach feature parity with the desktop version (having Lightroom on my phone was just a bonus).  Would I make the same decision knowing where we are now? Probably not, and unfortunately the migration path between the two products is really a one-way street — there is no easy way to move from CC back to Classic.  Additionally, there is no reason to believe Classic has a long-term future — if there is any consolidation within the product line, it will most definitely be in the direction of CC.

## tradeoffs all the way down

I appreciate the convenience of the cloud. Not having to be connected to my NAS to edit photos is a plus. At the same time, there is only *one* cloud. I can't create separate cloud catalogs like I can with Classic. I get it — there isn't a one size fits all solution. Every photographer is going to have their own workflow, and I'm not sure how realistic it is to expect a single piece of software to handle everything (in Adobe's case, they seem to believe for the past decade that they might be able to do with two versions).

[^1]:	I actually understand the division of features between Lightroom and Lightroom Classic and I applaud Adobe for keeping Classic around as long as it has.  Most other companies would have jettisoned it long ago in the name of progress and a single code base.

[^2]:	We also have to set aside that without a proper terminal environment, I can't do work exclusively on an iPad either. Codespaces help, but aren't enough when push comes to shove.
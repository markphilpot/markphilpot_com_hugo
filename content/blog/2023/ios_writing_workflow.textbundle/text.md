---
title: 'iOS Writing Workflow'
date: '2023-02-01 00:00:00'
tags: [writing]
category: software
slug: ios-writing-workflow
summary: 
hero: assets/hero.jpg
featuredImage: assets/hero.jpg
---
![](assets/hero.jpg "hidden")

This is a static blog powered by markdown files. The files live in a git repository, and a build process turns those markdown files into the site you are reading now. This has proved tricky to have a writing workflow that can be done completely from iOS, but as this test will hopefully prove, it can be done.

## software used

**Ulysses** for writing. The app supports both macOS and iOS and I already use it for writing this blog on the desktop and publish short posts via [Micro.blog](https://micro.blog)

**Working Copy** for git management. It would be nice to have a command line environment that *also* integrates with the Files app, but it’s a good gui app.

**Photoshop** for image editing. Procreate might be a better option for this, but this is mostly force of habit.

**Netlify** for building and hosting.  Netlify has a PR process to create a preview site based on a PR branch. That way I can preview what this post will actually look like once it’s done without pushing it to the real site.

## wiring it all together 

Ulysses supports external files, so I can clone the repository in Working Copy and I can open the content directory in Ulysses. I’ve already configured my static site to build `.textbundle`files which is how Ulysses bundles markdown and images together.

Once I create the initial post, I start a new branch, push up a commit and create a new pull request in Github. This causes Neflify to create a new preview site where I can see what the post will ultimately look like.

It’s not exactly a “quick” turnaround — my blog takes about 2 minutes to generate.  However, it’s absolutely doable and I didn’t have to leave my iPad to do it. A few more editing rounds and I can merge the PR into the main branch and the post will appear on this site a few minutes later.

## what could be better

A basic command line environment (that isn’t done via emulation like [iSH.app](https://ish.app)) and package system would be the ultimate proverbial “multiple birds, one stone.”

Having to push a commit to see the built output adds quite a bit of overhead. A full development environment (with node support) would go a long way. Github Codespaces is an option when I have to do “under the hood” maintenance on the site.  However, both scenarios require an internet connection to fully iterate — it would be nice to have a local option.

I miss my TextExpander shortcuts. Definitely one of those things you don’t notice how much you actually rely on it until it’s not available.
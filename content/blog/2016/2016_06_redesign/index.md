---
title: "Redesign"
date: "2016-03-03 23:16:00"
tags: [thoughts]
category: blog
slug: redesign
hero: hero.jpg
featuredImage: hero.jpg
---

It's been quite a while since I manually built a blog theme from scratch. I had definitely forgot how painful it is to build up all your CSS from scratch. I never quite got my workflow perfected, mostly because [pelican](https://blog.getpelican.com/) (my static blogging engine) takes a full 20 seconds to regenerate the site. Additionally, I actually spent a bit of time going back over old posts and optimizing them for the new layout (mostly to do with image handling). One stylistic difference that I'm still debating is justified or ragged-right. I think sans serif fonts looks better ragged-right, so that's what I'm starting with, but I've definitely flip-flopped a few times.

So far I haven't made any attempt at making the theme reusable. I used my [previous theme](https://oncrashreboot.com/elegant-best-pelican-theme-features) as a guide and was floored by the sheer number of features required to make a true general purpose theme. I only implemented the bare minimum to get to WYSIWYG -- I completely ignored `tags.html`, `categories.html` and a bunch of others.

I decided not to paginate `index.html` yet: the text of the page is only 116KB now, but that will be something I should monitor. Loading `index.html` transfers 238KB to start with. I'm not sure what ceiling should be, especially with 'big' blogs & sites heading into the MBs for the initial page. For reference, [Daring Fireball](https://daringfireball.net/) is only 82KB while Khoi Vinh's blog [subtraction.com](https://www.subtraction.com/) transfers 4.3MB -- I figure as long as I am in between those two I should be OK.

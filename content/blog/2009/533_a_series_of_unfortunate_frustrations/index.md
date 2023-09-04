---
title: "a series of unfortunate frustrations"
date: "2009-05-07 13:43:37"
tags: [imported, ubuntu, ati]
category: blog
slug: a_series_of_unfortunate_frustrations
---

<div style="margin: 15px; float: right"><a href="https://www.flickr.com/photos/37136574@N00/56910709/" title="On my desk" target="_blank"><img src="https://farm1.static.flickr.com/29/56910709_211b54674e_m.jpg" alt="On my desk" border="0" /></a></div>

Kubuntu 09.04 (Jaunty) has been an absolute pleasure to use on my home desktop. Everything just works, and works really well. I happen to choose an Nvidia graphics card when I put it together. Turns out that was a very good decision.

Lets turn to my laptop (a Thinkpad T42). It has an ATI Radeon Mobility 9600 inside. There is a semi decent open source driver implementation that it used by default. However, for some reason I'm running into crashes. Ubuntu upgraded their Xorg X server, so ATI's Catalyst driver (version 9.3) no longer works. Theoretically, this should be fine -- ATI is coming out with version 9.4 -- however ATI made the <a href="https://www.overclockersclub.com/news/24167/">decision</a> not to support their older cards with version 9.4! And they've said they won't update their 9.3 driver to work with the latest Xorg version! Arg!

I think I'm basically <a href="https://learn-live.blogspot.com/2009/04/why-you-should-avoid-putting-ubuntu.html">screwed</a>. Any new linux install (no matter the distribution) will have this latest Xorg -- there is just no way I can use this laptop with the latest distros! I'm probably going to reinstall it with 08.10 (Intrepid) so at least I have a functioning laptop.

I wonder... will ATI's 9.3 driver work with Windows 7? If it doesn't, they are also screwing over all the Windows users out there to the same fate.

<small>Photo: <a href="https://www.flickr.com/photos/37136574@N00/56910709/" title="zopeuse" target="_blank">zopeuse</a></small>

---
title: "GNU Screen Cheat Sheet"
date: "2009-05-03 22:41:23"
tags: [imported]
category: blog
slug: gnu_screen_cheat_sheet
---

<div style="margin: 15px; float: right"><a href="https://www.flickr.com/photos/63987143@N00/136624928/" title="night rising" target="_blank"><img src="https://farm1.static.flickr.com/53/136624928_291b73cbe8_m.jpg" alt="night rising" border="0" /></a></div>

My normal modus operandi is to heavily use tabs with Konsole. My strategy gets pretty hectic when you have a Konsole per machine with multiple tabs, trying to juggle everything... It's basically reached it's scalability threshold. I'm hoping injecting <a href="https://www.gnu.org/software/screen/screen.html">GNU Screen</a> into my workflow will simplify things a little bit (though I'm not completely sold yet). But what I need a quick reference for all the shortcuts, which is where this page comes in. I will expand this as I pick up new commands.

Note: Italics indicate regular expressions

<h3>Windows</h3>

* <strong>New Window</strong> Ctrl+a c
* <strong>Last Used Window</strong> Ctrl+a Ctrl+a
* <strong>Prev/Next Window</strong> Ctrl+a <em>[np]</em>
* <strong>Goto Window</strong> Ctrl+a <em>[0-9]</em>
* <strong>Change Window Title</strong> Ctrl+a A

<h3>Sessions</h3>

* <strong>Detach Session</strong> Ctrl+a d
* <strong>Reattach Session</strong> screen -r

<h3>Console Copy & Paste</h3>

* <strong>Enter C&P Mode</strong> Ctrl+a [
* <strong>Begin Selection</strong> Enter
* <strong>End Selection</strong> Enter
* <strong>Paste</strong> Ctrl+a ]

<h3>Monitor</h3>

* <strong>Toggle Silence Monitor</strong> Ctrl+a \_
* <strong>Toggle Activity Monitor</strong> Ctrl+a M

<small>Photo: <a href="https://www.flickr.com/photos/63987143@N00/136624928/" title="concretecandy" target="_blank">concretecandy</a></small>

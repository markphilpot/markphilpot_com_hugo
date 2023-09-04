---
title: "firefox corruption issue (w/ fix)"
date: "2009-04-27 22:17:00"
tags: [imported]
category: blog
slug: firefox_corruption_issue_w_fix
---

If you are seeing the following error:

`Error: uncaught exception: [Exception... "Component returned failure code: 0x8007000e (NS_ERROR_OUT_OF_MEMORY) [nsIDocShellHistory.useGlobalHistory]" nsresult: "0x8007000e (NS_ERROR_OUT_OF_MEMORY)" location: "JS frame :: chrome://browser/content/browser.js :: prepareForStartup :: line 764" data: no]`

<div style="margin: 15px; float: right"><a href="https://www.flickr.com/photos/59468914@N00/1025248778/" title="Panda rouge / Red Panda" target="_blank"><img src="https://farm2.static.flickr.com/1288/1025248778_b19c611d8c_m.jpg" alt="Panda rouge / Red Panda" border="0" /></a></div>

Symptoms: When you start firefox, it doesn't take you to your home page. Your home button doesn't work or takes you to a different site.

Try the following:

<ul>
	<li>Go to your profile directory ($HOME/.mozilla/firefox/99fjsklfs.default)</li>
	<li>mv or delete places.sqlite and places.sqlite-journal</li>
	<li>Take a peek in the bookmarkbackups folder and remove any zero length files</li>
	<li>Restart firefox</li>
</ul>

<small>Photo: <a href="https://www.flickr.com/photos/59468914@N00/1025248778/" title="meantux" target="_blank">meantux</a></small>

---
title: "old picture posts"
date: "2007-03-02 21:25:38"
tags: [imported]
category: blog
slug: old_picture_posts
---

After resorting all my posts into new categories, I realize every single one of my old posts that included a picture from my gallery don't work anymore. If I remember correctly, I had some sort of plugin that took care of that and its no longer installed. I'm going to try to go back and fix them this weekend.

Right now I'm testing out a new plugin (<a href="https://https://wpg2.galleryembedded.com/" title="Nifty integration, I must say">WPG2</a>) to help embed gallery images into posts. It has also forced me to abandon my FCKeditor (Chenpress) for the default TinyMCE editor that comes with Wordpress. So far, I can't say its nearly as reliable, but I'll give it a chance for a while.

In keeping with spirit, there's a lunar eclipse out tonight. I'm not sure it was visible in North America (I only heard it was going to be visible in Asia), but should be nice regardless.

Two weird things about this plugin. It seems like the default link it shows is an embedded gallery page within wordpress rather than a link to the actual image over in gallery. It might be tweakable, but I'm not sure. At least WPG2 allows wordpress and gallery to be in separate domains, which most plugins I've used have always choked on. It has also made me realize I need to clean up the titles in my gallery. Getting sloppy, I think.

So after some tweaking, I think I've arrived at something I'm fairly happy with (at least at this late hour). I want to try to work on the CSS a bit more (and clean up the gallery). Hopefully I'll also get some more images posted soon.

<em>Update</em> -- Thanks to Jeff for the update on the Wordpress 2.1.1 <a href="https://wordpress.org/development/2007/03/upgrade-212/" title="Definitely not good">vulnerability</a>.

<em>Update<sup>2</sup></em> -- There is a bug in g2image with current versions of TinyMCE. The function switchClassSticky doesn't exist in newer versions. However, it seems if you just comment out references to it in editor_plugin.js, it fixes the issue of the bold, italics (and the rest) not working. The easiest way is to copy editor_plugin_src.js to editor_plugin.js and make the edits (should only be two references as far as I can tell).

---
title: "Within Temptation - What Have You Done (Twilight)"
date: "2009-04-16 23:10:03"
tags: [imported, todo]
category: blog
slug: within_temptation_what_have_you_done_twilight
---

So due to a short sighted WMG, I'm hosting this new video myself. I've had to compress it down a bit more that I would like (though should still look OK at full screen), and the FlowPlayer logo is a little obtrusive (but I'm not yet sure how often I'll need to host these myself, so I'm hesitant to buy a full license... great piece of software though). I still can't believe WMG universally pulled out all their content.

I had this song pared with Twilight long before the movie actually came out. I thought it went pretty well together. This is another video done entirely with kdenlive, a fantastic KDE4 based non-linear video editor. Things are definitely improving since I last tried using it. The one thing I still wish it could do is overlapping transitions. The title text has an alpha transparency and I wish I could add a luma (fade in/out) transition to it. Other than that, I'm officially off of Windows for doing video editing.

Note: FlowPlayer didn't like the h.264 files kdenlive was generating, and for some reason the flash rendering wasn't working. I generated the h.264 mp4 file and then manually converted it to flv

```bash
./kdenlive/bin/ffmpeg -i untitled.mp4 -vcodec flv -acodec libmp3lame -ab 128k -ar 44100 -b 2000k untitled.flv
```

---
title: "Windows 7 & Kubuntu 10.04"
date: "2010-05-03 15:20:25"
tags: [imported]
category: blog
slug: windows_7_kubuntu_10_04
---

So over the weekend I refreshed my desktop with both Windows 7 and the latest Kubuntu release. While I have been religiously upgrading the linux side of my dual boot system every 6 months with the [k]ubuntu release schedule, I was still running Windows XP which hadn't been reinstalled in about 3 years (it was quite sluggish and desperately needed a spring cleaning). While I didn't do a live blogging of the process, I thought I'd recap some highlights.

<h3>Windows 7</h3>

Since Windows still doesn't support dual booting into linux, I starting laying down Windows 7. I choose the Home Professional Upgrade variant and chose to make the jump to amd64. First thing I noticed is that the install process took forever (more than twice as long as installing Kubuntu a few hours later). While in general this doesn't rank high on discretionary criteria, I had become spoiled by how quickly I can reinstall linux after doing it every six months.

I was pleasantly surprised that it automatically found working drivers for everything (though there is still one unidentified USB device which is bugging me), which was nice having my dual monitor setup working from the start. I still had to download updates for the video and audio drivers, but everything else went smoothly.

It's a little disheartening to have to relearn everything (especially trying to find things in the new fragmented Control Panel), but I'm assuming with the help of Google, I can figure most things out.

The Windows side of my install only gets used for games (Steam) and Photoshop CS3 work, so it really don't have excel at very much =)

<h3>Kubuntu 10.04</h3>

Installation was fast and smooth. I installed the updated nvidia drivers (which borked the bootsplash screen, but that bug is already fixed pending release in the update repositories). Installed Flash 64bit and struggled with the same sound issue that happens every install (for some reason, the audio channels that Flash uses are muted by default in Kubuntu. You have to go into the mixer and fix the muting and volume and then everything works great).

I followed the nice tutorial <a href="https://dreadknight666.com/2009/07/dropbox-in-kde-linux/">here</a> or <a href="https://antrix.net/journal/techtalk/dropbox_kde.html">here</a> to get dropbox working without Nautilus.

Also, Ubuntu decided to move sun-java6 over to their partner repository (which unfortunately isn't enabled by default). While <a href="https://openjdk.java.net/">OpenJDK</a> might one day become an adequate replacement, I just don't think it is yet, so in KPackageKit open up the Software Sources dialog and enable the partner repository under Third Party Software.

Additionally, there are some python-gtk imports that prevent <em>nvidia-settings</em> from merging the xorg.conf file (after you run <em>nvidia-xconfig</em>), so be sure to run it from the command line first to see the errors. It would be nice if Kubuntu included the python-gtk bindings by default.

There is also a rather annoying <a href="https://bugs.launchpad.net/ubuntu/+source/polkit-kde-1/+bug/573297">bug</a> (which I filed) where the authorization window when installing software appears behind all the others. Frustrating, but no big impact.

In conclusion, I was surprised overall by how smoothly the process went (on both sides). There was a lot of prep that went into this in backing up everything to my network drive, so a quick process it wasn't, but no catastrophes, which is always appreciated.

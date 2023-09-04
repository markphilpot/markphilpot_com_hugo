---
title: "Disaster Recovery (Passwords)"
date: "2015-11-29 11:27:00"
tags: [recovery, 1password]
category: blog
slug: disaster_recovery
summary: How would you go about recovering from a disaster
---

_Imagine a disaster situation where you no longer have access to **any** personal electronic device. No phone, none of your laptops, desktops, etc. They've all been destroyed in a fire/earthquake/flood/alien invasion. Does your password system allow you to regain access to your online accounts?_

It occurred to me that unfortunately my answer to this scenario is no.

First off, any account that has 2FA enabled you are screwed if you loose your phone unless you can get manual access to the recovery codes.

Currently, I keep all my passwords _and_ recovery codes in 1Password sync'd via Dropbox. That means I need to be able to get to my Dropbox account without an existing 1Password setup. I've already failed there. If I had no device with 1Password and Dropbox already installed, I can't bootstrap a new device.

As a result of this thought process, I went into 1Password and printed my Dropbox username/password/recovery codes and placed a copy in my safe. Unfortunately this doesn't help if my home is destroyed in a fire/earthquake. The obvious option is to print a second copy and give it to a relative for safe keeping. However, most of my family live in the Bay Area, so a 9.0 earthquake that affects me will affect them as well.

I could encrypt a file and store it in a public Amazon S3 bucket I guess. I don't really have a great solution for that yet.

1Password still offers access to your vault through [1PasswordAnywhere](https://support.1password.com/guides/mac/1passwordanywhere.html) when you don't have the 1Password software installed, but that recently had some [controversy](https://discussions.agilebits.com/discussion/21689/dropbox-1passwordanywhere-secure) around it. However, as long as it's offered, I will use that as my means of accessing my vault in this situation.

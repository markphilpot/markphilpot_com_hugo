---
title: "an ipod with a dash of rockbox"
date: "2007-02-21 17:45:27"
tags: [imported, apple, jailbreak]
category: blog
slug: an_ipod_with_a_dash_of_rockbox
---

As I indicated in a previous post, this past Christmas I was gifted a 30GB Video iPod. I had bought one for Ann (a Nano) almost a year earlier, and had "borrowed" it on occasion. Its interface was much better than almost anything else out there (hence its incredible success in the marketplace), but I was hesitant. Being firmly against DRM the integration with iTunes Store did nothing for me. I also didn't want to be tied to a platform (be it AAC, or anything else). But there is simply no denying what Apple has put together with its iPod line.

Enter in a host of dedicated open source programmers and you really unleash the iPod potential.

First of all, <a href="https://www.rockbox.org/">Rockbox</a> is an open source firmware for the iPod and many other mp3 players (having been originally formed around the <a title="Never tried one personally" href="https://en.wikipedia.org/wiki/Archos">Archos</a> MP3 player). For the sake of this discussion, I'll focus only on its relationship with the iPod. It basically turns the iPod into a dual booting platform... You are not forced to give up the Apple firmware if you don't want to (and I describe later, you actually need it).

Using only the controls the iPod provides, they are able to pack an incredible amount of features (in true open source spirit) that at first it is incredibly overwhelming. There is a reason the iPod lacks the power and these features. It was designed to be as simple as possible (even to a fault, in my opinion). It can't intimidate anyone, and if you didn't want to read the manual, you could (somewhat) intuitively make your way around its user interface. This is not the case with Rockbox. The manual now becomes required reading as you have to unlearn some of the UI behaviors of Apple's firmware in favor of something more complex, but in the end, much, much more powerful. Let me make a few points right off the bat --

<ul>
    <li>Rockbox is a must if you are visually impaired -- There is a great feature that they include that will speak the names of the directories or files to aid in navigation. I personally have it turned off, but if you stop and think about it, there is nothing on the market that can meet the needs of this group. I believe accessibility was one of the main founding points of Rockbox.</li>
    <li>If you already have a collection of music in a non-MP3 format (FLAC, Ogg, etc), it means you can still take advantage of all the great hardware components and interface the iPod gives you. Rockbox is a non-question.</li>
</ul>

I don't personally fall into either category. I actually like iTunes itself and the workflow of getting your existing CDs onto the iPod. But what Rockbox gives me is more control over the player and the ability to skin it. Don't belittle the last point off hand. When you put a good dark skin on a black iPod... Wow. What a huge difference it makes.

Rockbox gives you two ways to organize your music -- File View and Database. When you connect your iPod to your PC, you can use your own custom directory structure to navigate (File) or use the ID3 tags in the files themselves to create a hierarchy (Database). The latter much more closely resembles the original iPod interface, and the one which I prefer.

So the first issue is that if you use iTunes to rip your CDs you run into the frankly mind-blowing problem that Apple decided to use a proprietary database format and filename obfuscation to hide everything from the user. I personally think this is belittling and it down right sucks. Once again, open source to the rescue -- the Database view just parses the entire drive and creates an internal tag database based on ID3 tags within the files themselves. So what you are left with is...

<ul>
    <li>Reboot the iPod with the original firmware</li>
    <li>Connect it to the PC and start iTunes</li>
    <li>Use iTunes to rip your CDs to the iPod</li>
    <li>Restart the iPod</li>
</ul>

Not too bad. You basically retain equal functionality in both modes, so you never end up sacrificing anything.

After a few weeks of use, let me comment on a few things. If you are used to the traditional Apple interface, you will have to unlearn it, as the rockbox interface has enough differences that can frustrate you. However, once you play with it bit and you aren't using the muscle memory for Apple's interface, rockbox makes sense. Remember, its much more powerful and had orders of magnitude more options it has to fit in the same package. Bottom line, it's worth relearning.

KEY FEATURE -- The "Next" on the main WPS (While Playing Screen) showing you the upcoming song! Why Apple doesn't have this blows me away. For this reason alone its a huge improvement, especially in Shuffle mode.

I haven't pushed the battery let, but I don't think it gets the same performance (yet). The developers haven't added the code to have an accurate battery reading for the iPod yet, but hopefully that will come soon. Regardless, it has more than enough to get me through the day. The first time I'll have a chance to stress test it is my next business trip. I'll keep you posted on that one.

<em>Update</em> -- After more use, I have a better feel of the battery life. The iPod Video's specs put it around 20 hrs or so. I would say rockbox currently can get 60% under normal use, and if you just shuffle and don't navigate very much, that would only go up. I would imagine the battery performance will get better with time, but it still is less than a standard iPod. (Let me also point out that Rockbox <em>extends</em> the battery life on other players that they've had time to optimize for. I'll keep you posted).

Let me again emphasize the ability to skin the interface. It really makes a difference (add to that the ability to customize your custom skin!) I'm also a fan of maximizing screen real estate. Depending on the skin, you end fitting much more on the screen than a traditional iPod.

The last (small) issue is that I haven't figured out how to properly tweak the scroll wheel. Oh it works fine, but it doesn't have the nifty acceleration feature the original firmware had (which was both a blessing and a curse and anyone who's used it would know). I'm still tweaking it figure it out.

Bottom line... I'm not going back. I might switch back (ahhh the wonders of dual booting) if I know I'm not going to go a long time between charges, but Rockbox has won me over.

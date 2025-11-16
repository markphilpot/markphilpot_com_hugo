---
title: "First Post"
date: "2014-03-31 21:13:00"
tags: [imported, first]
category: blog
slug: first-post
summary: First Post
---

![Flickr Embed](https://farm8.staticflickr.com/7396/11499467863_35b58084ea_z_d.jpg "Superman") <br/> <small class="caption-text muted">Photo by <a href="https://www.flickr.com/photos/markphilpot/">Mark Philpot</a></small>

I think this is how I feel every time I try to get ramped up to start/restart/begin/continue blogging. It always starts with noble intentions.

This first post will be where I experiment with pelican's capabilities and how best to use markdown.

The code block below has no line numbers[ref]This is a footnote[/ref]

    :::bash
    function k
    {
        level=$1
        cdback=""
        for i in `seq 1 $level`
        do
            cdback=$cdback"../"
        done

        cd $cdback
    }

where as this one does

    #!bash
    function k
    {
        level=$1
        cdback=""
        for i in `seq 1 $level`
        do
            cdback=$cdback"../"
        done

        cd $cdback
    }

Back ticks allow you to `highlight` section.

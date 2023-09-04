---
title: "Blog Import - Lessons Learned"
date: "2015-11-29 10:25:00"
tags: [blog, lessons learned, pelican, wordpress]
category: blog
slug: blog_import
summary: Lessons learned importing a 12 year old blog
---

So I have been blogging (very irregulary) since 2003. If I remember correctly, I dabbled with [Movable Type's](https://movabletype.org/) platform before eventually settling on [Wordpress](https://wordpress.org/). When I recently transitioned to using [Pelican]() as a static blogging engine, I didn't bother to import posts from my wordpress installation (for one thing, the Pelican import tool only operates on a wordpress XML export and I just had a database backup).

Over the holidays, I decided to make an attempt at converting all that content to markdown. It's been a challenge, but I was able to pull over most of it.

First, I needed a quick script to pull posts from `wp_posts` in a wordpress database. I came up with the following:

```python
import MySQLdb as sql
import MySQLdb.converters as converters
import os
import traceback

def connect():
    cnx = sql.connect(host='127.0.0.1', user='root', passwd='root', db='blog')
    return cnx

def write_post(row):
    try:
        year = row['post_date'].year

        if not os.path.exists('content/%s' % year):
            os.makedirs('content/%s' % year)

        with open('content/%s/%s_%s.md' % (year, row['ID'], row['post_name'].replace('-', '_')), 'wb') as fp:
            fp.write('Title: %s
' % row['post_title'])
            fp.write('Date: %s
' % row['post_date'])
            fp.write('Tags: imported
')
            fp.write('Category:
')
            fp.write('Slug: %s
' % row['post_name'].replace('-', '_'))
            fp.write('
')
            fp.write(row['post_content'])
            fp.write('
')
    except Exception, e:
        print(e)
        traceback.print_exec()
        exit()

if __name__ == '__main__':
    cnx = connect()

    with cnx:
        cursor = cnx.cursor(sql.cursors.SSDictCursor)

        cursor.execute("""
            select ID, post_date, post_title, post_name, post_content from wp_posts where post_status = 'publish';
        """)

        rows = cursor.fetchmany(size=10)

        while len(rows) > 0:
            for row in rows:
                print(row['post_name'])
                write_post(row)

            rows = cursor.fetchmany(size=10)
```

There was more post processing that I should have done in this script (removing some legacy html tags, join with the tags table to populate that field). I came up with a few regex patterns and used Atom to do a search and replace within the content path and I ended up just going through all 300+ posts and re-tagged and re-catorgorized them.

Below are the biggest takeaways from this process:

* There was a very clear demarkation line when Firefox finally included a spell checker in the browser (either that or wordpress finally included one, I can't remember). It was really, _really_ bad -- My previous self obviously made no attempt to proof read this shit even though I know I'm a horrible speller. For crying out loud, it's **finally** not <del>finially</del>
* I used a bunch of gallery plugins which inline converted a tag (`<wpgid>32</wpgid>` for example) into an inline image. Well that doesn't really help once that plugin is gone. If you want _anything_ to last, statically host your own images or link to images on services you control yourself ([flickr](https://www.flickr.com/photos/markphilpot) for example)
* It's amazing how few links pre-2010 are still resolvable. At the end of this I'm planning on making a donation to the [Internet Archive](https://archive.org/index.php) -- it's a much needed service for preserving this sort of thing. Down the road I want do develop a plugin that goes and checks old links and if it's dead replace it with a link to the Internet Archive. In fact, I wonder if there is a browser plugin to do that for you.
* There was a lot of quite embarrassing stuff that my older self was thinking at the time. I _really_ hope I've grown wiser with age.
* Remember [imeem](https://en.wikipedia.org/wiki/Imeem) or [grooveshark](https://en.wikipedia.org/wiki/Grooveshark)? So many services fallen by the wayside. If you run a blog and you want your posts to last from a historical perspective, you need to host everything. Minimize any reliance on third party services. At _some_ point, even youtube links won't work. I realize this is unrealistic so the best you can probably do is a) not link or embed third party sources or b) choose a few select providers (e.g. soundcloud => audio, youtube => video, flickr => images) so that it's easier to transition away in bulk if it is ever needed.

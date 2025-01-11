---
layout: post
microblog: true
guid: http://mphilpot.micro.blog/2022/04/03/currently-exploring-if.html
post_id: 1537732
date: 2022-04-03T20:08:13-0800
lastmod: 2022-04-03T20:08:13-0800
type: post
images:
- https://cdn.uploads.micro.blog/64442/2022/41e02ee836.png
photos:
photos_with_metadata:
#url: /2022/04/03/currently-exploring-if.html
twitter:
  id: 1510831584013918212
  username: 
---
Currently exploring if I can somehow have gatsby render `textbundle` packages out of the box. On the surface, as long as you obey the [spec](http://textbundle.org/spec/), it seems it will work. I even got my "extra wide image" title hack to work.

![](https://micro.markphilpot.com/uploads/2022/41e02ee836.png)

Things get wonky when you actually open it with your writing application of choice (I'm using Ulysses). The problem is that assets that aren't explicitly referenced as images in `text.md` are unceremoniously removed, which is problematic if you want to have an image referenced in your frontmatter. Even files saved as peers of `info.json` and `text.md` are wiped upon saving (my guess is that Ulysses is rewriting the TextBundle as effectively a blob on every save). Ulysses has a notion of "Attachments" but it doesn't seem to be implemented for editing TextBundles.

My workaround for that is to use my "extra wide image" hack to use the image "title" as `hidden` to trigger a CSS `display: none` rule. That way can just include the image at the beginning of the document so it wont get cleaned out.

On a few smaller notes, Ulysses uses reference style links instead of inline as their "backing store" -- not the end of the world. Additionally, their handling of frontmatter formatting (an excessive need to escape certain characters) could prove a problem if can't get it to stick. From what I can tell, as long as I don't open the raw file *outside* of Ulysses, it *should* be fine :shrug:


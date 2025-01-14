---
slug: 'posse-thoughts'
date: '2025-01-13T21:58:28'
showReadingTime: false
---

Now that have unified the "essay" (long-form) and "micro" (short-form) content here, I've been thinking how I want to handle the syndication aspect. The easiest option is service pipe on the RSS feed (EchoFeed, n8n, etc) but you give up a degree of control or one-size-fits-all unless you divide up your blog into multiple RSS feeds depending on the content. I'm thinking now that having a set of scripts that act on the markdown of the post instead might be a better.  By way of an example, this "meta discussion" post doesn't make sense syndicated to Mastodon & Bluesky and would be tedious to mask from a pipe service.
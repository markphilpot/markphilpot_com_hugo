---
layout: post
microblog: true
guid: http://mphilpot.micro.blog/2021/01/12/steps-to-write.html
post_id: 1726979
date: 2021-01-12T12:59:00-0800
lastmod: 2022-11-17T23:04:29-0800
type: post
#url: /2021/01/12/steps-to-write.html
showReadingTime: false
---
Steps to write a new static micro post:

```
yarn newPost micro
# Edit index.md in Caret
yarn start # Verify
git add .
git commit -m "new micro post"
git push
```

Doesn’t seem too bad for now. I think I’m going to start a new app that allows me to do all those things from a single form in the menu bar. The more I can treat the entire process as atomic, the more I think I’ll use it.

Even better, generate a twitter compatible summary, add a back link and post to twitter.

Update — iSH.app now supports node! I can at least now edit markdown files via the command line on an iPad now. Going to see if I can get gatsby to actually run and connect to localhost…

Note to self: I do need to update my vim configuration, but for the moment I can actually edit the markdown files in Byword on the iPad since iSH exposes it’s filesystem to the Files system.

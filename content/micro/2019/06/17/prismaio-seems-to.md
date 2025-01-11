---
layout: post
microblog: true
guid: http://mphilpot.micro.blog/2019/06/17/prismaio-seems-to.html
post_id: 1726984
date: 2019-06-17T21:51:00-0800
lastmod: 2022-11-17T23:06:58-0800
type: post
#url: /2019/06/17/prismaio-seems-to.html
---
prisma.io seems to fail very quickly on even the most basic SQL types. I think if you are doing a project from scratch and you have a very vanilla data model, Prisma might make sense. However trying to pair it with an existing database, you quickly find out where all the assumptions in the abstraction break down.

Decided to go with `knex` + `apollo-server` as flexible SQL abstraction and feel it's just at the right level.

_Sidenote:_ Being forced to deal with a data model I built **17** years ago (and _really_ didn't know what I was doing) is really trying my patience not to just say "burn it down" -- How many people have something still in production they wrote 17 years ago?

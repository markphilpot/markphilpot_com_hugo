---
title: "Install Adobe AIR Linux 1.5 on 64-bit Linux distributions"
date: "2009-04-27 00:45:53"
tags: [imported]
category: blog
slug: install_adobe_air_linux_15_on_64_bit_linux_distributions
---

So Adobe has this knowledge base article -- <a href='https://kb.adobe.com/selfservice/viewContent.do?externalId=kb408084'>Install Adobe AIR Linux 1.5 on 64-bit Linux distributions</a> -- to describe how to install Adobe Air on 64 bit linux systems. Do yourself a favor -- just install <a href="https://www.winehq.org/">wine</a> from the standard repositories, and then execute the last line in the instructions:

```bash
sudo cp /usr/lib/libadobecertstore.so /usr/lib32
```

Wine already sets up a complete 32bit compatible environment, so you don't have to worry about manually breaking out shared libraries.

---
title: "Eclipse 3.5 & Ubuntu 9.10"
date: "2009-11-11 23:12:21"
tags: [imported, ubuntu, eclipse]
category: blog
slug: eclipse_3_5_ubuntu_9_10
---

<a href="https://www.norio.be">This</a> guy just saved my sanity! If you are running Eclipse 3.5 and are noticing "funny" behavior (buttons not working, certain fields not appearing), then follow <a href="https://www.norio.be/blog/2009/10/problems-eclipse-buttons-ubuntu-910">these</a> instructions.

> It looks like Eclipse is doing some <del>nasty stuff</del> advanced hacking in SWT on GTK. This bug is fixed in 3.6M2 but you can work around the issue in Eclipse 3.5 by launching Eclipse through the following small shell script (assuming Eclipse is installed in /opt/eclipse-3.5):

```bash
#!/bin/sh
export GDK_NATIVE_WINDOWS=1
/opt/eclipse-3.5/eclipse
```

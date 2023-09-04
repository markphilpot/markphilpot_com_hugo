---
title: "the legacy of dos"
date: "2007-03-22 00:39:07"
tags: [imported, java, c++]
category: blog
slug: the_legacy_of_dos
---

Let me just say that developing cross-platform software is one of the more royal pains out there. Java, built from the ground up with cross-platform in mind does a better job than most to maintain a level of abstraction for the developer. However, a universal sticking point is what character the directory separator is.

Unix, the Web, and the rest of the sane world use '/' to separate directories. This makes sense, since in most modern (hell, nearly all) programming languages, the '\' is used as a prefix to an escape character. So the following looks acceptable:

```c
char * file = "/home/mark/input.txt";</code>
```

However, Windows, tipping its hat to is DOS legacy, has retained the '\' for directory separation, much to the consternation of the entire software community. <a href="https://blogs.msdn.com/larryosterman/archive/2005/06/24/432386.aspx" title="Very insightful">Here</a> is a very interesting take on why DOS even has this legacy. Bottom line -- <em>unlike the other OS of the day (unix), DOS didn't support directories... it just had one root filesystem.</em> This led the clever developers to use the '/' character as the command line switch -- like "xcopy /Y". On Unix-like systems, "-" or "--" is used -- "cp -R \*.txt"

The result is, that if your platform is windows, the above code turns into:

```c
char * file = "C:\home\mark\input.txt";
```

You might think, "Hey that's not that bad..." However, if you need to make it cross platform, you end up with something like this (Using a C++ pseudo code example)

```c
#ifdef UNIX
#define DIRSEP  "/"
#define ROOT "/"
#else
#define ROOT "C:\"
#define DIRSEP "/"
#endif

ostringstream ostr;
ostr << ROOT << "home" << DIRSEP << "mark" << DIRSEP << "input.txt";
```

Bottom line... ugliness. All programming languages have to deal with this in some form. There are limitations to the levels of abstractions that even managed code can give you. Inevitably, the abstraction crumbles when you hit the filesystem -- which is not nearly as complicated as some other OS coupled features.

I had always hoped that Java would come out with a universal "language" (if you will) to access the filesystem that was OS independent. For a language that is always touted as a "write once, run anywhere" language, the filesystem presents a tough hurdle early on.

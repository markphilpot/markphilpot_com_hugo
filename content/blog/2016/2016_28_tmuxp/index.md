---
title: "Command Line Fu - tmuxp"
date: "2016-12-16 10:34:00"
tags: [cli, tmux]
category: blog
slug: cli_tmuxp
summary: Where have you been all my life?!
hero: hero.jpg
featuredImage: hero.jpg
---

Every once in a while you should take a step back and evaluate all the common things you do on a regular basis and investigate to see if you can make anything more efficient. For example, in the latest update, Apple removed the battery "Estimated Time Remaining" from the battery menu. Until it was removed, I didn't realize how much I used that to gauge how aggressive my current usage was while on battery. By removing it, it forced me to dive into the _Battery_ section of [iStat Menus](https://bjango.com/mac/istatmenus/) (an app I _highly_ recommend) which I had always hidden because I thought the default one provided by Apple was sufficient. Boy was I wrong. Not only is the iStat Menu's battery status icon much better, I also ended up swapping out the builtin time item with iStats and was able to get quick access to a UTC time as well.

Bottom line, without reevaluating all your options you can end up going a long time without ever realizing there could be significantly better options out there.

Recently, I had bookmarked the [tmuxp](https://tmuxp.readthedocs.io/en/latest/) project since I use tmux (recently switched from screen) extensively on remote hosts. I had a nagging suspicion that I should be using tmux for local tasks as well, but never really had the time to investigate.

Today, taking a day off and sitting in a café in Sonoma I had a chance to pull up tmuxp and really dive in.

I am crushed thinking about all the time I have wasted setting up the same CLI environment for development (or other tasks). The fact that I can save a config file in the root of whatever project I'm working on and instantly resurrect a fully baked CLI environment is the pinnacle of command line fu.

Below is an example of my `.tmuxp.yaml` for this blog, which I can just start by running `tmuxp load .`

```bash
session_name: tmuxp
start_directory: ./
windows:
  - window_name: latest
    focus: True
    panes:
      - shell_command:
          - cd latest
          - ls
  - window_name: git
    panes:
      - git status
  - window_name: devserver
    shell_command_before:
      - '[ -d venv -a -f venv/bin/activate ] && source venv/bin/activate'
    panes:
      - ./develop_server.sh start
```

That doesn't even scratch the surface of what you can do with split panes, etc. Tmux in itself is an incredibly powerful cli swiss army knife. Paring it with tmuxp is like automatically setting up your tent, sleeping bag and cooking a 5 course gourmet meal at the push of a button -- it will make you want to go camping a lot more 🍻

---
title: "Question"
date: "2006-06-30 20:10:52"
tags: [imported, java, c++]
category: blog
slug: question
---

Anyone who isn't a full fledged computer nut (or someone who does this for a living... I at least fit both categories) can move on to some of my other posts below (<a title="Knockout Round Review" href="https://blog.mcstudios.net/2006/06/28/world-cup-part-3/">World Cup Part 3</a> for example). However, if you aren't phased, please continue.

Why has no one done a one to one port of the extensive <a title="Java 1.4.2 API" href="https://java.sun.com/j2se/1.4.2/docs/api/index.html">Java libraries</a> to C++? I know there is <a title="Standard Library on Steriods" href="https://boost.org">Boost</a> which is basically an advanced extension to the C++ standard library, but wouldn't you think it would be worth while to have a 1 to 1 port where you didn't need to think about different syntax, the function and behavior was the same (or as close as you can get in C++ while still concerning yourself with memory management). Is there a technical reason? The productivity boost you get from Java comes from not having to worry about memory and by having an extensive library what works well together. You don't need to reinvent the wheel every time. They wouldn't be the most efficient libraries in the world, I understand that. And maybe the memory management aspect kills the idea, but I'm surprised I can't find anyone's attempt at it.

You see, I think the kicker would be since you can overload operators in C++, the distinction between Objects and primitives wouldn't be as drastic. For example you would be able to write:

```c
Integer i;
i++;
vector<Integer> i_vector;
```

You would also get control over the stack and references, etc. Pointers would still had a complexity... (This is me thinking out loud).

```c
Integer * i = new Integer(0);
*i++;
vector<Integer> ip_vector;
```

Well, not nearly as clean. It would give you more control, and maybe that's the reason it wouldn't quite work. You would still have an abstract Object class that everything would inherit from.

So, could it work? Is it worth trying? Would anyone use it?

<em>Update</em>

Well, to partially answer my own question, there are least two attempts at an implementation that I've found -- <a href="https://sourceforge.net/projects/dol/" title="DOL">DObjectLibrary</a> and <a href="https://sourceforge.net/projects/fccl" title="FCCL">Free C++ Class Library</a>. The latter appears no longer maintained, with DObjectLibrary appearing the more advanced of the two and even provides a <a href="https://programics.com/dfc.php" title="DOL Homepage">Java to C++</a> translator! Pretty cool. So that partially answers my question. However, DOL is <a href="https://www.gnu.org/licenses/licenses.html#GPL" title="GNU General Public License">GPL</a> license... not a great move, considering this is exactly what the <a href="https://www.gnu.org/licenses/licenses.html#LGPL" title="GNU Lesser Public License">LGPL</a> was made for.

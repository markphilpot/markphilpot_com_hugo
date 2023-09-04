---
title: "How not to program a user interface"
date: "2007-04-16 15:37:03"
tags: [imported]
category: blog
slug: how_not_to_program_a_user_interface
---

The following is a description on using the Clearquest 2003 windows application.

<ul>
	<li>Ok... I have a query that I need to send to someone via email.  What I need is an "Export Query" option.  Lets try under the file menu.  Hm... no export option.  Ok, lets try right clicking on the query I want to export.  Yay. OK found it.  "Export Query" and Save As a .qry file.</li>
	<li>Now... How the hell do I import it?  Under the File menu there is no "Import" option.  Ok, I check all the menus... nothing.  Now lets try right clicking on a query... nope... only the export option.  Arg.  There is no way!  Now I remember that a colleague down the hall did this a few months ago...  Get up, walk down the hall and ask and get the stupid answer back...</li>
	<li>Walk back to the office, grumble about poor UI, and right click on the <em>Folder</em> where I want to import the query.  Lo and behold, "Import Query."</li>
</ul>

One of the most important rules in UI programming is that you should never rely on a right-click context menu as the only way to perform an action. This should only be thought of as a shortcut. Apple takes this paradigm to the extreme and only provides mice hardware with one button (but you can access a context menu via Option+click).

Clearquest is frustrating to use in other regards, but this was just the latest grumble about its user interface.

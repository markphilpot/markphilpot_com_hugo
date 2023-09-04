---
title: "fixing wordpress -- editor removing div tags"
date: "2007-03-19 12:55:51"
tags: [imported, wordpress]
category: blog
slug: fixing_wordpress_editor_removing_div_tags
---

Wordpress has (or rather had) an annoying habit -- When you used it as a <a href="https://en.wikipedia.org/wiki/Content_management_system" title="Content management system">CMS</a>, the built in editor graciously removed all div tags from your post. I really can't see why anyone in their right mind would wish this. After digging through the support forums, came upon the following:

2.1 version tinyMCE will replace &lt;div&gt; by &lt;p&gt; when saving post, you may change this by hacking file: wp-includes/js/tinymce/tiny_mce_config.php about 24th line, find:

```php
$valid_elements = 'p/-div[*],-strong/-b[*],-em/-i[*],-font[*],-ul[*],-ol[*],-li[*],*[*]';
```

replace by:

```php
$valid_elements = '-strong/-b[*],-em/-i[*],-font[*],-ul[*],-ol[*],-li[*],*[*]';
```

This was the main reason why I was using <a href="https://groups.google.com/group/ChenPress" title="It really needs an official page...">ChenPress</a> as my editor previously. I haven't yet figured out TinyMCE will handle embedded php in a post... We'll find out soon I guess.

Anyway, thought I would share.

<strong>Update --</strong> This hack no longer appears to work in v2.3.1 -- I'm still trying to figure out a workaround.

<strong>Update Again --</strong> I tried mucking with the actual TinyMCE javascript... If you edit tiny_mce.js and comment out lines #4537 and #4540 (exposing the content of the if block, it seems to turn off the verify_html function within TinyMCE which partly causing this problem. I don't think the valid_elements property is being used correctly, because I tried setting it to the complete HTML spec that I copied from <a href="https://wiki.moxiecode.com/index.php/TinyMCE:Configuration/valid_elements#Default_rule_set:">here</a>, but it didn't work (same behavior). I think the bug is even deeper than that. However, because of all this, I have moved away from the WYSIWYG editor completely for all my posts (both blog and CMS content). So take this update with a grain of salt...

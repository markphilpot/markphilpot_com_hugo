---
title: "Command Line Ninja"
date: "2011-03-21 14:45:00"
tags: [linux, cli]
category: blog
slug: cli_ninja
summary: CLI customizations
---

_This post was migrated from my old blog_

Navigating maven projects (or any java project for that matter) on the command line can be an incredible pain. Package structures 8 or 10 levels deep aren't that uncommon, especially in large enterprise level projects. Below are two hooks that I use to hop around that I find really useful.

**showlevel (alias l='showlevel')**

    :::perl
    #!/bin/perl -w

    my $pwd=`pwd`;

    my @parts = split("/", $pwd);
    my $level = (scalar(@parts)-1);
    # Want to show which directory we are going to
    $level--;

    print $pwd;

    my $last_index = 0;
    my $index = 0;

    while( $index != -1 && $level >= 1)
    {
       $index = index($pwd, "/", $index);
       my $space = "";

       my $double_digit_level = 0;
       # Needs to be 8 because we print the spacer first
       if( $level > 8 )
       {
          $double_digit_level = 1;
       }

       for( $i=0; $i < ($index - $last_index)-1; $i++)
       {
          if($double_digit_level)
          {
             # When we print the double digit level, we need to
             # leave off on "spacer"
             $double_digit_level = 0;
          }
          else
          {
             $space.=".";
          }
      }

       if($index != -1)
       {
          print $space.$level;
          $last_index = $index;
          $index++;
          $level--;
       }
    }

    print "

";

**~/.profile or ~/.bashrc**

    :::bash
    function k
    {
       level=$1
       cdback=""
       for i in `seq 1 $level`
       do
          cdback=$cdback"../"
       done

       cd $cdback
    }

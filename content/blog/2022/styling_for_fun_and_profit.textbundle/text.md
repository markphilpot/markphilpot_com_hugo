---
title: 'Styling for Fun & Profit'
date: '2022-06-18 15:15:00'
tags: [css, development]
category: development
slug: styling-for-fun
summary: 
hero: assets/hero.jpg
featuredImage: assets/hero.jpg
---
![](assets/hero.jpg "hidden")

Something to keep in mind is almost all my recent experience is using a "modern" UI framework (React is my go-to hammer in my tool belt). Your framework of choice (or lack thereof) will probably have an influence on your decision-making process. My one piece of advice is that it's likely not a good idea to use a styling paradigm that is at odds with your framework. Start with what your framework makes easy and explore from there.

### Vanilla CSS

On a few small projects where I didn't need a full-blown CSS-in-JS system, I elected to go the "old-fashioned" way of just including CSS files and using the `className` prop.

Honestly, for small projects I think this is the way to go (I'm not sure where that line in the sand is, and it's almost certainly a personal choice). The IDE tooling around this method is better supported now and if you are worried about class style bleeding, you can use CSS Modules and still retain most of the same workflow.

I've never used vanilla CSS with React in a team setting, but I can imagine it could break down quickly.  Without a very well-defined style guide, I could imagine things getting tied in knots quickly.

### styled-components

[Emotion](https://emotion.sh) and [styled-components](https://styled-components.com/) are the leading contenders for CSS-in-JS frameworks.  They let you write CSS, but co-locate it with your component's logic and hierarchy.  Most IDEs make it easy to navigate to a component definition, so having the style and logic together can make sense.

There is a performance overhead for all CSS-in-JS systems, but both players have spent a lot of time focusing to make the performance worth the tradeoff. These systems have the same tradeoffs with standardization that just using CSS does.

### styled-components w/ styled-system

[styled-system](https://styled-system.com/) attempts to give you some guide rails in your styling journey. While it doesn't fully dictate everything like Tailwind does, by providing a bit of structure and some opinions, you can end up with a system that is very amenable to a full engineering team.

The main thing I don't like is that all your components become extremely prop heavy, as each "utility class" is individually addressed at the prop level. However, some may prefer that to the extremely long (and often unstructured) `className` string that Tailwind uses.  On the flip side, since everything is props, you can be a lot more proscriptive in the styling props your components take (i.e. a component only taking `SpaceProps` can enforce only passing in margin and padding related customizations).

### theme-ui

From the author of styled-system, [theme-ui](https://theme-ui.com/) is a subsequent and simpler revision with specific use cases for [gatsby](https://www.gatsbyjs.com/) and [MDX](https://mdxjs.com/) content (which is why I use it on this blog).  Rather than a low-level styling engine, you are given styled atoms that can be customized via a single `sx` prop (as opposed to the prop-per-style-element of styled-system).  That centralization is not to be taken lightly – it's a massive improvement over the alternative.

Outside of the gatsby and MDX heavy use cases, I probably wouldn't recommend it.

### TailwindCSS  

[TailwindCSS](https://tailwindcss.com/) is the newest styling method and has gained quite a bit of community traction. At first, the main thing that kept me away is that the "language" for styling is only "CSS-like" – you can infer a lot of stuff, but there is a distinct learning curve.  Having spent time with styled-system, that began to be less of an issue. The standardization of styling around utility classes, I would imagine, being good for teams.

In the react ecosystem, as long as you are disciplined about creating intermediate components, I feel the visual clutter of the `className` prop becomes more tolerable.

Currently, TailwindCSS is my default choice for side projects. I'm becoming more familiar with the keyword shorthand, but I'm not at the point where I can craft complex multi-state UX like you see in the TailwindUI examples.

## What about Native (react-native)

Something to keep in mind is that React Native doesn't use CSS exactly – They mapped a subset of CSS onto the native rendering engine. If you mostly use Flexbox for layout and remember that everything is rendered with pixels (no em/rem units), you could almost believe you're just styling a webpage.  That is, until it suddenly doesn't.

Of the CSS-in-JS players, styled-components does offer robust RN support (and you can obviously apply styled-system on top of it very effectively). Just keep reminding yourself that though it may *look* like CSS, it's not.

I haven't yet tried Tailwind in a RN context, but it is supported ([tailwind-react-native-classnames](https://github.com/jaredh159/tailwind-react-native-classnames) is probably the one I'll try first).

## Themes & Dark Mode

The story for theme management is very much a personal one – as far as I can tell, there really isn't a community consensus on the best ways to abstract theming in your app.

With Vanilla CSS, I prefer using CSS variables to define my color pallet and use a data attribute on the root of my app to switch between them.

```
:root {
  --background: white;
  --text-primary: black;
  --text-secondary: royalblue;
  --accent: rgba(85, 0, 85, 0.3);
}
[data-theme='dark'] {
  --background: black;
  --text-primary: white;
  --text-secondary: grey;
  --accent: rgb(255, 170, 255, 0.3);
}
```

I appreciate the centralization of this approach but you obviously have to do the legwork yourself.

styled-components itself doesn't have a built-in concept of a "theme" but styled-system [does](https://styled-system.com/theme-specification).  It tries to split the difference between an opinionated theme structure and a fully custom solution.  While this flexibility is nice, once again you are responsible for the heavy lifting.

I find TailwindCSS's opinions on how to handle theming bizarre.  Its solution is essentially to inline everything.  You don't create points of abstraction, instead just provide `dark:*` selectors on an individual className basis.  I think there are escape hatches within the framework to create points of abstraction for colors, but it's not used extensively in the community as far as I can tell.
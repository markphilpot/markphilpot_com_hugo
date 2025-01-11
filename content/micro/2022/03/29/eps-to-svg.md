---
layout: post
title: "EPS to SVG"
microblog: false
guid: http://mphilpot.micro.blog/2022/03/29/eps-to-svg.html
post_id: 1534811
date: 2022-03-29T19:11:41-0800
lastmod: 2022-03-29T19:12:42-0800
type: post
#url: /2022/03/29/eps-to-svg.html
twitter:
  id: 1509005418424582146
  username: 
---
using only the tools you have on hand...

	brew install ghostscript pdf2svg
	
	ps2pdf -dEPSCrop image.eps image.pdf
	pdf2svg image.pdf image.svg



msrd.io
=======
The web site for the Microsoft Regional Directors, a global community of
independent Microsoft ambasadors.  

# STOP!

_May 30, 2013_

We have stopped working on the Master branch. All work is
continuing on the Static branch for now. Two reasons:

1. Updates to Master get deployed immediately to www.msrd.io

2. Static gets 'compiled' into a release folder, which will eventually
   get deployed to Azure. But we haven't figured that out yet.


Technical details about the RD site
-----------------------------------
- HTML5 and CSS3, naturally
- Hosted on Azure as part of their preview "web site"
- Node.js and Express for minimal routing and layout engine
- Content marked up as Jade (HTML), Stylus (CSS) and Markdown (text)
- No client-side Javascript (yet)
- Git for source control; change sets pushed to Azure via `git push`
- Source will be on [github](http://github.com)

Getting Started
---------------
 - `npm install`
 - `npm install -g bower` <-- Installs the [Bower](http://bower.io) client side package manager
 - `bower install` <-- Brings in local copies of needed dependencies (ex: `jquery`)
 - `grunt` <-- Builds/Compiles/MagicStuff and launches browser to test site


Stretch goals for the site
--------------------------

- [Clean typography][1]
- [Semantic markup][2]
- [Grid-based layouts][3]
- [Mobile-first adaptive design][4]
- [Design ∩ Engineering][5]
- [EMs over Pixels][6]
- [Engineered HTTP for speed][7]
- And source control as CMS (Markdown and Github) 

[1]: http://webtypography.net
[2]: http://html5doctor.com/lets-talk-about-semantics/
[3]: http://typophile.com/files/How%20you%20make%20a%20grid.pdf
[4]: http://www.codeschool.com/courses/journey-into-mobile
[5]: http://www.smashingmagazine.com/2010/02/09/applying-mathematics-to-web-design/
[6]: http://blog.cloudfour.com/the-ems-have-it-proportional-media-queries-ftw/
[7]: http://developer.yahoo.com/performance/rules.html



# EIENDOM HELD content

Static gallery for Albert. Not for public sharing (noindex, robots.txt disallows all).

## Add a new week or post
1. Put display images (WebP, 1080x1350) in `img/week-N/<post-id>/slide-01.webp` and so on.
2. Put download files (PNG) in `dl/week-N/<post-id>/<post-id>-slide-01.png`, plus an optional zip `dl/week-N/<post-id>-alle-skyfies.zip`.
3. Add the week as the FIRST item in `weeks` in `posts.json` (newest first), or add a post to an existing week.
   Fields per post: id, issue, title, type, slides [{src, download, alt}], zip, caption, optional trailer {label, url} and alt_caption {label, text}.
4. Commit and push to main. GitHub Pages rebuilds in a minute or two.

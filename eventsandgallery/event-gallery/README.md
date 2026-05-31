# Event Gallery — how to add photos

You don't edit any code. **Just create folders and drop in photos.**

## Structure

```
event-gallery/
  2024/                     ← a YEAR
    CBN Birthday/           ← an EVENT (this name shows on the album card)
      1.jpg
      2.jpg
    Davos Event/
      a.jpg
      b.jpg
  2025/
    Mini Mahanadu/
      ...
    Lokesh Birthday/
      ...
```

- **Top folder** = the year (2018–2026).
- **Sub-folder** = the event name shown on the website (e.g. `NBK Birthday`, `Protest March`, `Davos Event`).
- **Files inside** = the photos in that album.

## Tips

- **Order:** prefix with a number to control order — `01 Mini Mahanadu`, `02 CBN Birthday`.
  The number is hidden on the site (shows just "Mini Mahanadu").
- **Cover image:** name one file `cover.jpg` to use it as the album thumbnail;
  otherwise the first photo is used.
- **Keep photos web-sized** (around 1200px wide, under ~400 KB each) so the site stays fast.
- Supported types: `.jpg .jpeg .png .webp .gif .avif`

## What happens after you add folders

- If you push to GitHub (or upload via the GitHub website), a workflow runs
  `tools/build-gallery.py` and regenerates `eventsandgallery/gallery.json`
  automatically — the new albums then appear on the site.
- To regenerate locally instead: `python3 tools/build-gallery.py`

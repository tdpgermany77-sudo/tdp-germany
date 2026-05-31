#!/usr/bin/env python3
"""
Build the Event Gallery manifest from the folder structure.

Folder convention (just create folders + drop photos, no code editing):

    eventsandgallery/event-gallery/
        2024/
            CBN Birthday/
                1.jpg
                2.jpg
            Davos Event/
                photo.jpg
        2025/
            Mini Mahanadu/
                ...

  - Top level folder  = YEAR
  - Sub folder        = EVENT / album title (shown as-is on the card)
  - Files inside      = the photos

Optional ordering: prefix a folder or file with "01 " / "1-" / "1_" to control
order. The number prefix is stripped from the displayed album title.
A file literally named "cover.*" is used as the album thumbnail.

Run:  python3 tools/build-gallery.py
Output: eventsandgallery/gallery.json   (read by the website)
"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GALLERY_DIR = os.path.join(ROOT, "eventsandgallery", "event-gallery")
OUT = os.path.join(ROOT, "eventsandgallery", "gallery.json")
IMG_EXT = (".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif")

def natural_key(s):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", s)]

def clean_title(name):
    # strip leading ordering prefix like "01 ", "1-", "2_"
    return re.sub(r"^\s*\d+\s*[-_.)]?\s*", "", name).strip() or name

def rel(path):
    return os.path.relpath(path, ROOT).replace(os.sep, "/")

def build():
    data = {}
    if not os.path.isdir(GALLERY_DIR):
        return data
    for year in sorted(os.listdir(GALLERY_DIR), key=natural_key):
        ydir = os.path.join(GALLERY_DIR, year)
        if not os.path.isdir(ydir) or year.startswith("."):
            continue
        albums = []
        for event in sorted(os.listdir(ydir), key=natural_key):
            edir = os.path.join(ydir, event)
            if not os.path.isdir(edir) or event.startswith("."):
                continue
            files = [f for f in os.listdir(edir)
                     if f.lower().endswith(IMG_EXT) and not f.startswith(".")]
            files.sort(key=natural_key)
            if not files:
                continue
            cover = next((f for f in files if os.path.splitext(f)[0].lower() == "cover"), files[0])
            photos = [rel(os.path.join(edir, f)) for f in files]
            albums.append({
                "title": clean_title(event),
                "cover": rel(os.path.join(edir, cover)),
                "photos": photos,
            })
        data[year] = albums
    return data

if __name__ == "__main__":
    data = build()
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    total = sum(len(a) for a in data.values())
    print(f"Wrote {rel(OUT)} — {len(data)} year(s), {total} album(s)")
    for y, albums in sorted(data.items()):
        for a in albums:
            print(f"  {y} · {a['title']}  ({len(a['photos'])} photos)")

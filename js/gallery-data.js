/* ============================================================
   EVENT GALLERY DATA  —  edit this file to add photos
   ------------------------------------------------------------
   Structure:  "YEAR": [ album, album, ... ]
   Each album = {
     title:  "Shown on the album card",
     cover:  "path to one image used as the album thumbnail",
     photos: [ "path/1.jpg", "path/2.jpg", ... ]   // all images in the album
   }

   HOW TO ADD PHOTOS LATER
   1. Put images in a folder, e.g.
        eventsandgallery/event-gallery/2024/mahanadu/1.jpg
   2. Add an album entry under that year below, listing the photos.
   3. Save & push — that's it. Empty years show "Albums coming soon".

   Tip: keep images web-sized (~1200px, < 400 KB) for fast loading.
   ============================================================ */

window.GALLERY_DATA = {
  "2026": [
    {
      title: "Mini Mahanadu",
      cover: "eventsandgallery/upcomingevents/mahanadu-2026/web/mainposter.jpg",
      photos: [
        "eventsandgallery/upcomingevents/mahanadu-2026/web/mainposter.jpg",
        "eventsandgallery/upcomingevents/mahanadu-2026/web/guests.jpg",
        "eventsandgallery/upcomingevents/mahanadu-2026/web/foodmenu.jpg"
      ]
    }
  ],
  "2025": [
    // Example (uncomment & point to real images once added):
    // { title: "CBN Birthday", cover: "eventsandgallery/event-gallery/2025/cbn-bday/cover.jpg",
    //   photos: ["eventsandgallery/event-gallery/2025/cbn-bday/1.jpg"] },
    // { title: "NBK Birthday", cover: "...", photos: ["..."] },
    // { title: "Davos Event",  cover: "...", photos: ["..."] }
  ],
  "2024": [],
  "2023": [],
  "2022": [],
  "2021": [],
  "2020": [],
  "2019": [],
  "2018": []
};

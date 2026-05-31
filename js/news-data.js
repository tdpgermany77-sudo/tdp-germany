/* ============================================================
   NEWS / PRESS & MENTIONS  —  edit this file to feature coverage
   ------------------------------------------------------------
   leaders[] = posts where leaders / official handles mentioned us
   press[]   = news articles / media coverage about TDP Germany

   PRESS item:   { title, source, date, url, image (optional) }
   LEADER post:  { name, platform:'x'|'facebook'|'instagram'|'youtube', text, url, image (optional) }

   For a thumbnail, drop an image in  news-images/  and put its
   filename in "image" (or leave "" for a coloured source tile).
   ============================================================ */

window.NEWS_DATA = {
  // ---- Posts from leaders / official handles about us ----
  leaders: [
    // Example (add real leader posts here):
    // { name:'Nara Lokesh', platform:'x', text:'Wonderful to meet our NRI TDP Germany family!', url:'https://x.com/...', image:'news-images/your-screenshot.jpg' }
  ],

  // ---- Press / media coverage ----
  press: [
    {
      title: 'Warm welcome in Zurich from NRI TDP family: Nara Lokesh arrives ahead of WEF Davos meetings',
      source: 'First India',
      date: 'Jan 2026',
      url: 'https://firstindia.co.in/news/delhi/warm-welcome-in-zurich-from-nri-tdp-family-nara-lokesh-arrives-ahead-of-wef-davos-meetings',
      image: 'news-images/lokesh-davos-zurich.webp'
    },
    {
      title: 'NRI TDP Germany gearing up for Mini Mahanadu',
      source: 'Telugu360',
      date: 'May 2023',
      url: 'https://www.telugu360.com/nri-tdp-germany-gearing-up-for-mini-mahanadu/',
      image: 'news-images/telugu360-mahanadu.webp'
    },
    {
      title: 'NTR Centenary Celebrations in Germany',
      source: 'Gulte',
      date: 'May 2023',
      url: 'https://www.gulte.com/overseas/242755/ntr-centenary-celebrations-in-germany',
      image: 'news-images/gulte-ntr-centenary.webp'
    }
  ]
};

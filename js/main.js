// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
navToggle?.addEventListener('click', () => nav.classList.toggle('open'));
nav?.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => nav.classList.remove('open'))
);

// ===== Current year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Event Gallery (year -> albums -> photos) =====
(function gallery() {
  const yearsWrap = document.getElementById('galleryYears');
  const modal = document.getElementById('galleryModal');
  if (!yearsWrap || !modal) return;

  const UPCOMING_YEAR = '2026';
  const YEAR_MIN = 2018;
  const YEAR_MAX = 2026;
  const gmTitle = document.getElementById('gmTitle');
  const gmBody = document.getElementById('gmBody');
  const gmBack = document.getElementById('gmBack');
  const lightbox = document.getElementById('galleryLightbox');
  const glImg = document.getElementById('glImg');

  let data = {};
  let currentPhotos = [];
  let currentIndex = 0;
  let currentYear = null;

  // ---- Load gallery data from the folder-generated manifest ----
  fetch('eventsandgallery/gallery.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .catch(() => window.GALLERY_DATA || {})
    .then((d) => { data = d || {}; buildYears(); });

  // ---- Build year cards (always show full 2018..2026 range) ----
  function buildYears() {
    const years = [];
    for (let y = YEAR_MIN; y <= YEAR_MAX; y++) years.push(String(y));
    Object.keys(data).forEach((y) => { if (!years.includes(y)) years.push(y); });
    years.sort();
    yearsWrap.innerHTML = years
      .map((y) => {
        const albums = data[y] || [];
        const isUpcoming = y === UPCOMING_YEAR && albums.length === 0;
        const cls = isUpcoming ? 'gallery-year gallery-year--upcoming' : 'gallery-year';
        const label = isUpcoming
          ? 'Coming this June'
          : albums.length
          ? albums.length + (albums.length === 1 ? ' album' : ' albums')
          : 'Photos soon';
        const soon = !isUpcoming && albums.length === 0 ? ' gallery-year--soon' : '';
        return `<button type="button" class="${cls}${soon}" data-year="${y}">
          <span class="gallery-year__yr">${y}</span>
          <span class="gallery-year__label">${label}</span>
        </button>`;
      })
      .join('');
  }

  // ---- Open / close modal ----
  const openModal = () => { modal.hidden = false; document.body.style.overflow = 'hidden'; };
  const closeModal = () => { modal.hidden = true; document.body.style.overflow = ''; };

  yearsWrap.addEventListener('click', (e) => {
    const card = e.target.closest('[data-year]');
    if (card) showYear(card.dataset.year);
  });

  modal.querySelectorAll('[data-gclose]').forEach((el) =>
    el.addEventListener('click', closeModal)
  );
  gmBack.addEventListener('click', () => showYear(currentYear));

  // ---- Year view: list albums ----
  function showYear(year) {
    currentYear = year;
    const albums = data[year] || [];
    gmTitle.textContent = year + ' — Events';
    gmBack.hidden = true;
    if (!albums.length) {
      gmBody.innerHTML = `<p class="gmodal__empty">Albums for ${year} are coming soon. 📸</p>`;
    } else {
      gmBody.innerHTML =
        '<div class="galbums">' +
        albums
          .map(
            (a, i) => `<button type="button" class="galbum" data-album="${i}">
              <span class="galbum__img" style="background-image:url('${encodeURI(a.cover || (a.photos && a.photos[0]) || '')}')"></span>
              <span class="galbum__title">${a.title}</span>
              <span class="galbum__count">${(a.photos || []).length} photo${(a.photos || []).length === 1 ? '' : 's'}</span>
            </button>`
          )
          .join('') +
        '</div>';
      gmBody.querySelectorAll('[data-album]').forEach((b) =>
        b.addEventListener('click', () => showAlbum(year, +b.dataset.album))
      );
    }
    openModal();
  }

  // ---- Album view: photo grid ----
  function showAlbum(year, idx) {
    const album = (data[year] || [])[idx];
    if (!album) return;
    currentPhotos = album.photos || [];
    gmTitle.textContent = album.title + ' · ' + year;
    gmBack.hidden = false;
    gmBody.innerHTML =
      '<div class="gphotos">' +
      currentPhotos
        .map(
          (p, i) =>
            `<button type="button" class="gphoto" data-photo="${i}"><img src="${encodeURI(p)}" alt="${album.title} photo ${i + 1}" loading="lazy" /></button>`
        )
        .join('') +
      '</div>';
    gmBody.querySelectorAll('[data-photo]').forEach((b) =>
      b.addEventListener('click', () => openLightbox(+b.dataset.photo))
    );
  }

  // ---- Lightbox ----
  function openLightbox(i) {
    currentIndex = (i + currentPhotos.length) % currentPhotos.length;
    glImg.src = encodeURI(currentPhotos[currentIndex]);
    lightbox.hidden = false;
  }
  const closeLightbox = () => { lightbox.hidden = true; };
  document.getElementById('glClose').addEventListener('click', closeLightbox);
  document.getElementById('glPrev').addEventListener('click', () => openLightbox(currentIndex - 1));
  document.getElementById('glNext').addEventListener('click', () => openLightbox(currentIndex + 1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  // ---- Keyboard ----
  document.addEventListener('keydown', (e) => {
    if (!lightbox.hidden) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
      if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
    } else if (!modal.hidden && e.key === 'Escape') {
      closeModal();
    }
  });
})();

// ===== News / Press & Mentions =====
(function news() {
  var data = window.NEWS_DATA || { leaders: [], press: [] };
  var leadWrap = document.getElementById('newsLeaders');
  var pressWrap = document.getElementById('newsPress');
  if (!leadWrap && !pressWrap) return;

  function esc(s) {
    return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function show(id, on) { var e = document.getElementById(id); if (e) e.style.display = on ? '' : 'none'; }

  var leaders = data.leaders || [];
  var press = data.press || [];

  // ---- Leader posts ----
  show('newsLeadersHead', leaders.length);
  if (leadWrap) {
    leadWrap.innerHTML = leaders.map(function (p) {
      var plat = (p.platform || 'post').toLowerCase();
      var img = p.image
        ? '<a class="post__img" href="' + esc(p.url) + '" target="_blank" rel="noopener" style="background-image:url(\'' + encodeURI(p.image) + '\')"></a>'
        : '';
      return '<article class="post">' + img +
        '<div class="post__body">' +
          '<div class="post__top">' +
            '<span class="post__badge post__badge--' + plat + '">' + esc(plat) + '</span>' +
            '<span class="post__name">' + esc(p.name) + '</span>' +
          '</div>' +
          '<p class="post__text">' + esc(p.text) + '</p>' +
          '<a class="post__link" href="' + esc(p.url) + '" target="_blank" rel="noopener">View post →</a>' +
        '</div></article>';
    }).join('');
  }

  // ---- Press coverage ----
  show('newsPressHead', press.length);
  if (pressWrap) {
    pressWrap.innerHTML = press.map(function (a) {
      var initial = esc((a.source || 'N').charAt(0).toUpperCase());
      var imgEl = a.image
        ? '<span class="ncard__img" style="background-image:url(\'' + encodeURI(a.image) + '\')"></span>'
        : '<span class="ncard__img ncard__img--empty">' + initial + '</span>';
      var meta = esc(a.source || '') + (a.date ? ' · ' + esc(a.date) : '');
      return '<a class="ncard" href="' + esc(a.url) + '" target="_blank" rel="noopener">' +
        imgEl +
        '<span class="ncard__body">' +
          '<span class="ncard__meta">' + meta + '</span>' +
          '<span class="ncard__title">' + esc(a.title || '') + '</span>' +
          '<span class="ncard__cta">Read article →</span>' +
        '</span></a>';
    }).join('');
  }

  show('newsEmpty', !leaders.length && !press.length);
})();

// ===== Scroll reveal =====
const revealTargets = document.querySelectorAll(
  '.about, .leader, .member, .card, .event, .feature-event, .gallery-year, .stat, .join__inner, .section__head'
);
revealTargets.forEach((el) => el.classList.add('reveal'));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealTargets.forEach((el) => io.observe(el));

// ===== Animated counters =====
const counters = document.querySelectorAll('.stat__num');
const counterIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      let n = 0;
      const step = Math.max(1, Math.ceil(target / 60));
      const tick = () => {
        n += step;
        if (n >= target) {
          el.textContent = target + '+';
        } else {
          el.textContent = n;
          requestAnimationFrame(tick);
        }
      };
      tick();
      counterIO.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
counters.forEach((c) => counterIO.observe(c));

// ===== Event photo slider (auto every 3s) =====
const slider = document.getElementById('eventSlider');
if (slider) {
  const slides = [...slider.querySelectorAll('.slide')];
  const dotsWrap = document.getElementById('sliderDots');
  let current = 0;
  let timer;

  const show = (i) => {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('is-active', n === current));
    dotsWrap?.querySelectorAll('button').forEach((d, n) =>
      d.classList.toggle('is-active', n === current)
    );
  };
  const next = () => show(current + 1);
  const start = () => { stop(); timer = setInterval(next, 3000); };
  const stop = () => clearInterval(timer);

  // build dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Show photo ${i + 1}`);
    b.addEventListener('click', () => { show(i); start(); });
    dotsWrap?.appendChild(b);
  });

  show(0);
  start();
  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
}

// ===== Membership form → Google Sheets =====
// 1. Create a Google Sheet with header row:
//    Timestamp | Name | Email | City | Phone | Profession
// 2. Extensions ▸ Apps Script, paste the doPost() code from README, Deploy ▸ Web app
//    (Execute as: Me, Access: Anyone), copy the /exec URL and paste it below.
const SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxRgIPTqXEGA6SQQdJgwf3W5ONtFFX8QvhMZxbetBir6WcnN9_XxPbRp6gRZ6eIlxc-fA/exec';

const form = document.getElementById('memberForm');
const note = document.getElementById('formNote');
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const label = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Submitting…';

  try {
    if (SHEET_ENDPOINT.startsWith('http')) {
      const params = new URLSearchParams(new FormData(form));
      await fetch(SHEET_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: params.toString(),
      });
    } else {
      await new Promise((r) => setTimeout(r, 600)); // demo fallback until endpoint is set
    }
    form.reset();
    note.textContent = '🎉 Thank you! Your details have been received.';
  } catch (err) {
    note.textContent = '⚠️ Sorry, something went wrong. Please try again.';
  } finally {
    note.hidden = false;
    btn.disabled = false;
    btn.textContent = label;
    setTimeout(() => (note.hidden = true), 6000);
  }
});

// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
navToggle?.addEventListener('click', () => nav.classList.toggle('open'));
nav?.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => nav.classList.remove('open'))
);

// ===== Current year =====
document.getElementById('year').textContent = new Date().getFullYear();

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
const SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyOaLq9Ypu1ECaC81T1cel_OB-qyqnOWTjxsl4Ly2CdFpb6wxRY7cLeWxaHHoH4jrtyRg/exec';

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

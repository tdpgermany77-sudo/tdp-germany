/* ============================================================
   Confetti cannons — fired ONCE, only when the visitor arrives
   from Launch.html (which sets a sessionStorage flag).
   Two blasts shoot up from the bottom-left & bottom-right corners.

   (Temporary effect — to remove: delete this file + its <script>
    tag in index.html, and Launch.html.)
   ============================================================ */
(function () {
  var COLORS = ['#FDB813', '#F36F21', '#E2231A', '#8B0000', '#ffffff', '#ffffff'];
  var canvas = null, ctx = null, dpr = 1, pieces = [], raf = null, last = 0;

  function W() { return window.innerWidth; }
  function H() { return window.innerHeight; }

  function setup() {
    canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText =
      'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    dpr = window.devicePixelRatio || 1;
    resize();
    window.addEventListener('resize', resize);
  }
  function resize() {
    if (!canvas) return;
    canvas.width = W() * dpr;
    canvas.height = H() * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function fire(x, y, baseAngle, count) {
    for (var i = 0; i < count; i++) {
      var angle = baseAngle + (Math.random() - 0.5) * 0.8;
      var speed = 13 + Math.random() * 13;
      pieces.push({
        x: x, y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 9,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        rot: Math.random() * Math.PI,
        vr: -0.3 + Math.random() * 0.6,
        life: 0,
        ttl: 80 + Math.random() * 50
      });
    }
  }

  function burst() {
    if (!canvas) setup();
    var y = H() - 6;
    var n = Math.min(120, Math.round(W() / 8));
    fire(W() * 0.06, y, -Math.PI / 2 + 0.42, n);  // bottom-left → up & inward
    fire(W() * 0.94, y, -Math.PI / 2 - 0.42, n);  // bottom-right → up & inward
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
  }

  function frame(t) {
    var dt = Math.min(2, (t - last) / 16.67);
    last = t;
    ctx.clearRect(0, 0, W(), H());
    for (var i = pieces.length - 1; i >= 0; i--) {
      var p = pieces[i];
      p.vy += 0.32 * dt;
      p.vx *= 0.992;
      p.vy *= 0.992;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      p.life += dt;
      var alpha = p.life > p.ttl ? Math.max(0, 1 - (p.life - p.ttl) / 30) : 1;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = alpha;
      ctx.shadowColor = 'rgba(0,0,0,.18)';
      ctx.shadowBlur = 3;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      if (alpha <= 0 || p.y > H() + 40) pieces.splice(i, 1);
    }
    if (pieces.length) {
      raf = requestAnimationFrame(frame);
    } else {
      cancelAnimationFrame(raf);
      raf = null;
      ctx.clearRect(0, 0, W(), H());
    }
  }

  window.tdpCelebrate = burst; // manual trigger if ever needed

  function continueMusic() {
    var m = document.getElementById('bgmMain');
    if (!m) return;
    var t = 0;
    try { t = parseFloat(sessionStorage.getItem('tdpMusicTime') || '0') || 0; sessionStorage.removeItem('tdpMusicTime'); } catch (e) {}
    m.volume = 0.55;
    function play() { var p = m.play(); if (p && p.catch) p.catch(function () {}); }
    // pick up where the launch left off (continuation of the FIRST pass)
    try { if (t) m.currentTime = t; } catch (e) {}
    play();

    // === play the song through TWICE (one repeat), then stop ===
    // The first pass started on the launch page (at the leaders stage); when it
    // ends here we restart it once for the second pass — no fade, so it's
    // continuous. After the second pass it simply stops.
    var repeated = false;
    m.addEventListener('ended', function () {
      if (!repeated) { repeated = true; try { m.currentTime = 0; } catch (e) {} play(); }
    });

    // Never let scrolling (or anything) leave it silent: if it's paused — e.g.
    // autoplay was blocked on this fresh page — start it on the first user
    // gesture. When it's already playing this does nothing, so scrolling can
    // never pause it.
    ['pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll'].forEach(function (ev) {
      window.addEventListener(ev, function once() { if (m.paused && !m.ended) play(); }, { once: true, passive: true });
    });
  }

  function fadeOutMusic() {
    var m = document.getElementById('bgmMain');
    if (!m || m.paused) return;
    var t = setInterval(function () {
      m.volume = Math.max(0, m.volume - 0.05);
      if (m.volume <= 0.02) { clearInterval(t); m.pause(); }
    }, 70);
  }

  function maybe() {
    var fromLaunch = false;
    try { fromLaunch = sessionStorage.getItem('tdpLaunch') === '1'; } catch (e) {}
    if (!fromLaunch) return;
    try { sessionStorage.removeItem('tdpLaunch'); } catch (e) {}   // fire only once
    continueMusic();                                              // keep the song playing onto the site
    setTimeout(burst, 200);
    setTimeout(burst, 550);
    setTimeout(burst, 900);
    setTimeout(burst, 1300);
  }

  if (document.readyState !== 'loading') maybe();
  else document.addEventListener('DOMContentLoaded', maybe);
})();

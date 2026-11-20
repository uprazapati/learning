/* Shared by the landing page and the notes pages: theme picker + space background. */
(function () {
  var KEY = 'learning-theme';
  var root = document.documentElement;
  try { var saved = localStorage.getItem(KEY); if (saved) root.dataset.theme = saved; } catch (e) {}

  var THEMES = [
    { id: 'violet',   name: 'Violet',   s1: '#7c5cff', s2: '#ff6fb5' },
    { id: 'ocean',    name: 'Ocean',    s1: '#2f7bff', s2: '#22c1d6' },
    { id: 'sunset',   name: 'Sunset',   s1: '#ff7a45', s2: '#ff4f81' },
    { id: 'rose',     name: 'Rose',     s1: '#e5487f', s2: '#ff8fab' },
    { id: 'graphite', name: 'Graphite', s1: '#475569', s2: '#94a3b8' },
    null,
    { id: 'forest',   name: 'Forest',   s1: '#1f9d6b', s2: '#8bcf3f' },
    { id: 'meadow',   name: 'Meadow',   s1: '#3fae49', s2: '#d6e84a' },
    { id: 'pine',     name: 'Pine',     s1: '#146c4f', s2: '#2a9d8f' },
    { id: 'moss',     name: 'Moss',     s1: '#6b8e23', s2: '#d4a373' },
    { id: 'sage',     name: 'Sage',     s1: '#6f9a7f', s2: '#d9c9a3' }
  ];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- markup ---------- */
  function planet(a, sz, c, extra) {
    return '<i class="n" style="--a:' + a + 'deg"><b class="pl ' + (extra || '') + '" style="--sz:' + sz + 'px;--c:' + c + '">' +
           (extra && extra.indexOf('moon') > -1 ? '<u class="moon"></u>' : '') + '</b></i>';
  }
  function ring(k, dur, cls, nodes) {
    return '<div class="ring ' + cls + '" style="--k:' + k + ';--dur:' + dur + 's">' + nodes + '</div>';
  }
  function belt() {
    var h = '';
    for (var i = 0; i < 90; i++) {
      var a = Math.round(Math.random() * 360), sz = 2 + Math.round(Math.random() * 4);
      h += '<i class="n" style="--a:' + a + 'deg"><b class="pl rock" style="--sz:' + sz + 'px;--c:' + (i % 3 ? 'var(--a1)' : 'var(--a3)') + '"></b></i>';
    }
    return h;
  }
  function cosmosHtml() {
    return '<div class="cosmos" id="cosmos"><div class="sun"></div>' +
      ring(0.11, 46, '', planet(25, 16, 'var(--a2)')) +
      ring(0.18, 74, 'dash rev', planet(0, 26, 'var(--a3)', 'moon') + planet(180, 14, 'var(--a1)')) +
      ring(0.27, 118, '', planet(300, 38, 'var(--a1)', 'sat') + planet(60, 18, 'var(--a4)') + planet(175, 12, 'var(--a2)')) +
      ring(0.37, 170, 'dots rev', planet(10, 46, 'var(--a4)') + planet(130, 14, 'var(--a3)', 'hollow') +
           planet(190, 20, 'var(--a2)') + planet(250, 14, 'var(--a1)', 'hollow')) +
      ring(0.43, 330, 'belt', belt()) +
      ring(0.49, 240, 'dash', planet(95, 62, 'var(--a1)', 'sat banded') + planet(275, 30, 'var(--a3)', 'banded')) +
      '</div>';
  }
  function buildSpace() {
    var s = document.createElement('div');
    s.className = 'space';
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = '<div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div><div class="blob b4"></div>' +
      '<div class="galaxy g1"></div><div class="galaxy g2"></div><div class="giant"></div><div class="lune"></div>' +
      cosmosHtml() + '<canvas id="stars"></canvas><div class="veil"></div>';
    document.body.insertBefore(s, document.body.firstChild);
  }

  /* ---------- theme picker ---------- */
  function buildPicker() {
    var box = document.createElement('div');
    box.className = 'themes';
    box.setAttribute('role', 'radiogroup');
    box.setAttribute('aria-label', 'Color theme');
    var html = '<span class="themes-label">Theme <b id="themeName"></b></span><div class="swatches">';
    THEMES.forEach(function (t) {
      html += t ? '<button type="button" class="swatch" role="radio" data-theme="' + t.id + '" data-name="' + t.name +
                  '" aria-label="' + t.name + ' theme" title="' + t.name + '" style="--s1:' + t.s1 + ';--s2:' + t.s2 + '"></button>'
                : '<span class="sw-sep" aria-hidden="true"></span>';
    });
    box.innerHTML = html + '</div>';
    document.body.appendChild(box);

    var swatches = Array.prototype.slice.call(box.querySelectorAll('.swatch'));
    var nameEl = box.querySelector('#themeName');
    function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
    function setTheme(id, persist) {
      var m = swatches.filter(function (s) { return s.dataset.theme === id; })[0] || swatches[0];
      root.dataset.theme = m.dataset.theme;
      swatches.forEach(function (s) { s.setAttribute('aria-checked', String(s === m)); s.tabIndex = s === m ? 0 : -1; });
      nameEl.textContent = m.dataset.name;
      if (persist) { try { localStorage.setItem(KEY, m.dataset.theme); } catch (e) {} }
    }
    swatches.forEach(function (s, i) {
      s.addEventListener('click', function () { setTheme(s.dataset.theme, true); });
      s.addEventListener('mouseenter', function () { nameEl.textContent = s.dataset.name; });
      s.addEventListener('mouseleave', function () { nameEl.textContent = cap(root.dataset.theme); });
      s.addEventListener('keydown', function (e) {
        var d = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var n = swatches[(i + d + swatches.length) % swatches.length];
        setTheme(n.dataset.theme, true); n.focus();
      });
    });
    setTheme(root.dataset.theme, false);
  }

  /* ---------- starfield + motion ---------- */
  // fixed constellation shapes (normalized coordinates, kept near the screen edges)
  var CONSTELLATIONS = [
    [[.05,.16],[.09,.11],[.14,.15],[.17,.09],[.21,.13]],
    [[.86,.62],[.90,.68],[.94,.63],[.92,.76],[.97,.80]],
    [[.06,.72],[.11,.78],[.08,.86],[.15,.90]],
    [[.80,.12],[.85,.07],[.90,.13],[.95,.09]]
  ];

  function startSpace() {
    var canvas = document.getElementById('stars');
    var cosmos = document.getElementById('cosmos');
    var ctx = canvas.getContext('2d');
    var W, H, dpr, stars = [], shoot = null, nextShoot = 1500;
    var mx = .5, my = .5, cx = .5, cy = .5, cs = getComputedStyle(root);

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.max(70, Math.min(320, Math.round(W * H / 6000)));
      stars = [];
      function gauss() { return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5; }
      for (var i = 0; i < n; i++) {
        var z = .25 + Math.random() * .75, band = i < n * .42, x = Math.random();
        // a faint Milky Way: part of the stars gather along a diagonal band
        var y = band ? .78 - x * .55 + gauss() * .1 : Math.random();
        stars.push({ x: x, y: Math.min(1, Math.max(0, y)), z: z, r: (band ? .4 : .55) + z * 1.5, p: Math.random() * 6.28,
                     sp: .6 + Math.random() * 1.6, c: (function (r) { return r < .52 ? 4 : r < .88 ? Math.floor(Math.random() * 4) : 5; })(Math.random()), sp4: !band && Math.random() < .14 });
      }
    }
    function col(i) {
      if (i === 4) return '#ffffff';
      if (i === 5) return '#2a2540';
      return cs.getPropertyValue('--a' + (i + 1)).trim() || '#7c5cff';
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      var sy = window.pageYOffset || 0;
      var ox = (cx - .5) * 34, oy = (cy - .5) * 34;
      var colors = [col(0), col(1), col(2), col(3), col(4), col(5)];
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var x = (s.x * W + ox * s.z + W) % W;
        var y = ((s.y * H + oy * s.z - sy * .09 * s.z) % H + H) % H;
        var tw = reduce ? 1 : (.55 + .45 * Math.sin(t / 1000 * s.sp + s.p));
        ctx.globalAlpha = (s.c === 4 ? .98 : s.c === 5 ? .3 : .85) * tw * (.55 + s.z * .45);
        ctx.fillStyle = colors[s.c]; ctx.strokeStyle = colors[s.c];
        if (s.sp4) {
          var L = s.r * 5.5; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(x - L, y); ctx.lineTo(x + L, y); ctx.moveTo(x, y - L); ctx.lineTo(x, y + L); ctx.stroke();
        }
        if (s.c === 4 && s.r > 1.2) { ctx.shadowBlur = 10; ctx.shadowColor = '#ffffff'; }
        ctx.beginPath(); ctx.arc(x, y, s.r, 0, 6.283); ctx.fill();
        ctx.shadowBlur = 0;
      }
      // constellations
      var cc = '#ffffff';
      CONSTELLATIONS.forEach(function (pts) {
        ctx.strokeStyle = cc; ctx.fillStyle = cc; ctx.lineWidth = 1;
        ctx.globalAlpha = .55; ctx.beginPath();
        pts.forEach(function (p, k) {
          var px = p[0] * W + ox * .6, py = p[1] * H + oy * .6 - sy * .05;
          if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py);
        });
        ctx.stroke(); ctx.globalAlpha = .95; ctx.shadowBlur = 10; ctx.shadowColor = '#ffffff';
        pts.forEach(function (p) {
          ctx.beginPath(); ctx.arc(p[0] * W + ox * .6, p[1] * H + oy * .6 - sy * .05, 2.6, 0, 6.283); ctx.fill();
        });
        ctx.shadowBlur = 0;
      });
      // shooting star
      if (!reduce) {
        if (!shoot && t > nextShoot) {
          shoot = { x: W * (.35 + Math.random() * .65), y: -20, vx: -(4 + Math.random() * 3), vy: 3 + Math.random() * 2, life: 0 };
        }
        if (shoot) {
          shoot.x += shoot.vx; shoot.y += shoot.vy; shoot.life++;
          var tail = 190, mag = Math.hypot(shoot.vx, shoot.vy);
          var g = ctx.createLinearGradient(shoot.x, shoot.y, shoot.x - shoot.vx / mag * tail, shoot.y - shoot.vy / mag * tail);
          g.addColorStop(0, '#ffffff'); g.addColorStop(.3, colors[1]); g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.globalAlpha = .95; ctx.strokeStyle = g; ctx.lineWidth = 2.6;
          ctx.beginPath(); ctx.moveTo(shoot.x, shoot.y);
          ctx.lineTo(shoot.x - shoot.vx / mag * tail, shoot.y - shoot.vy / mag * tail); ctx.stroke();
          ctx.shadowBlur = 14; ctx.shadowColor = '#ffffff'; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(shoot.x, shoot.y, 2.6, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0;
          if (shoot.y > H + 40 || shoot.x < -140) { shoot = null; nextShoot = t + 2500 + Math.random() * 4500; }
        }
      }
      ctx.globalAlpha = 1;
    }
    function frame(t) {
      cx += (mx - cx) * .05; cy += (my - cy) * .05;
      var sy = window.pageYOffset || 0;
      cosmos.style.transform = 'translate(' + ((cx - .5) * -40) + 'px,' + ((cy - .5) * -40) + 'px) rotate(' + (sy * .012) + 'deg)';
      draw(t);
      requestAnimationFrame(frame);
    }
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', function (e) { mx = e.clientX / window.innerWidth; my = e.clientY / window.innerHeight; });
    resize();
    if (reduce) { draw(0); } else { requestAnimationFrame(frame); }
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () { buildSpace(); buildPicker(); startSpace(); });
})();

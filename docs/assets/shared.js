/* Shared by the landing page and the notes pages: theme picker + space background. */
(function () {
  var KEY = 'learning-theme';
  var root = document.documentElement;
  var GLASS_KEY = 'learning-glass';
  try { var saved = localStorage.getItem(KEY); if (saved && /^(galaxy|violet|ocean|sunset|rose|graphite|forest|meadow|pine|moss|sage)$/.test(saved)) root.dataset.theme = saved; } catch (e) {}
  try { var g0 = localStorage.getItem(GLASS_KEY); if (g0 !== null) root.style.setProperty('--t', String(Number(g0) / 100)); } catch (e) {}

  var THEMES = [
    { id: 'galaxy',   name: 'Galaxy',   s1: '#ff8a3d', s2: '#4fd1e6' },
    null,
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
      cosmosHtml() + '<canvas id="galaxy"></canvas><canvas id="stars"></canvas><div class="veil"></div>';
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
    html += '</div><button type="button" class="themes-more" id="themeMore" aria-label="Appearance settings" aria-expanded="false" aria-controls="themePanel" title="Transparency">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2.2"/><circle cx="8" cy="17" r="2.2"/></svg></button>' +
      '<div class="themes-panel" id="themePanel" role="group" aria-label="Appearance">' +
      '<label for="glassRange">Surface transparency <output id="glassVal">0%</output></label>' +
      '<input type="range" id="glassRange" min="0" max="100" step="1" value="0">' +
      '<p class="hint">Raise it to see more of the background behind cards, the sidebar and notes.</p>' +
      '<button type="button" class="reset" id="glassReset">Reset</button></div>';
    box.innerHTML = html;
    document.body.appendChild(box);

    var more = box.querySelector('#themeMore'), panel = box.querySelector('#themePanel');
    var range = box.querySelector('#glassRange'), out = box.querySelector('#glassVal');
    function setGlass(v, persist) {
      v = Math.max(0, Math.min(100, Number(v) || 0));
      root.style.setProperty('--t', String(v / 100));
      range.value = String(v); out.textContent = v + '%';
      if (persist) { try { localStorage.setItem(GLASS_KEY, String(v)); } catch (e) {} }
    }
    var g1 = null; try { g1 = localStorage.getItem(GLASS_KEY); } catch (e) {}
    setGlass(g1 === null ? 0 : g1, false);
    range.addEventListener('input', function () { setGlass(range.value, true); });
    box.querySelector('#glassReset').addEventListener('click', function () { setGlass(0, true); });
    function togglePanel(open) { panel.classList.toggle('open', open); more.setAttribute('aria-expanded', String(open)); }
    more.addEventListener('click', function (e) { e.stopPropagation(); togglePanel(!panel.classList.contains('open')); });
    document.addEventListener('click', function (e) { if (!box.contains(e.target)) togglePanel(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') togglePanel(false); });

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


  /* ---------- particle galaxy (WebGL), shown in the Galaxy theme ---------- */
  function parseColor(str) {
    var n = (str || '').match(/-?[\d.]+/g) || [];
    var v = n.slice(0, 3).map(Number);
    if (v.length < 3) return [1, .6, .3];
    return /^color\(/.test(str.trim()) ? v : v.map(function (x) { return x / 255; });
  }
  function createGalaxy(canvas) {
    var gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) return null;
    var VS = [
      'precision highp float;',
      'attribute vec4 aA; attribute vec4 aB;',
      'uniform float uT, uTilt, uRoll, uR, uDpr, uYaw; uniform vec2 uRes, uCenter; uniform vec3 uC1, uC2;',
      'varying vec3 vC; varying float vA;',
      'void main(){',
      '  float r = aA.x;',
      '  float th = aA.y + uT * 0.07 + uYaw;',
      '  vec3 p = vec3(cos(th) * r, sin(th) * r, aA.z);',
      '  float ct = cos(uTilt), st = sin(uTilt);',
      '  float y = p.y * ct - p.z * st; float z = p.y * st + p.z * ct;',
      '  float f = 1.0 / (1.0 - z * 0.34);',
      '  vec2 q = vec2(p.x, y) * f;',
      '  float cr = cos(uRoll), sr = sin(uRoll);',
      '  q = vec2(q.x * cr - q.y * sr, q.x * sr + q.y * cr);',
      '  vec2 px = uCenter + vec2(q.x, -q.y) * uR;',
      '  gl_Position = vec4(px.x / uRes.x * 2.0 - 1.0, 1.0 - px.y / uRes.y * 2.0, 0.0, 1.0);',
      '  gl_PointSize = aB.y * uDpr * f;',
      '  float tw = 0.78 + 0.22 * sin(uT * 1.6 + aA.w * 6.2831);',
      '  float m = smoothstep(0.08, 0.9, r + (aB.x - 0.5) * 0.22);',
      '  vec3 col = mix(uC1, uC2, m);',
      '  float mid = exp(-pow((r - 0.3) / 0.13, 2.0));',
      '  col = mix(col, vec3(1.0, 0.94, 0.84), 0.5 * mid * aB.z);',
      '  vC = col;',
      '  vA = aB.z * tw * mix(0.55, 0.95, m);',
      '}'
    ].join('\n');
    var FS = [
      'precision mediump float; varying vec3 vC; varying float vA;',
      'void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard;',
      '  gl_FragColor = vec4(vC, smoothstep(0.5, 0.0, d) * vA); }'
    ].join('\n');
    function sh(type, src) { var o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null; }
    var v = sh(gl.VERTEX_SHADER, VS), f = sh(gl.FRAGMENT_SHADER, FS);
    if (!v || !f) return null;
    var prog = gl.createProgram(); gl.attachShader(prog, v); gl.attachShader(prog, f); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);
    var U = {}; ['uT', 'uTilt', 'uRoll', 'uR', 'uDpr', 'uYaw', 'uRes', 'uCenter', 'uC1', 'uC2'].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });

    function g() { return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5; }
    var N = Math.min(window.innerWidth, 1600) < 700 ? 60000 : 140000;
    var A = new Float32Array(N * 4), B = new Float32Array(N * 4);
    for (var i = 0; i < N; i++) {
      var kind = Math.random(), r, th, z;
      if (kind < .3) {                       // dense core
        r = Math.pow(Math.random(), 1.7) * .26; th = Math.random() * 6.2832; z = g() * .07 * (1 - r);
      } else if (kind < .91) {               // two spiral arms
        var rr = Math.pow(Math.random(), 1.1);
        th = (i % 2) * Math.PI + rr * 5.8 + g() * (.2 + .75 * rr * rr);
        r = Math.max(0, rr + g() * (.05 + .09 * rr)); z = g() * .06 * (1 - rr * .6);
      } else {                               // sparse halo and stray dust
        r = Math.pow(Math.random(), .75) * 1.15; th = Math.random() * 6.2832; z = g() * .12;
      }
      A[i * 4] = r; A[i * 4 + 1] = th; A[i * 4 + 2] = z; A[i * 4 + 3] = Math.random();
      B[i * 4] = Math.random(); B[i * 4 + 1] = .7 + Math.random() * 1.7; B[i * 4 + 2] = .35 + Math.random() * .65; B[i * 4 + 3] = 0;
    }
    function attr(name, data) {
      var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, name); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 0, 0);
    }
    attr('aA', A); attr('aB', B);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    var W = 0, H = 0, dpr = 1;
    return {
      resize: function () {
        dpr = Math.min(window.devicePixelRatio || 1, 2); W = window.innerWidth; H = window.innerHeight;
        canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); gl.viewport(0, 0, canvas.width, canvas.height);
      },
      draw: function (t, mx, my, sy, c1, c2) {
        var R = Math.min(W * .62, Math.max(W * .36, H * .34));
        gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(U.uT, t / 1000); gl.uniform1f(U.uTilt, 1.0 + (my - .5) * .2); gl.uniform1f(U.uRoll, -.14 + (mx - .5) * .1);
        gl.uniform1f(U.uYaw, (mx - .5) * .3 + sy * .0005); gl.uniform1f(U.uR, R); gl.uniform1f(U.uDpr, dpr);
        gl.uniform2f(U.uRes, W, H); gl.uniform2f(U.uCenter, W / 2, H * .5 - sy * .12);
        gl.uniform3fv(U.uC1, c1); gl.uniform3fv(U.uC2, c2);
        gl.drawArrays(gl.POINTS, 0, N);
      }
    };
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
    var galaxy = null; try { galaxy = createGalaxy(document.getElementById('galaxy')); } catch (e) {}
    var cosmos = document.getElementById('cosmos');
    var ctx = canvas.getContext('2d');
    var W, H, dpr, stars = [], shoot = null, nextShoot = 1500;
    var mx = .5, my = .5, cx = .5, cy = .5, cs = getComputedStyle(root);

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (galaxy) galaxy.resize();
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
    function isDark() { return root.dataset.theme === 'galaxy'; }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      var dark = isDark();
      if (dark && galaxy) galaxy.draw(t, cx, cy, window.pageYOffset || 0, parseColor(cs.getPropertyValue('--a1')), parseColor(cs.getPropertyValue('--a2')));
      var sy = window.pageYOffset || 0;
      var ox = (cx - .5) * 34, oy = (cy - .5) * 34;
      var colors = [col(0), col(1), col(2), col(3), col(4), col(5)];
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        if (dark && s.c === 5) continue;
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
      if (!dark) CONSTELLATIONS.forEach(function (pts) {
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
    if (reduce) { draw(0); new MutationObserver(function () { draw(0); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] }); }
    else { requestAnimationFrame(frame); }
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () { buildSpace(); buildPicker(); startSpace(); });
})();

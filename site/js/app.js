(function () {
  'use strict';

  var DATA = null;

  var TYPE_LINES = [
    'building AI cardiac twin models...',
    'solving DS & algorithms on Codeforces...',
    'crafting MERN & Python projects...',
    'open to opportunities — Bangalore, India',
  ];

  /* ---------- helpers ---------- */

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function fmtNumber(n) {
    if (n == null) return '0';
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(n);
  }

  /* ---------- typing effect ---------- */

  function typeLoop() {
    var target = document.getElementById('typed');
    if (!target) return;
    var line = 0, char = 0, deleting = false;

    (function tick() {
      var current = TYPE_LINES[line % TYPE_LINES.length];
      if (!deleting) {
        target.textContent = current.slice(0, ++char);
        if (char === current.length) { deleting = true; return setTimeout(tick, 2200); }
        setTimeout(tick, 45);
      } else {
        target.textContent = current.slice(0, --char);
        if (char === 0) { deleting = false; line++; }
        setTimeout(tick, 22);
      }
    })();
  }

  /* ---------- clock & greeting ---------- */

  function initClock() {
    var clock = document.getElementById('hero-clock');
    var greeting = document.getElementById('hero-greeting');
    function tick() {
      var now = new Date();
      var utc = now.toUTCString().replace('GMT', 'UTC');
      if (clock) clock.textContent = ' · ' + utc;
      if (greeting) {
        var h = now.getHours();
        var g = (h >= 5 && h < 12) ? 'GOOD MORNING' : (h >= 12 && h < 17) ? 'GOOD AFTERNOON' : (h >= 17 && h < 21) ? 'GOOD EVENING' : 'NIGHT OWL';
        greeting.textContent = g + ", I'M";
      }
    }
    tick();
    setInterval(tick, 60000);
  }

  /* ---------- hero stats ---------- */

  function renderHeroStats() {
    var s = DATA.stats, d = DATA.dashboard;
    var map = {
      repos: s.repos,
      followers: s.followers,
      stars: s.stars,
      streak: d.streak,
    };
    document.querySelectorAll('.hs-val[data-field]').forEach(function (node) {
      var key = node.getAttribute('data-field');
      var val = key === 'streak' ? map[key] + 'd' : fmtNumber(map[key]);
      node.textContent = val;
    });

    var status = document.querySelector('.hero-sub');
    if (status && DATA.profile) {
      status.textContent = '';
      status.appendChild(el('span', 'status-dot', ''));
      status.appendChild(document.createTextNode(' Open to opportunities \u00b7 last ' + DATA.profile.status));
    }
  }

  /* ---------- about ---------- */

  function renderAbout() {
    var wrap = document.getElementById('about-tags');
    if (!wrap || !DATA.profile) return;
    var tags = [
      'LOC: BANGALORE, IN',
      'AI/ML ENGINEER',
      'FULL-STACK DEV',
      'COMPETITIVE CODER',
      'CREATIVE BUILDER',
      'OPEN TO WORK',
    ];
    tags.forEach(function (t) {
      wrap.appendChild(el('span', 'tag', t));
    });
  }

  /* ---------- skills ---------- */

  function renderSkills() {
    var wrap = document.getElementById('skills-grid');
    if (!wrap) return;
    DATA.skills.forEach(function (cat) {
      var card = el('div', 'card');

      var head = el('div', 'skill-cat');
      head.appendChild(el('span', null, cat.category));
      head.appendChild(el('span', null, cat.icon));
      card.appendChild(head);

      cat.items.forEach(function (sk) {
        var item = el('div', 'skill-item');
        var top = el('div', 'skill-head');
        top.appendChild(el('span', 'skill-name', sk.name));
        top.appendChild(el('span', 'skill-level', sk.level + '%'));
        item.appendChild(top);

        var bar = el('div', 'skill-bar');
        var fill = el('div', 'skill-fill');
        fill.style.background = sk.color;
        fill.dataset.width = sk.level;
        bar.appendChild(fill);
        item.appendChild(bar);
        card.appendChild(item);
      });

      wrap.appendChild(card);
    });
  }

  /* ---------- projects ---------- */

  function renderProjects() {
    var wrap = document.getElementById('projects-grid');
    if (!wrap) return;
    DATA.projects.forEach(function (p) {
      var card = el('div', 'card project-card');

      var top = el('div', 'project-top');
      top.appendChild(el('span', 'project-badge', '● ' + p.status));
      top.appendChild(el('span', 'project-icon', '📂'));
      card.appendChild(top);

      card.appendChild(el('h3', 'project-name', p.name));
      card.appendChild(el('p', 'project-desc', p.description));

      var feats = el('ul', 'project-features');
      (p.features || []).forEach(function (f) { feats.appendChild(el('li', null, f)); });
      card.appendChild(feats);

      var stack = el('div', 'project-stack');
      (p.stack || []).forEach(function (s) { stack.appendChild(el('span', 'stack-tag', s)); });
      card.appendChild(stack);

      var links = el('div', 'project-links');
      if (p.demo) {
        var demoA = el('a', null, '↗ Live Demo');
        demoA.href = p.demo; demoA.target = '_blank'; demoA.rel = 'noopener';
        links.appendChild(demoA);
      }
      var repoA = el('a', null, '⌥ GitHub');
      repoA.href = p.repo; repoA.target = '_blank'; repoA.rel = 'noopener';
      links.appendChild(repoA);
      card.appendChild(links);

      wrap.appendChild(card);
    });
  }

  /* ---------- stats ---------- */

  function renderStats() {
    var grid = document.getElementById('stats-grid');
    if (!grid) return;
    var d = DATA.dashboard;
    var cells = [
      ['Contributions (30d)', d.total_30d],
      ['Active Streak', d.streak + ' days'],
      ['Today', d.today],
      ['Daily Avg', d.avg_per_day],
      ['Best Day', d.best_day],
    ];
    cells.forEach(function (c) {
      var cell = el('div', 'stat-cell');
      cell.appendChild(el('div', 'stat-v', String(c[1])));
      cell.appendChild(el('div', 'stat-l', c[0]));
      grid.appendChild(cell);
    });

    renderChart(d.series);
    renderHeatmap(d.series);
    renderTopRepos();
  }

  function renderChart(series) {
    var svg = document.getElementById('chart');
    if (!svg) return;
    var W = 700, H = 220, padX = 10, padTop = 20, padBottom = 30;
    var max = 1;
    series.forEach(function (p) { if (p.count > max) max = p.count; });

    var chartW = W - padX * 2;
    var chartH = H - padTop - padBottom;

    function point(i) {
      var x = padX + (i / (series.length - 1)) * chartW;
      var y = padTop + chartH - (series[i].count / max) * chartH;
      return [x, y];
    }

    var polyPts = [];
    var areaPts = [padX + ',' + (padTop + chartH)];
    for (var i = 0; i < series.length; i++) {
      var p = point(i);
      polyPts.push(p[0].toFixed(1) + ',' + p[1].toFixed(1));
      areaPts.push(p[0].toFixed(1) + ',' + p[1].toFixed(1));
    }
    areaPts.push((padX + chartW) + ',' + (padTop + chartH));

    var defs =
      '<defs>' +
      '<linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#39ff14" stop-opacity="0.35"/>' +
      '<stop offset="100%" stop-color="#39ff14" stop-opacity="0"/>' +
      '</linearGradient>' +
      '</defs>';

    var axis =
      '<line x1="' + padX + '" y1="' + (padTop + chartH) + '" x2="' + (padX + chartW) + '" y2="' + (padTop + chartH) + '" stroke="#30363d"/>';

    var last = point(series.length - 1);
    var glowDot =
      '<circle cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="5" fill="#39ff14">' +
      '<animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite"/>' +
      '</circle>';

    svg.innerHTML =
      defs +
      '<polygon points="' + areaPts.join(' ') + '" fill="url(#areaGrad)"/>' +
      '<polyline points="' + polyPts.join(' ') + '" fill="none" stroke="#39ff14" stroke-width="2.5" stroke-linejoin="round"/>' +
      axis + glowDot;
  }

  function renderHeatmap(series) {
    var wrap = document.getElementById('heatmap');
    if (!wrap) return;
    series.forEach(function (p) {
      var sq = el('span', 'sq');
      var c = p.count === 0 ? '#161b22' : p.count <= 2 ? '#0e4429' : p.count <= 5 ? '#00a300' : '#39ff14';
      sq.style.background = c;
      sq.title = p.date + ': ' + p.count;
      wrap.appendChild(sq);
    });
  }

  function renderTopRepos() {
    var wrap = document.getElementById('top-repos');
    if (!wrap) return;
    var repos = DATA.stats.top_repos;
    if (!repos.length) {
      var li = el('li');
      li.appendChild(el('span', 'repo-name', 'No starred repos yet — building in stealth'));
      wrap.appendChild(li);
      return;
    }
    repos.forEach(function (r) {
      var li = el('li');
      li.appendChild(el('span', 'repo-name', r.name));
      li.appendChild(el('span', 'repo-stars', r.stars));
      wrap.appendChild(li);
    });
  }

  /* ---------- competitive programming ---------- */

  function renderCP() {
    var grid = document.getElementById('cp-grid');
    if (!grid) return;
    var cf = DATA.cp.codeforces;
    var lc = DATA.cp.leetcode;

    var cfCard = el('div', 'card cp-card');
    cfCard.appendChild(el('h3', 'card-title', '// CODEFORCES'));
    cfCard.appendChild(el('div', null, '@ ' + cf.handle));
    cfCard.appendChild(el('div', 'rating-big', String(cf.rating)));
    var rankBadge = el('span', 'rank-badge', '[' + cf.rank + ']');
    rankBadge.style.color = cf.color;
    rankBadge.style.borderColor = cf.color;
    cfCard.appendChild(rankBadge);

    var cfRow = el('div', 'cf-row');
    cfRow.appendChild(el('span', 'k', 'Peak rating'));
    cfRow.appendChild(el('span', 'v', String(cf.maxRating) + ' [' + cf.maxRank + ']'));
    cfCard.appendChild(cfRow);

    grid.appendChild(cfCard);

    var lcCard = el('div', 'card cp-card');
    lcCard.appendChild(el('h3', 'card-title', '// LEETCODE'));
    lcCard.appendChild(el('div', null, '@ ' + lc.username));
    lcCard.appendChild(el('div', 'rating-big', String(lc.totalSolved)));
    var lcSub = el('div', 'lc-breakdown');
    [
      ['Easy', lc.easy, 'lc-easy'],
      ['Medium', lc.medium, 'lc-medium'],
      ['Hard', lc.hard, 'lc-hard'],
    ].forEach(function (b) {
      var box = el('div', 'lc-box');
      box.appendChild(el('div', 'n ' + b[2], String(b[1])));
      box.appendChild(el('div', 'l ' + b[2], b[0]));
      lcSub.appendChild(box);
    });
    lcCard.appendChild(lcSub);

    var lcRank = el('div', 'cf-row');
    lcRank.appendChild(el('span', 'k', 'Global ranking'));
    lcRank.appendChild(el('span', 'v', '#' + fmtNumber(lc.ranking)));
    lcCard.appendChild(lcRank);

    grid.appendChild(lcCard);

    renderCPPlatforms();
  }

  function renderCPPlatforms() {
    var wrap = document.getElementById('cp-platforms');
    if (!wrap) return;
    var platforms = [
      { name: 'Codeforces', handle: 'BezaleelPaulN', url: 'https://codeforces.com/profile/BezaleelPaulN' },
      { name: 'CodeChef', handle: 'bezaleelpauln', url: 'https://www.codechef.com/users/bezaleelpauln' },
      { name: 'LeetCode', handle: 'BezaleelPaulN', url: 'https://leetcode.com/u/BezaleelPaulN/' },
      { name: 'HackerRank', handle: 'bezaleel321', url: 'https://www.hackerrank.com/bezaleel321' },
      { name: 'Kaggle', handle: 'bezaleelpaul', url: 'https://www.kaggle.com/bezaleelpaul' },
    ];
    platforms.forEach(function (p) {
      var a = el('a', 'cp-plat', '');
      a.href = p.url; a.target = '_blank'; a.rel = 'noopener';
      a.appendChild(el('span', 'pl-name', p.name));
      a.appendChild(el('span', 'pl-handle', '@' + p.handle));
      wrap.appendChild(a);
    });
  }

  /* ---------- activity ---------- */

  function renderActivity() {
    var list = document.getElementById('activity-list');
    if (!list) return;
    var act = DATA.activity;
    if (!act.length) {
      list.appendChild(el('li', null, 'No recent public activity.'));
      return;
    }
    act.forEach(function (e) {
      var li = el('li');
      li.appendChild(el('span', 'act-emoji', e.emoji));
      var text = el('span', 'act-action', e.action + ' ');
      text.appendChild(el('span', 'act-repo', e.repo));
      li.appendChild(text);
      li.appendChild(el('span', 'act-time', e.time));
      list.appendChild(li);
    });
  }

  /* ---------- contact / socials ---------- */

  var SOCIAL_STYLES = {
    linkedin: '#0077B5', github: '#24292e', portfolio: '#39ff14',
    kaggle: '#20BEFF', codeforces: '#1F8ACB', leetcode: '#FFA116',
    codechef: '#5B4638', hackerrank: '#2EC866',
  };

  function renderSocials() {
    var wrap = document.getElementById('socials');
    if (!wrap) return;
    DATA.socials.forEach(function (s) {
      var a = el('a', 'social', '');
      a.href = s.url; a.target = '_blank'; a.rel = 'noopener';

      var icon = el('span', 'social-icon', s.icon);
      icon.style.background = SOCIAL_STYLES[s.name.toLowerCase()] || '#30363d';
      a.appendChild(icon);

      var text = el('span', null, '');
      text.appendChild(el('span', null, s.name));
      text.appendChild(el('span', 'social-handle', s.handle));
      a.appendChild(text);

      wrap.appendChild(a);
    });
  }

  /* ---------- footer ---------- */

  function renderFooter() {
    var lu = document.getElementById('last-updated');
    if (!lu) return;
    var date = (DATA.generated_at || '').replace('Z', ' UTC');
    lu.textContent = 'Last synced: ' + date;
  }

  /* ---------- hacker matrix background ---------- */

  function initMatrix() {
    var canvas = document.getElementById('matrix-bg');
    if (!canvas) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ctx = canvas.getContext('2d');
    var CHARS = '0123456789ABCDEF@#$%&*+=;:<>/[]{}\\|~'.split('');
    var FONT = 14;
    var cols = 0, drops = [];
    var fade = 'rgba(7, 10, 14, 0.09)';

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width / FONT);
      drops = [];
      for (var i = 0; i < cols; i++) {
        drops[i] = Math.floor((Math.random() * -canvas.height) / FONT);
      }
    }
    resize();
    window.addEventListener('resize', resize);

    var last = 0;
    function draw(ts) {
      if (ts - last > 50) {
        ctx.fillStyle = fade;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = FONT + 'px monospace';
        for (var i = 0; i < drops.length; i++) {
          var ch = CHARS[Math.floor(Math.random() * CHARS.length)];
          var x = i * FONT;
          var y = drops[i] * FONT;
          ctx.fillStyle = i % 7 === 0 ? '#d8ffd0' : '#39ff14';
          ctx.globalAlpha = 0.65;
          ctx.fillText(ch, x, y);
          ctx.globalAlpha = 1;
          if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
          drops[i]++;
        }
        last = ts;
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  /* ---------- animations ---------- */

  function initReveal() {
    var cards = document.querySelectorAll('.card, .stat-cell, .hero-stat, .cp-plat, .social');
    cards.forEach(function (c) {
      c.classList.add('reveal');
    });
    if (!('IntersectionObserver' in window)) {
      cards.forEach(function (c) { c.classList.add('visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          e.target.querySelectorAll('.skill-fill').forEach(function (f) {
            f.style.width = f.dataset.width + '%';
          });
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    cards.forEach(function (c) { io.observe(c); });
  }

  /* ---------- nav ---------- */

  function initNav() {
    var burger = document.getElementById('nav-burger');
    var links = document.getElementById('nav-links');
    if (burger && links) {
      burger.addEventListener('click', function () {
        links.classList.toggle('open');
      });
      links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { links.classList.remove('open'); });
      });
    }
  }

  /* ---------- boot ---------- */

  function boot() {
    initMatrix();
    initClock();
    typeLoop();
    initNav();

    fetch('data/profile.json?t=' + Date.now())
      .then(function (res) {
        if (!res.ok) throw new Error('profile.json ' + res.status);
        return res.json();
      })
      .then(function (data) {
        DATA = data;
        renderHeroStats();
        renderAbout();
        renderSkills();
        renderProjects();
        renderStats();
        renderCP();
        renderActivity();
        renderSocials();
        renderFooter();
        initReveal();
      })
      .catch(function (err) {
        console.error('Failed to load profile data:', err);
        document.querySelectorAll('#skills-grid, #projects-grid, #stats-grid, #cp-grid, #activity-list, #socials')
          .forEach(function (w) {
            w.appendChild(el('p', 'accent', '! failed to load data — check network or data/profile.json'));
          });
        initReveal();
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

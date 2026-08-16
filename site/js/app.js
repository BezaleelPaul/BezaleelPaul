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

  /* ---------- web audio sfx ---------- */

  var sfxEnabled = true;
  var audioCtx = null;

  function playCyberSound(freq, type, duration) {
    if (!sfxEnabled) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();

      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq || 600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime((freq || 600) * 1.4, audioCtx.currentTime + (duration || 0.08));

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (duration || 0.08));

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + (duration || 0.08));
    } catch (err) {}
  }

  function initSFX() {
    var toggleBtn = document.getElementById('sfx-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', function () {
      sfxEnabled = !sfxEnabled;
      toggleBtn.textContent = sfxEnabled ? '🔊' : '🔇';
      toggleBtn.title = sfxEnabled ? 'SFX Audio Enabled' : 'SFX Audio Muted';
      if (sfxEnabled) playCyberSound(800, 'triangle', 0.1);
    });
  }

  /* ---------- count-up animation ---------- */

  function animateCount(node, targetVal, duration, suffix) {
    if (!node || isNaN(targetVal)) return;
    suffix = suffix || '';
    var startVal = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var current = Math.floor(progress * (targetVal - startVal) + startVal);
      node.textContent = fmtNumber(current) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        node.textContent = fmtNumber(targetVal) + suffix;
      }
    }
    requestAnimationFrame(step);
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
        if (char === current.length) { deleting = true; return setTimeout(tick, 2400); }
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
      var numVal = parseInt(map[key], 10);
      if (!isNaN(numVal)) {
        var suf = key === 'streak' ? 'd' : '';
        animateCount(node, numVal, 1600, suf);
      } else {
        node.textContent = key === 'streak' ? map[key] + 'd' : fmtNumber(map[key]);
      }
    });

    var status = document.querySelector('.hero-sub');
    if (status && DATA.profile) {
      status.textContent = '';
      status.appendChild(el('span', 'status-dot', ''));
      status.appendChild(document.createTextNode(' Open to opportunities \u00b7 last ' + DATA.profile.status));
    }
  }

  /* ---------- about & interactive terminal ---------- */

  function renderAbout() {
    var wrap = document.getElementById('about-tags');
    if (wrap && DATA.profile) {
      wrap.innerHTML = '';
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

    initInteractiveTerminal();
  }

  function initInteractiveTerminal() {
    var input = document.getElementById('terminal-input');
    var history = document.getElementById('terminal-history');
    var body = document.getElementById('terminal-body');
    var chips = document.querySelectorAll('.term-chip');

    if (!input || !history) return;

    function appendCommand(cmd, outputHtml) {
      var pCmd = el('p', null, '');
      var promptSpan = el('span', 'prompt', '$ ');
      pCmd.appendChild(promptSpan);
      pCmd.appendChild(document.createTextNode(cmd));
      history.appendChild(pCmd);

      if (outputHtml) {
        var pOut = el('p', 'out', '');
        pOut.innerHTML = outputHtml;
        history.appendChild(pOut);
      }

      if (body) body.scrollTop = body.scrollHeight;
      playCyberSound(500, 'sine', 0.05);
    }

    function processCommand(rawCmd) {
      var cmd = rawCmd.trim().toLowerCase();
      if (!cmd) return;

      switch (cmd) {
        case 'help':
          appendCommand(rawCmd, 
            'Available commands:<br>' +
            '&nbsp;&nbsp;<span class="accent">whoami</span>    - Display profile summary<br>' +
            '&nbsp;&nbsp;<span class="accent">skills</span>    - List core technical stack<br>' +
            '&nbsp;&nbsp;<span class="accent">projects</span>  - Show highlighted projects<br>' +
            '&nbsp;&nbsp;<span class="accent">neofetch</span>  - System &amp; profile information<br>' +
            '&nbsp;&nbsp;<span class="accent">socials</span>   - Contact &amp; network handles<br>' +
            '&nbsp;&nbsp;<span class="accent">clear</span>     - Clear terminal logs<br>' +
            '&nbsp;&nbsp;<span class="accent">matrix</span>    - Toggle matrix background opacity'
          );
          break;
        case 'whoami':
          appendCommand(rawCmd, '<span id="term-name">BezForge</span> — Builder, ML Engineer &amp; Competitive Programmer.<br>Bangalore, India · Open to opportunities.');
          break;
        case 'skills':
          if (DATA && DATA.skills) {
            var skillStr = DATA.skills.map(function(s) {
              return '<b>' + s.category + ':</b> ' + s.items.map(function(i){ return i.name; }).join(', ');
            }).join('<br>');
            appendCommand(rawCmd, skillStr);
          } else {
            appendCommand(rawCmd, 'Python · JS · TypeScript · TensorFlow · React · Node.js · C++');
          }
          break;
        case 'projects':
          if (DATA && DATA.projects) {
            var projStr = DATA.projects.map(function(p) {
              return '⚡ <span class="accent">' + p.name + '</span> — ' + p.description;
            }).join('<br>');
            appendCommand(rawCmd, projStr);
          } else {
            appendCommand(rawCmd, 'NADICARE Twin Engine · File Organizer · BESCOM Calculator · Maclaurin Visualizer');
          }
          break;
        case 'neofetch':
          var cfRating = (DATA && DATA.cp && DATA.cp.codeforces) ? DATA.cp.codeforces.rating : '959';
          var lcSolved = (DATA && DATA.cp && DATA.cp.leetcode) ? DATA.cp.leetcode.totalSolved : '188';
          var art = 
            '<pre style="color: var(--accent); font-size: 10px; line-height: 1.1; margin-bottom: 8px;">' +
            '  ____            _____                   \n' +
            ' |  _ \\  ___ ___ |  ___|__  _ __ __ _  ___\n' +
            ' | |_) |/ _ \\_  /| |_ / _ \\| \'__/ _` |/ _ \\\n' +
            ' |  _ <|  __// / |  _| (_) | | | (_| |  __/\n' +
            ' |_| \\_\\\\___/___||_|  \\___/|_|  \\__, |\\___|\n' +
            '                                |___/      </pre>' +
            '------------------------------------------<br>' +
            '<b>OS:</b> BezForge Cyber OS v2.4.0<br>' +
            '<b>Host:</b> GitHub Pages / bezaleelpaul.github.io<br>' +
            '<b>Uptime:</b> Active 24/7<br>' +
            '<b>Languages:</b> Python, JavaScript, TypeScript, C/C++<br>' +
            '<b>Codeforces:</b> ' + cfRating + ' [NEWBIE] | <b>LeetCode Solved:</b> ' + lcSolved;
          appendCommand(rawCmd, art);
          break;
        case 'socials':
        case 'contact':
          appendCommand(rawCmd, 'Email: bezaleel321@gmail.com<br>LinkedIn: linkedin.com/in/bezaleel-paul-7b114b307<br>GitHub: github.com/BezaleelPaul');
          break;
        case 'clear':
          history.innerHTML = '';
          break;
        case 'matrix':
          var m = document.getElementById('matrix-bg');
          if (m) {
            var cur = parseFloat(window.getComputedStyle(m).opacity);
            var next = cur > 0.1 ? '0.05' : '0.35';
            m.style.opacity = next;
            appendCommand(rawCmd, 'Matrix background opacity set to ' + next);
          }
          break;
        default:
          appendCommand(rawCmd, 'Command not found: <span style="color:#ff375f">' + rawCmd + '</span>. Type <span class="accent">help</span> for available commands.');
          break;
      }
    }

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var val = input.value;
        input.value = '';
        processCommand(val);
      }
    });

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var cmd = chip.getAttribute('data-cmd');
        if (cmd) processCommand(cmd);
      });
    });
  }

  /* ---------- skills ---------- */

  function renderSkills() {
    var wrap = document.getElementById('skills-grid');
    if (!wrap) return;
    wrap.innerHTML = '';
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
        fill.style.background = sk.color || 'var(--accent)';
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
    wrap.innerHTML = '';
    DATA.projects.forEach(function (p, idx) {
      var card = el('div', 'card project-card');

      var top = el('div', 'project-top');
      top.appendChild(el('span', 'project-badge', '● ' + p.status));
      top.appendChild(el('span', 'project-icon', '⚡'));
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
      
      var prevA = el('a', null, '🔍 Quick View');
      prevA.href = 'javascript:void(0)';
      prevA.addEventListener('click', function () {
        if (window.openProjectModal) window.openProjectModal(idx);
      });
      links.appendChild(prevA);

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
    grid.innerHTML = '';
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
    var card = svg.closest('.chart-card');
    
    var tooltip = card ? card.querySelector('.chart-tooltip') : null;
    if (card && !tooltip) {
      tooltip = el('div', 'chart-tooltip', '');
      card.appendChild(tooltip);
    }

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
    var dotsHtml = '';

    for (var i = 0; i < series.length; i++) {
      var p = point(i);
      polyPts.push(p[0].toFixed(1) + ',' + p[1].toFixed(1));
      areaPts.push(p[0].toFixed(1) + ',' + p[1].toFixed(1));

      dotsHtml += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="5" fill="var(--accent)" opacity="0" class="chart-point" data-date="' + series[i].date + '" data-count="' + series[i].count + '" style="cursor:pointer; transition: opacity 0.2s, r 0.2s;"/>';
    }
    areaPts.push((padX + chartW) + ',' + (padTop + chartH));

    var defs =
      '<defs>' +
      '<linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="var(--accent)" stop-opacity="0.4"/>' +
      '<stop offset="100%" stop-color="var(--accent-purple)" stop-opacity="0"/>' +
      '</linearGradient>' +
      '</defs>';

    var axis =
      '<line x1="' + padX + '" y1="' + (padTop + chartH) + '" x2="' + (padX + chartW) + '" y2="' + (padTop + chartH) + '" stroke="rgba(255,255,255,0.1)"/>';

    var last = point(series.length - 1);
    var glowDot =
      '<circle cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="6" fill="var(--accent)">' +
      '<animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>' +
      '</circle>';

    svg.innerHTML =
      defs +
      '<polygon points="' + areaPts.join(' ') + '" fill="url(#areaGrad)"/>' +
      '<polyline points="' + polyPts.join(' ') + '" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>' +
      axis + glowDot + dotsHtml;

    svg.querySelectorAll('.chart-point').forEach(function (circle) {
      circle.addEventListener('mouseenter', function (e) {
        circle.setAttribute('r', '8');
        circle.setAttribute('opacity', '1');
        if (tooltip) {
          var date = circle.getAttribute('data-date');
          var count = circle.getAttribute('data-count');
          tooltip.innerHTML = '<b>' + date + '</b>: ' + count + ' contribution' + (count === '1' ? '' : 's');
          tooltip.style.opacity = '1';
          
          var rect = card.getBoundingClientRect();
          var cx = e.clientX - rect.left;
          var cy = e.clientY - rect.top;
          tooltip.style.left = (cx - 40) + 'px';
          tooltip.style.top = (cy - 40) + 'px';
        }
      });
      circle.addEventListener('mouseleave', function () {
        circle.setAttribute('r', '5');
        circle.setAttribute('opacity', '0');
        if (tooltip) tooltip.style.opacity = '0';
      });
    });
  }

  function renderHeatmap(series) {
    var wrap = document.getElementById('heatmap');
    if (!wrap) return;
    wrap.innerHTML = '';
    series.forEach(function (p) {
      var sq = el('span', 'sq');
      var c = p.count === 0 ? '#161b22' : p.count <= 2 ? '#0e4429' : p.count <= 5 ? '#00a300' : 'var(--accent)';
      sq.style.background = c;
      sq.title = p.date + ': ' + p.count + ' contributions';
      wrap.appendChild(sq);
    });
  }

  function renderTopRepos() {
    var wrap = document.getElementById('top-repos');
    if (!wrap) return;
    wrap.innerHTML = '';
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
    grid.innerHTML = '';
    var cf = DATA.cp.codeforces;
    var lc = DATA.cp.leetcode;

    var cfCard = el('div', 'card cp-card');
    cfCard.appendChild(el('h3', 'card-title', '// CODEFORCES'));
    cfCard.appendChild(el('div', null, '@ ' + cf.handle));
    
    var cfRatingNode = el('div', 'rating-big', String(cf.rating));
    cfCard.appendChild(cfRatingNode);
    
    var rankBadge = el('span', 'rank-badge', '[' + cf.rank + ']');
    rankBadge.style.color = cf.color || 'var(--accent)';
    rankBadge.style.borderColor = cf.color || 'var(--accent)';
    cfCard.appendChild(rankBadge);

    var cfRow = el('div', 'cf-row');
    cfRow.appendChild(el('span', 'k', 'Peak rating'));
    cfRow.appendChild(el('span', 'v', String(cf.maxRating) + ' [' + cf.maxRank + ']'));
    cfCard.appendChild(cfRow);

    grid.appendChild(cfCard);

    var lcCard = el('div', 'card cp-card');
    lcCard.appendChild(el('h3', 'card-title', '// LEETCODE'));
    lcCard.appendChild(el('div', null, '@ ' + lc.username));
    
    var lcSolvedNode = el('div', 'rating-big', String(lc.totalSolved));
    lcCard.appendChild(lcSolvedNode);
    
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
    wrap.innerHTML = '';
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
    list.innerHTML = '';
    var act = DATA.activity;
    if (!act || !act.length) {
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
    linkedin: '#0077B5', github: '#24292e', portfolio: '#00f2fe',
    kaggle: '#20BEFF', codeforces: '#1F8ACB', leetcode: '#FFA116',
    codechef: '#5B4638', hackerrank: '#2EC866',
  };

  function renderSocials() {
    var wrap = document.getElementById('socials');
    if (!wrap) return;
    wrap.innerHTML = '';
    DATA.socials.forEach(function (s) {
      var a = el('a', 'social', '');
      a.href = s.url; a.target = '_blank'; a.rel = 'noopener';

      var icon = el('span', 'social-icon', s.icon);
      icon.style.background = SOCIAL_STYLES[s.name.toLowerCase()] || '#30363d';
      a.appendChild(icon);

      var text = el('span', 'social-info', '');
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

  /* ---------- custom ring cursor ---------- */

  function initCustomCursor() {
    var dot = document.getElementById('cursor-dot');
    var ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    var rx = 0, ry = 0;
    var mx = 0, my = 0;

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px, ' + my + 'px) translate(-50%, -50%)';
    });

    function loop() {
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;
      ring.style.transform = 'translate(' + rx + 'px, ' + ry + 'px) translate(-50%, -50%)';
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    document.querySelectorAll('a, button, .card, .tag, .stat-cell, .cp-plat, .social').forEach(function (node) {
      node.addEventListener('mouseenter', function () { ring.classList.add('hover'); });
      node.addEventListener('mouseleave', function () { ring.classList.remove('hover'); });
    });
  }

  /* ---------- theme picker ---------- */

  function initThemePicker() {
    var dots = document.querySelectorAll('.theme-dot');
    var savedTheme = localStorage.getItem('bez_theme') || 'cyan';

    function setTheme(theme) {
      document.body.dataset.theme = theme;
      dots.forEach(function (d) {
        if (d.getAttribute('data-theme') === theme) d.classList.add('active');
        else d.classList.remove('active');
      });
      localStorage.setItem('bez_theme', theme);
    }

    setTheme(savedTheme);

    dots.forEach(function (d) {
      d.addEventListener('click', function () {
        var theme = d.getAttribute('data-theme');
        setTheme(theme);
        playCyberSound(900, 'sine', 0.06);
      });
    });
  }

  /* ---------- 3d card tilt ---------- */

  function init3DTilt() {
    var cards = document.querySelectorAll('.card, .hero-stat, .stat-cell');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var cx = rect.width / 2;
        var cy = rect.height / 2;

        var rotateX = ((y - cy) / cy) * -5;
        var rotateY = ((x - cx) / cx) * 5;

        card.style.transform = 'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-4px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ---------- project preview modal ---------- */

  function initProjectModal() {
    var modal = document.getElementById('project-modal');
    var backdrop = document.getElementById('modal-backdrop');
    var closeBtn = document.getElementById('modal-close');
    var body = document.getElementById('modal-body');

    if (!modal || !body) return;

    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }

    if (backdrop) backdrop.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

    window.openProjectModal = function (projectIndex) {
      if (!DATA || !DATA.projects || !DATA.projects[projectIndex]) return;
      var p = DATA.projects[projectIndex];

      body.innerHTML = '';
      body.appendChild(el('h2', 'project-name', p.name));
      body.appendChild(el('p', 'project-desc', p.description));

      var featTitle = el('h4', 'card-title', '// KEY ARCHITECTURE FEATURES');
      featTitle.style.marginTop = '20px';
      body.appendChild(featTitle);

      var feats = el('ul', 'project-features');
      (p.features || []).forEach(function (f) { feats.appendChild(el('li', null, f)); });
      body.appendChild(feats);

      var stack = el('div', 'project-stack');
      (p.stack || []).forEach(function (s) { stack.appendChild(el('span', 'stack-tag', s)); });
      body.appendChild(stack);

      var links = el('div', 'project-links');
      if (p.demo) {
        var demoA = el('a', 'btn btn-primary', '↗ Live Demo');
        demoA.href = p.demo; demoA.target = '_blank'; demoA.rel = 'noopener';
        links.appendChild(demoA);
      }
      var repoA = el('a', 'btn btn-ghost', '⌥ GitHub Repository');
      repoA.href = p.repo; repoA.target = '_blank'; repoA.rel = 'noopener';
      links.appendChild(repoA);
      body.appendChild(links);

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      playCyberSound(750, 'sine', 0.08);
    };
  }

  /* ---------- hacker matrix background with mouse physics ---------- */

  function initMatrix() {
    var canvas = document.getElementById('matrix-bg');
    if (!canvas) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ctx = canvas.getContext('2d');
    var CHARS = '0123456789ABCDEF@#$%&*+=;:<>/[]{}\\|~BEZFORGE'.split('');
    var FONT = 14;
    var cols = 0, drops = [];
    var fade = 'rgba(5, 7, 15, 0.08)';

    var mouseX = -1000, mouseY = -1000;
    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      var b1 = document.querySelector('.blob-1');
      var b2 = document.querySelector('.blob-2');
      if (b1) b1.style.transform = 'translate(' + (e.clientX * 0.02) + 'px, ' + (e.clientY * 0.02) + 'px)';
      if (b2) b2.style.transform = 'translate(' + (-e.clientX * 0.02) + 'px, ' + (-e.clientY * 0.02) + 'px)';
    });

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
      if (ts - last > 45) {
        ctx.fillStyle = fade;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = FONT + 'px monospace';

        for (var i = 0; i < drops.length; i++) {
          var ch = CHARS[Math.floor(Math.random() * CHARS.length)];
          var x = i * FONT;
          var y = drops[i] * FONT;

          var dist = Math.hypot(x - mouseX, y - mouseY);
          if (dist < 100) {
            ctx.fillStyle = 'var(--accent)';
            ctx.globalAlpha = 0.95;
          } else {
            ctx.fillStyle = i % 8 === 0 ? 'var(--accent-purple)' : 'var(--accent)';
            ctx.globalAlpha = 0.5;
          }

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

  /* ---------- scroll indicators & nav spy ---------- */

  function initScrollProgress() {
    var bar = document.getElementById('scroll-progress');
    var nav = document.getElementById('nav');
    var btt = document.getElementById('back-to-top');
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    window.addEventListener('scroll', function () {
      var sTop = window.scrollY;
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var pct = (sTop / docH) * 100;

      if (bar) bar.style.width = pct + '%';

      if (nav) {
        if (sTop > 40) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
      }

      if (btt) {
        if (sTop > 400) btt.classList.add('visible');
        else btt.classList.remove('visible');
      }

      var current = '';
      sections.forEach(function (sec) {
        var top = sec.offsetTop - 140;
        var h = sec.offsetHeight;
        if (sTop >= top && sTop < top + h) {
          current = sec.getAttribute('id');
        }
      });

      navLinks.forEach(function (a) {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + current) {
          a.classList.add('active');
        }
      });
    });

    if (btt) {
      btt.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ---------- animations & card hover glow ---------- */

  function initReveal() {
    var cards = document.querySelectorAll('.card, .stat-cell, .hero-stat, .cp-plat, .social');
    cards.forEach(function (c) {
      c.classList.add('reveal');
      
      c.addEventListener('mousemove', function (e) {
        var rect = c.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        c.style.setProperty('--mouse-x', x + 'px');
        c.style.setProperty('--mouse-y', y + 'px');
      });
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
    }, { threshold: 0.1 });

    cards.forEach(function (c) { io.observe(c); });
  }

  /* ---------- nav burger ---------- */

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
    initCustomCursor();
    initSFX();
    initThemePicker();
    initProjectModal();
    initMatrix();
    initClock();
    typeLoop();
    initNav();
    initScrollProgress();

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
        init3DTilt();
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

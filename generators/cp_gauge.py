import os
import json
import random
import urllib.request

def fetch_codeforces_data(handle="BezaleelPaulN"):
    url = f"https://codeforces.com/api/user.info?handles={handle}"
    headers = {"User-Agent": "Mozilla/5.0"}
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                data = json.loads(response.read().decode())
                if data.get("status") == "OK" and data.get("result"):
                    u = data["result"][0]
                    return {
                        "handle": u.get("handle", handle),
                        "rating": u.get("rating", 0),
                        "maxRating": u.get("maxRating", 0),
                        "rank": u.get("rank", "unrated").upper(),
                        "maxRank": u.get("maxRank", "unrated").upper(),
                    }
    except Exception as e:
        print(f"Error fetching Codeforces stats: {e}")
    return {"handle": handle, "rating": 1380, "maxRating": 1420, "rank": "PUPIL", "maxRank": "PUPIL"}

def fetch_leetcode_data(username="BezaleelPaulN"):
    url = "https://leetcode.com/graphql"
    query = {
        "query": """
        query userPublicProfile($username: String!) {
          matchedUser(username: $username) {
            username
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
            }
            profile {
              ranking
              reputation
            }
          }
        }
        """,
        "variables": {"username": username}
    }
    data = json.dumps(query).encode()
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com/",
    }
    req = urllib.request.Request(url, data=data, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                result = json.loads(response.read().decode())
                user = result.get("data", {}).get("matchedUser")
                if user:
                    stats = user.get("submitStats", {}).get("acSubmissionNum", [])
                    solved = {s["difficulty"].lower(): s["count"] for s in stats}
                    total = sum(solved.values())
                    return {
                        "username": user.get("username", username),
                        "totalSolved": total,
                        "easy": solved.get("easy", 0),
                        "medium": solved.get("medium", 0),
                        "hard": solved.get("hard", 0),
                        "ranking": user.get("profile", {}).get("ranking", 0),
                    }
    except Exception as e:
        print(f"Error fetching LeetCode stats: {e}")
    return {"username": username, "totalSolved": 42, "easy": 20, "medium": 18, "hard": 4, "ranking": 500000}

def get_rank_color(rank):
    r = rank.lower()
    if "legendary" in r or "grandmaster" in r: return "#ff3333"
    if "candidate" in r or "master" in r: return "#ffcc33"
    if "expert" in r: return "#aa00aa"
    if "specialist" in r: return "#3333ff"
    if "pupil" in r: return "#39ff14"
    if "newbie" in r: return "#8b949e"
    return "#39ff14"

RANK_BANDS = [
    ("NEWBIE", 0, 1199),
    ("PUPIL", 1200, 1399),
    ("SPECIALIST", 1400, 1599),
    ("EXPERT", 1600, 1899),
    ("CANDIDATE MASTER", 1900, 2199),
    ("MASTER", 2200, 2399),
    ("INTERNATIONAL MASTER", 2400, 2599),
    ("GRANDMASTER", 2600, 2899),
    ("LEGENDARY GRANDMASTER", 2900, 3300),
]

def get_rank_progress(rating, rank):
    rank = (rank or "NEWBIE").upper()
    idx = next((i for i, b in enumerate(RANK_BANDS) if b[0] == rank), None)
    if idx is None:
        for i, (name, lo, hi) in enumerate(RANK_BANDS):
            if lo <= rating <= hi:
                idx = i
                break
    if idx is None:
        idx = 0
    cur, lo, hi = RANK_BANDS[idx]
    if idx >= len(RANK_BANDS) - 1:
        return cur, cur, 1.0, hi
    nxt, nlo, nhi = RANK_BANDS[idx + 1]
    pct = (rating - lo) / (nlo - lo) if nlo > lo else 1.0
    return cur, nxt, max(0.0, min(1.0, pct)), nlo

def generate_matrix_columns(width, height):
    cols = []
    x = 8
    while x < width:
        length = random.randint(6, 14)
        duration = random.uniform(2.2, 4.8)
        delay = random.uniform(0.0, 4.5)
        opacity = random.uniform(0.10, 0.28)
        chars = "".join(random.choice("0123456789ABCDEF@#$%*+=;:.?[]") for _ in range(length))
        cols.append({
            "x": x,
            "chars": chars,
            "length": length,
            "duration": duration,
            "delay": delay,
            "opacity": opacity,
        })
        x += random.randint(18, 34)
    return cols

def generate_cp_gauge():
    cf_handle = "BezaleelPaulN"
    lc_username = "BezaleelPaulN"
    cf_data = fetch_codeforces_data(cf_handle)
    lc_data = fetch_leetcode_data(lc_username)

    rating = cf_data["rating"]
    max_rating = cf_data["maxRating"]
    rank = cf_data["rank"]
    max_rank = cf_data["maxRank"]
    rank_color = get_rank_color(rank)
    max_rank_color = get_rank_color(max_rank)

    cur_rank, next_rank, rank_pct, next_threshold = get_rank_progress(rating, rank)

    lc_easy = lc_data["easy"]
    lc_medium = lc_data["medium"]
    lc_hard = lc_data["hard"]
    lc_total = lc_data["totalSolved"]
    lc_ranking = lc_data["ranking"]
    lc_sum = max(1, lc_easy + lc_medium + lc_hard)
    easy_w = int(198 * (lc_easy / lc_sum))
    medium_w = int(198 * (lc_medium / lc_sum))
    hard_w = 198 - easy_w - medium_w

    gauge_rating = min(max(0, rating), 3000)
    angle = (gauge_rating / 3000.0) * 240.0 - 120.0

    arc_len = 369
    filled = (gauge_rating / 3000.0) * arc_len
    fill_offset = int(arc_len - filled)

    rank_chip_w = 16 + len(rank) * 7
    bar_w = int(220 * rank_pct)
    rank_pct_text = f"{rank_pct * 100:.1f}%"

    matrix_cols = generate_matrix_columns(800, 300)
    matrix_elements = ""
    for col in matrix_cols:
        tspans = ""
        for i, ch in enumerate(col["chars"]):
            head = ' fill="#d8ffd0"' if i == 0 else ' fill="#39ff14"'
            tspans += f'<tspan x="{col["x"]}" dy="10"{head}>{ch}</tspan>'
        matrix_elements += f'''
    <text x="{col["x"]}" y="0" font-family="monospace" font-size="10" opacity="{col["opacity"]}" filter="url(#soft-glow)">
      {tspans}
      <animateTransform attributeName="transform" type="translate" values="0,-{col["length"] * 10 + 70};0,320" dur="{col["duration"]}s" begin="{col["delay"]}s" repeatCount="indefinite"/>
    </text>'''

    svg_content = f'''<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cp-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#070a0e;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#0a1508;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#070a0e;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="dial-grad" x1="0%" y1="100%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#39ff14;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff375f;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="glow-spot" cx="50%" cy="45%" r="55%">
      <stop offset="0%" style="stop-color:#39ff14;stop-opacity:0.08" />
      <stop offset="100%" style="stop-color:#39ff14;stop-opacity:0" />
    </radialGradient>
    <filter id="neon-glow">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="soft-glow">
      <feGaussianBlur stdDeviation="1.5" result="blur" />
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <style>
      .bg-card {{ fill: url(#cp-bg); stroke: #39ff14; stroke-width: 1.5; stroke-opacity: 0.25; rx: 10px; }}
      .panel {{ fill: #0d1117; fill-opacity: 0.82; stroke: #30363d; stroke-width: 1; rx: 8px; }}
      .panel-glow {{ stroke: #39ff14; stroke-opacity: 0.08; stroke-width: 1; fill: none; rx: 8px; }}
      .sec-title {{ font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 12px; fill: #39ff14; font-weight: bold; letter-spacing: 2px; }}
      .sec-line {{ stroke: #30363d; stroke-width: 1; }}
      .handle {{ font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 800; fill: #39ff14; letter-spacing: 1px; }}
      .label {{ font-family: 'JetBrains Mono', monospace; font-size: 9px; fill: #8b949e; letter-spacing: 1px; }}
      .value-big {{ font-family: 'JetBrains Mono', monospace; font-size: 34px; font-weight: 800; fill: #39ff14; filter: url(#neon-glow); }}
      .value {{ font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 700; fill: #c9d1d9; }}
      .sub {{ font-family: 'JetBrains Mono', monospace; font-size: 10px; fill: #8b949e; }}
      .chip {{ fill: #161b22; }}
      .bar-track {{ fill: #161b22; rx: 4px; }}
      .bar-fill {{ filter: url(#soft-glow); }}
      .term-cursor {{ font-family: 'JetBrains Mono', monospace; font-size: 13px; fill: #39ff14; }}
      .live-dot {{ fill: #39ff14; filter: url(#soft-glow); }}
      .dial-label {{ font-family: 'JetBrains Mono', monospace; font-size: 9px; fill: #8b949e; text-anchor: middle; letter-spacing: 1px; }}
      .dial-val {{ font-family: 'JetBrains Mono', monospace; font-size: 30px; font-weight: 800; fill: #e6edf3; text-anchor: middle; }}
      .dial-bg {{ stroke: #161b22; stroke-width: 14; fill: none; stroke-linecap: round; }}
      .dial-fill {{ stroke: url(#dial-grad); stroke-width: 14; fill: none; stroke-linecap: round; filter: url(#soft-glow); }}
      .needle {{ stroke: #ff375f; stroke-width: 3.5; stroke-linecap: round; filter: url(#soft-glow); }}
      .needle-cap {{ fill: #ff375f; stroke: #0d1117; stroke-width: 2; }}
      .footer {{ font-family: 'JetBrains Mono', monospace; font-size: 9px; fill: #484f58; }}
    </style>
  </defs>

  <rect x="2" y="2" width="796" height="296" class="bg-card" />

  <circle cx="400" cy="160" r="290" fill="url(#glow-spot)" />

  {matrix_elements}

  <rect x="2" width="796" height="42" fill="#39ff14" opacity="0.035">
    <animate attributeName="y" values="-42;300" dur="6.5s" repeatCount="indefinite"/>
  </rect>

  <line x1="16" y1="38" x2="784" y2="38" class="sec-line" />

  <text x="30" y="26" class="term-cursor">sudo ./cp_monitor --live</text>
  <text x="202" y="26" class="term-cursor">█<animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite"/></text>

  <rect x="640" y="12" width="128" height="20" rx="10" fill="#161b22" stroke="#39ff14" stroke-opacity="0.4" />
  <circle cx="655" cy="22" r="3.5" class="live-dot"><animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite"/></circle>
  <text x="666" y="25.5" font-family="'JetBrains Mono', monospace" font-size="9" fill="#39ff14" letter-spacing="1">LIVE SYNC</text>

  <rect x="16" y="48" width="248" height="228" class="panel" />
  <rect x="16" y="48" width="248" height="228" class="panel-glow" />

  <text x="30" y="68" class="sec-title">// CODEFORCES</text>
  <line x1="30" y1="76" x2="250" y2="76" class="sec-line" />

  <text x="30" y="94" class="handle">{cf_handle}</text>

  <rect x="30" y="104" width="{rank_chip_w}" height="20" rx="10" class="chip" stroke="{rank_color}" stroke-opacity="0.6" />
  <text x="{30 + rank_chip_w // 2}" y="118" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="bold" fill="{rank_color}" text-anchor="middle">{rank}</text>

  <text x="30" y="150" class="label">CURRENT RATING</text>
  <text x="30" y="184" class="value-big">{rating}</text>

  <text x="30" y="208" class="label">PEAK RATING  <tspan fill="{max_rank_color}" font-weight="bold">{max_rating} [{max_rank}]</tspan></text>

  <text x="30" y="230" class="label">RANK PROGRESS → <tspan fill="#39ff14" font-weight="bold">{next_rank}</tspan></text>
  <rect x="30" y="238" width="220" height="8" class="bar-track" />
  <rect x="30" y="238" width="{bar_w}" height="8" class="bar-fill" fill="{rank_color}">
    <animate attributeName="width" from="0" to="{bar_w}" dur="1.6s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1"/>
  </rect>
  <text x="258" y="245" font-family="'JetBrains Mono', monospace" font-size="9" fill="{rank_color}" text-anchor="end">{rank_pct_text}</text>

  <text x="30" y="266" class="sub" font-size="9" fill="#58a6ff">next rank @ {next_threshold} · CF API 6h</text>

  <rect x="280" y="48" width="240" height="228" class="panel" />
  <rect x="280" y="48" width="240" height="228" class="panel-glow" />

  <text x="400" y="68" class="sec-title" text-anchor="middle">// RATING GAUGE</text>
  <line x1="292" y1="76" x2="508" y2="76" class="sec-line" />

  <path d="M 323.8,229 A 88,88 0 1 1 476.2,229" class="dial-bg" />
  <path d="M 323.8,229 A 88,88 0 1 1 476.2,229" class="dial-fill" stroke-dasharray="{arc_len}" stroke-dashoffset="{arc_len}">
    <animate attributeName="stroke-dashoffset" from="{arc_len}" to="{fill_offset}" dur="1.8s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1"/>
  </path>

  <text x="400" y="176" class="dial-val">{rating}</text>
  <text x="400" y="194" class="dial-label">CF RATING</text>

  <line x1="400" y1="185" x2="400" y2="115" class="needle" transform="rotate({angle} 400 185)">
    <animateTransform attributeName="transform" type="rotate" from="-120 400 185" to="{angle} 400 185" dur="1.8s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1"/>
  </line>
  <circle cx="400" cy="185" r="7" class="needle-cap" />
  <circle cx="400" cy="185" r="2.5" fill="#0d1117" />

  <text x="323.8" y="252" class="dial-label" text-anchor="start" font-size="8">0</text>
  <text x="476.2" y="252" class="dial-label" text-anchor="end" font-size="8">3000</text>
  <text x="400" y="86" class="dial-label" font-size="7">1500</text>

  <text x="400" y="268" class="sub" text-anchor="middle" font-size="9" fill="#58a6ff">rank color · live 6h sync</text>

  <rect x="536" y="48" width="248" height="228" class="panel" />
  <rect x="536" y="48" width="248" height="228" class="panel-glow" />

  <text x="550" y="68" class="sec-title">// LEETCODE</text>
  <line x1="550" y1="76" x2="770" y2="76" class="sec-line" />

  <text x="550" y="94" class="handle" fill="#FFA116">{lc_username}</text>

  <text x="550" y="118" class="label">PROBLEMS SOLVED</text>
  <text x="550" y="152" class="value-big" fill="#FFA116" filter="url(#neon-glow)">{lc_total}</text>

  <rect x="550" y="164" width="64" height="24" rx="6" class="chip" stroke="#00b8a3" stroke-opacity="0.5" />
  <text x="571" y="176" font-family="'JetBrains Mono', monospace" font-size="10" fill="#00b8a3" text-anchor="middle" font-weight="bold">E</text>
  <text x="603" y="180" font-family="'JetBrains Mono', monospace" font-size="11" fill="#c9d1d9">{lc_easy}</text>

  <rect x="622" y="164" width="64" height="24" rx="6" class="chip" stroke="#ffc01e" stroke-opacity="0.5" />
  <text x="643" y="176" font-family="'JetBrains Mono', monospace" font-size="10" fill="#ffc01e" text-anchor="middle" font-weight="bold">M</text>
  <text x="675" y="180" font-family="'JetBrains Mono', monospace" font-size="11" fill="#c9d1d9">{lc_medium}</text>

  <rect x="694" y="164" width="64" height="24" rx="6" class="chip" stroke="#ff375f" stroke-opacity="0.5" />
  <text x="715" y="176" font-family="'JetBrains Mono', monospace" font-size="10" fill="#ff375f" text-anchor="middle" font-weight="bold">H</text>
  <text x="747" y="180" font-family="'JetBrains Mono', monospace" font-size="11" fill="#c9d1d9">{lc_hard}</text>

  <text x="550" y="212" class="label">GLOBAL RANKING</text>
  <text x="550" y="236" class="value">#{lc_ranking:,}</text>

  <rect x="550" y="248" width="198" height="8" class="bar-track" />
  <rect x="550" y="248" width="{easy_w}" height="8" fill="#00b8a3" opacity="0.85" />
  <rect x="{550 + easy_w}" y="248" width="{medium_w}" height="8" fill="#ffc01e" opacity="0.85" />
  <rect x="{550 + easy_w + medium_w}" y="248" width="{hard_w}" height="8" fill="#ff375f" opacity="0.85" />

  <text x="550" y="268" class="sub" font-size="9" fill="#58a6ff">difficulty split · LC API 6h</text>

  <text x="30" y="292" class="footer">$ ./cp_monitor --interval 6h</text>
  <text x="770" y="292" class="footer" text-anchor="end">BF//CP-MON v2.1</text>
</svg>'''

    os.makedirs("assets", exist_ok=True)
    with open("assets/cp_gauge.svg", "w", encoding="utf-8") as f:
        f.write(svg_content)
    print("Generated cp_gauge.svg successfully.")

if __name__ == "__main__":
    generate_cp_gauge()
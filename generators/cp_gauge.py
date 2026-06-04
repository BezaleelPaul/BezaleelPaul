import os
import json
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

def fetch_leetcode_data(username="LavaElixir"):
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

def generate_cp_gauge():
    cf_handle = "BezaleelPaulN"
    lc_username = "LavaElixir"
    cf_data = fetch_codeforces_data(cf_handle)
    lc_data = fetch_leetcode_data(lc_username)

    rating = cf_data["rating"]
    max_rating = cf_data["maxRating"]
    rank = cf_data["rank"]
    max_rank = cf_data["maxRank"]
    rank_color = get_rank_color(rank)

    gauge_rating = min(max(0, rating), 3000)
    angle = (gauge_rating / 3000.0) * 240.0 - 120.0

    svg_content = f'''<svg viewBox="0 0 800 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cp-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0d1117;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#070a0e;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <style>
      .bg-card {{ fill: url(#cp-bg); stroke: #39ff14; stroke-width: 1.5; stroke-opacity: 0.25; rx: 10px; }}
      .panel {{ stroke: #30363d; stroke-width: 1; fill: none; rx: 8px; }}
      .sec-title {{ font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 13px; fill: #39ff14; font-weight: bold; letter-spacing: 2px; }}
      .stat-label {{ font-family: 'JetBrains Mono', monospace; font-size: 10px; fill: #8b949e; letter-spacing: 1px; }}
      .stat-val {{ font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 800; fill: {rank_color}; filter: drop-shadow(0 0 4px {rank_color}55); }}
      .stat-rank {{ font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: bold; fill: {rank_color}; }}
      .stat-plain {{ font-family: 'JetBrains Mono', monospace; font-size: 14px; fill: #c9d1d9; }}
      .lc-easy {{ fill: #00b8a3; }}
      .lc-medium {{ fill: #ffc01e; }}
      .lc-hard {{ fill: #ff375f; }}
      .dial-label {{ font-family: 'JetBrains Mono', monospace; font-size: 9px; fill: #8b949e; text-anchor: middle; }}
      .dial-val {{ font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: bold; fill: #c9d1d9; text-anchor: middle; }}
      .dial-bg {{ stroke: #161b22; stroke-width: 8; fill: none; stroke-linecap: round; }}
      .dial-fill {{ stroke: {rank_color}; stroke-width: 8; fill: none; stroke-linecap: round; filter: url(#glow); stroke-dasharray: 400; stroke-dashoffset: 400; }}
      .needle {{ stroke: #ff4444; stroke-width: 3; stroke-linecap: round; }}
      .needle-cap {{ fill: #ff4444; stroke: #0d1117; stroke-width: 2; }}
    </style>
  </defs>

  <rect x="2" y="2" width="796" height="236" class="bg-card" />

  <rect x="16" y="16" width="320" height="208" class="panel" />
  <text x="30" y="38" class="sec-title">// CODEFORCES</text>
  <line x1="30" y1="46" x2="322" y2="46" stroke="#30363d" stroke-width="0.5" />

  <text x="30" y="70" class="stat-label" fill="#39ff14" font-weight="bold" font-size="14">{cf_handle}</text>

  <text x="30" y="100" class="stat-label">CURRENT RATING</text>
  <text x="30" y="125" class="stat-val">{rating}</text>
  <text x="130" y="123" class="stat-rank">[{rank}]</text>

  <text x="30" y="155" class="stat-label">PEAK RATING</text>
  <text x="30" y="175" class="stat-plain">{max_rating} <tspan fill="{rank_color}" font-weight="bold">[{max_rank}]</tspan></text>

  <text x="30" y="205" class="stat-label" font-size="9" fill="#58a6ff">Syncs every 6 hours · Codeforces API</text>

  <rect x="352" y="16" width="432" height="208" class="panel" />
  <text x="366" y="38" class="sec-title">// LEETCODE &amp; CP GAUGE</text>
  <line x1="366" y1="46" x2="770" y2="46" stroke="#30363d" stroke-width="0.5" />

  <text x="366" y="68" class="stat-label" fill="#FFA116" font-weight="bold" font-size="13">{lc_username}</text>

  <text x="366" y="92" class="stat-label">PROBLEMS SOLVED</text>
  <text x="366" y="118" class="stat-plain" font-size="26" font-weight="800" fill="#FFA116">{lc_data["totalSolved"]}</text>

  <rect x="366" y="132" width="36" height="16" rx="3" fill="#00b8a3" opacity="0.3" />
  <text x="384" y="144" font-family="'JetBrains Mono', monospace" font-size="10" fill="#00b8a3" text-anchor="middle" font-weight="bold">E</text>
  <text x="408" y="144" font-family="'JetBrains Mono', monospace" font-size="11" fill="#c9d1d9">{lc_data["easy"]}</text>

  <rect x="440" y="132" width="36" height="16" rx="3" fill="#ffc01e" opacity="0.3" />
  <text x="458" y="144" font-family="'JetBrains Mono', monospace" font-size="10" fill="#ffc01e" text-anchor="middle" font-weight="bold">M</text>
  <text x="482" y="144" font-family="'JetBrains Mono', monospace" font-size="11" fill="#c9d1d9">{lc_data["medium"]}</text>

  <rect x="514" y="132" width="36" height="16" rx="3" fill="#ff375f" opacity="0.3" />
  <text x="532" y="144" font-family="'JetBrains Mono', monospace" font-size="10" fill="#ff375f" text-anchor="middle" font-weight="bold">H</text>
  <text x="556" y="144" font-family="'JetBrains Mono', monospace" font-size="11" fill="#c9d1d9">{lc_data["hard"]}</text>

  <text x="366" y="175" class="stat-label">GLOBAL RANKING</text>
  <text x="366" y="195" class="stat-plain" font-size="13">#{lc_data["ranking"]:,}</text>

  <g transform="translate(610, 55)">
    <path d="M 14.38,110 A 70,70 0 1 1 135.62,110" class="dial-bg" />
    <path d="M 14.38,110 A 70,70 0 1 1 135.62,110" class="dial-fill" stroke-dasharray="293" stroke-dashoffset="293">
      <animate attributeName="stroke-dashoffset" from="293" to="{293 - int((gauge_rating / 3000.0) * 293)}" dur="1.5s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1"/>
    </path>

    <text x="75" y="68" class="dial-val">{rating}</text>
    <text x="75" y="85" class="dial-label">CF RATING</text>

    <line x1="75" y1="75" x2="75" y2="20" stroke="#ff4444" stroke-width="2.5" stroke-linecap="round" transform-origin="75 75">
      <animateTransform attributeName="transform" type="rotate" from="-120 75 75" to="{angle} 75 75" dur="1.5s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1"/>
    </line>
    <circle cx="75" cy="75" r="6" fill="#ff4444" />
    <circle cx="75" cy="75" r="2.5" fill="#0d1117" />

    <text x="14" y="124" class="dial-label" text-anchor="start" font-size="8">0</text>
    <text x="135" y="124" class="dial-label" text-anchor="end" font-size="8">3000</text>
    <text x="75" y="18" class="dial-label" font-size="7">1500</text>
  </g>
</svg>'''

    os.makedirs("assets", exist_ok=True)
    with open("assets/cp_gauge.svg", "w", encoding="utf-8") as f:
        f.write(svg_content)
    print("Generated cp_gauge.svg successfully.")

if __name__ == "__main__":
    generate_cp_gauge()

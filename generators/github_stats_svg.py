import os
import json
import urllib.request

def fetch_repo_stars(username="BezaleelPaul"):
    url = f"https://api.github.com/users/{username}/repos?per_page=100&sort=updated"
    headers = {"User-Agent": "Mozilla/5.0"}
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("TOKEN")
    if token:
        headers["Authorization"] = f"token {token}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                repos = json.loads(response.read().decode())
                total_stars = sum(r.get("stargazers_count", 0) for r in repos)
                total_forks = sum(r.get("forks_count", 0) for r in repos)
                total_watchers = sum(r.get("watchers_count", 0) for r in repos)
                top_repos = sorted(repos, key=lambda r: r.get("stargazers_count", 0), reverse=True)[:5]
                top = [{"name": r["name"], "stars": r["stargazers_count"]} for r in top_repos if r.get("stargazers_count", 0) > 0]
                return total_stars, total_forks, total_watchers, top
    except Exception as e:
        print(f"Error fetching repo stats: {e}")
    return 0, 0, 0, []

def fetch_user_stats(username="BezaleelPaul"):
    url = f"https://api.github.com/users/{username}"
    headers = {"User-Agent": "Mozilla/5.0"}
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("TOKEN")
    if token:
        headers["Authorization"] = f"token {token}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                data = json.loads(response.read().decode())
                return {
                    "repos": data.get("public_repos", 0),
                    "followers": data.get("followers", 0),
                    "following": data.get("following", 0),
                    "gists": data.get("public_gists", 0),
                    "created": data.get("created_at", ""),
                }
    except Exception as e:
        print(f"Error fetching user stats: {e}")
    return {"repos": 0, "followers": 0, "following": 0, "gists": 0, "created": ""}

def generate_github_stats():
    username = "BezaleelPaul"
    user_data = fetch_user_stats(username)
    total_stars, total_forks, total_watchers, top_repos = fetch_repo_stars(username)

    svg_content = f'''<svg viewBox="0 0 800 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gs-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0d1117;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#070a0e;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <style>
      .bg-card {{ fill: url(#gs-grad); stroke: #39ff14; stroke-width: 1.5; stroke-opacity: 0.25; rx: 10px; }}
      .panel {{ stroke: #30363d; stroke-width: 1; fill: none; rx: 8px; }}
      .sec-title {{ font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 13px; fill: #39ff14; font-weight: bold; letter-spacing: 2px; }}
      .metric-title {{ font-family: 'JetBrains Mono', monospace; font-size: 10px; fill: #8b949e; letter-spacing: 1px; }}
      .metric-val {{ font-family: 'JetBrains Mono', monospace; font-size: 24px; font-weight: 800; fill: #c9d1d9; }}
      .metric-highlight {{ fill: #39ff14; filter: drop-shadow(0 0 4px rgba(57, 255, 20, 0.4)); }}
      .metric-orange {{ fill: #FFA116; }}
      .dot {{ font-family: 'JetBrains Mono', monospace; font-size: 10px; fill: #8b949e; }}
      .repo-name {{ font-family: 'JetBrains Mono', monospace; font-size: 11px; fill: #c9d1d9; }}
      .repo-stars {{ font-family: 'JetBrains Mono', monospace; font-size: 11px; fill: #FFA116; font-weight: bold; }}
    </style>
  </defs>

  <rect x="2" y="2" width="796" height="236" class="bg-card" />

  <rect x="16" y="16" width="370" height="208" class="panel" />
  <text x="30" y="38" class="sec-title">// GITHUB ANALYTICS</text>
  <line x1="30" y1="46" x2="372" y2="46" stroke="#30363d" stroke-width="0.5" />

  <text x="50" y="78" class="metric-title" text-anchor="middle">STARS EARNED</text>
  <text x="50" y="108" class="metric-val metric-highlight" text-anchor="middle">{total_stars}</text>

  <text x="140" y="78" class="metric-title" text-anchor="middle">FORKS</text>
  <text x="140" y="108" class="metric-val" text-anchor="middle">{total_forks}</text>

  <text x="230" y="78" class="metric-title" text-anchor="middle">FOLLOWERS</text>
  <text x="230" y="108" class="metric-val" text-anchor="middle">{user_data["followers"]}</text>

  <text x="320" y="78" class="metric-title" text-anchor="middle">REPOS</text>
  <text x="320" y="108" class="metric-val" text-anchor="middle">{user_data["repos"]}</text>

  <line x1="30" y1="125" x2="372" y2="125" stroke="#30363d" stroke-width="0.5" stroke-dasharray="3 3" />

  <text x="30" y="148" class="metric-title">ACCOUNT AGE</text>
  <text x="30" y="168" class="dot" font-size="12">
    Since {user_data["created"][:10] if user_data["created"] else "N/A"}
  </text>

  <text x="30" y="195" class="metric-title">GITHUB PUBLIC GISTS</text>
  <text x="30" y="215" class="metric-val" font-size="18">{user_data["gists"]}</text>

  <rect x="402" y="16" width="382" height="208" class="panel" />
  <text x="416" y="38" class="sec-title">// TOP REPOS BY STARS</text>
  <line x1="416" y1="46" x2="770" y2="46" stroke="#30363d" stroke-width="0.5" />'''

    y_start = 72
    for i, repo in enumerate(top_repos[:6]):
        y = y_start + i * 28
        svg_content += f'''
  <circle cx="422" cy="{y + 4}" r="3" fill="#39ff14" opacity="0.6" />
  <text x="432" y="{y + 8}" class="repo-name">{repo["name"][:30]}</text>
  <text x="760" y="{y + 8}" class="repo-stars" text-anchor="end">★ {repo["stars"]}</text>'''

    if not top_repos:
        svg_content += '''
  <text x="574" y="120" class="dot" text-anchor="middle">No stars yet — building in stealth</text>'''

    svg_content += '''
</svg>'''

    os.makedirs("assets", exist_ok=True)
    with open("assets/github_stats.svg", "w", encoding="utf-8") as f:
        f.write(svg_content)
    print("Generated github_stats.svg successfully.")

if __name__ == "__main__":
    generate_github_stats()

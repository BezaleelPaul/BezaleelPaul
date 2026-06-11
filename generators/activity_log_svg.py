import os
import json
import datetime
import urllib.request

def fetch_recent_activity(username="BezaleelPaul", max_events=8):
    url = f"https://api.github.com/users/{username}/events/public"
    headers = {"User-Agent": "Mozilla/5.0"}
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("TOKEN")
    if token:
        headers["Authorization"] = f"token {token}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                events = json.loads(response.read().decode())
                return events[:max_events]
    except Exception as e:
        print(f"Error fetching recent activity: {e}")
    return []

def format_event(event):
    event_type = event.get("type", "")
    repo = event.get("repo", {}).get("name", "unknown/repo").split("/")[-1]
    created = event.get("created_at", "")
    try:
        dt = datetime.datetime.strptime(created, "%Y-%m-%dT%H:%M:%SZ")
        time_ago = datetime.datetime.now(datetime.UTC) - dt.replace(tzinfo=datetime.timezone.utc)
        mins = int(time_ago.total_seconds() / 60)
        if mins < 60:
            time_str = f"{mins}m ago"
        elif mins < 1440:
            time_str = f"{mins // 60}h ago"
        else:
            time_str = f"{mins // 1440}d ago"
    except Exception:
        time_str = "recent"

    if event_type == "PushEvent":
        commits = len(event.get("payload", {}).get("commits", []))
        return {"emoji": "📦", "action": f"Pushed {commits} commit{'s' if commits > 1 else ''} to", "repo": repo, "time": time_str}
    elif event_type == "CreateEvent":
        ref_type = event.get("payload", {}).get("ref_type", "resource")
        return {"emoji": "🌿", "action": f"Created {ref_type}", "repo": repo, "time": time_str}
    elif event_type == "IssuesEvent":
        action = event.get("payload", {}).get("action", "updated")
        return {"emoji": "🔧", "action": f"{action.capitalize()} issue in", "repo": repo, "time": time_str}
    elif event_type == "WatchEvent":
        return {"emoji": "⭐", "action": "Starred", "repo": repo, "time": time_str}
    elif event_type == "ForkEvent":
        return {"emoji": "🍴", "action": "Forked", "repo": repo, "time": time_str}
    elif event_type == "PullRequestEvent":
        action = event.get("payload", {}).get("action", "opened")
        return {"emoji": "🔀", "action": f"{action.capitalize()} PR in", "repo": repo, "time": time_str}
    elif event_type == "DeleteEvent":
        return {"emoji": "🗑️", "action": "Deleted branch in", "repo": repo, "time": time_str}
    else:
        return {"emoji": "💻", "action": f"Activity in", "repo": repo, "time": time_str}

def generate_activity_log():
    username = "BezaleelPaul"
    events = fetch_recent_activity(username)
    formatted = [format_event(e) for e in events]

    if not formatted:
        formatted = [
            {"emoji": "📦", "action": "Pushed commits to", "repo": "NADICARE-Twin-Engine", "time": "recent"},
            {"emoji": "🔧", "action": "Updated", "repo": "File-Organizer", "time": "recent"},
            {"emoji": "🌿", "action": "Created branch in", "repo": "BESCOM-Calculator", "time": "recent"},
        ]

    lines = []
    for i, item in enumerate(formatted):
        y = 55 + i * 30
        lines.append(f'  <text x="30" y="{y}" font-family="monospace" font-size="12">{item["emoji"]}</text>')
        lines.append(f'  <text x="55" y="{y}" font-family="\'JetBrains Mono\', monospace" font-size="11" fill="#8b949e">{item["action"]}</text>')
        lines.append(f'  <text x="55" y="{y + 14}" font-family="\'JetBrains Mono\', monospace" font-size="11" fill="#39ff14" font-weight="bold">{item["repo"]}</text>')

        lines.append(f'  <text x="360" y="{y}" font-family="\'JetBrains Mono\', monospace" font-size="10" fill="#8b949e" text-anchor="end">{item["time"]}</text>')
        if i < len(formatted) - 1:
            lines.append(f'  <line x1="30" y1="{y + 22}" x2="370" y2="{y + 22}" stroke="#30363d" stroke-width="0.5" stroke-opacity="0.5" />')

    activity_svg = f'''<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="act-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0d1117;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#070a0e;stop-opacity:1" />
    </linearGradient>
    <style>
      .bg-card {{ fill: url(#act-grad); stroke: #39ff14; stroke-width: 1.5; stroke-opacity: 0.25; rx: 10px; }}
      .sec-title {{ font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 13px; fill: #39ff14; font-weight: bold; letter-spacing: 2px; }}
    </style>
  </defs>

  <rect x="2" y="2" width="796" height="296" class="bg-card" />
  <text x="20" y="28" class="sec-title">// RECENT ACTIVITY STREAM</text>
  <line x1="20" y1="36" x2="780" y2="36" stroke="#30363d" stroke-width="0.5" />

  <rect x="18" y="44" width="330" height="{len(formatted) * 30}" fill="none" />

{chr(10).join(lines)}

  <text x="400" y="{55 + len(formatted) * 30 + 20}" font-family="\'JetBrains Mono\', monospace" font-size="10" fill="#58a6ff" text-anchor="middle">
    Live feed from GitHub events  ·  Updates every 6 hours
  </text>
</svg>'''

    os.makedirs("assets", exist_ok=True)
    with open("assets/activity.svg", "w", encoding="utf-8") as f:
        f.write(activity_svg)
    print("Generated activity.svg successfully.")

if __name__ == "__main__":
    generate_activity_log()

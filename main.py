import os
import sys
import re
import datetime
import urllib.request
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

from generators.header_svg import generate_header, get_latest_github_activity
from generators.skills_svg import generate_skills
from generators.dashboard_svg import generate_dashboard
from generators.cp_gauge import generate_cp_gauge
from generators.connect_svg import generate_connect_card
from generators.footer_svg import generate_footer
from generators.github_stats_svg import generate_github_stats
from generators.activity_log_svg import generate_activity_log

def get_live_status(username="BezaleelPaul"):
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
                for event in events:
                    if event.get("type") == "PushEvent" or event.get("repo"):
                        repo_name = event["repo"]["name"].split("/")[-1]
                        created_at_str = event["created_at"]
                        created_at = datetime.datetime.strptime(created_at_str, "%Y-%m-%dT%H:%M:%SZ")
                        try:
                            now = datetime.datetime.now(datetime.UTC).replace(tzinfo=None)
                        except AttributeError:
                            now = datetime.datetime.utcnow()
                        diff = now - created_at
                        minutes = int(diff.total_seconds() / 60)
                        if minutes < 60:
                            time_str = f"{minutes}m ago"
                        elif minutes < 1440:
                            time_str = f"{minutes // 60}h ago"
                        else:
                            time_str = f"{minutes // 1440}d ago"
                        return f"🟢 Online — last pushed to {repo_name} {time_str}"
    except Exception as e:
        print(f"Error fetching live status for whoami: {e}")
    return "🟢 Online — building AI cardiac twin models"

def update_readme():
    print("Updating README.md with live info...")
    live_status = get_live_status()
    readme_path = "README.md"
    if not os.path.exists(readme_path):
        print("README.md not found!")
        return

    with open(readme_path, "r", encoding="utf-8") as f:
        content = f.read()

    pattern = r'("status"\s*:\s*)"[^"]*"'
    replacement = f'\\1"{live_status}"'
    new_content, count = re.subn(pattern, replacement, content)
    if count > 0:
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated live status: '{live_status}'")
    else:
        print("Could not locate 'status' JSON field in README.md")

def run_safe(fn, name):
    try:
        fn()
        return True
    except Exception as e:
        print(f"FAILED: {name} — {e}")
        return False

def main():
    print("=" * 50)
    print("  BEZFORGE PROFILE SYSTEM — BUILDING ALL ASSETS")
    print("=" * 50)

    generators = [
        (generate_header, "Header"),
        (generate_skills, "Skills"),
        (generate_dashboard, "Dashboard"),
        (generate_cp_gauge, "CP Gauge"),
        (generate_connect_card, "Connect Card"),
        (generate_footer, "Footer"),
        (generate_github_stats, "GitHub Stats"),
        (generate_activity_log, "Activity Log"),
    ]

    results = []
    for fn, name in generators:
        ok = run_safe(fn, name)
        results.append((name, "✓" if ok else "✗"))
        print(f"  [{ 'OK' if ok else 'FAIL' }] {name}")

    update_readme()

    print("-" * 50)
    for name, status in results:
        print(f"  {status}  {name}")
    print("=" * 50)
    print("  ALL BUILDS COMPLETE.")
    print("=" * 50)

if __name__ == "__main__":
    main()

import os
import sys
import re
import datetime
import urllib.request
import json

# Force UTF-8 for stdout and stderr to prevent UnicodeEncodeError on Windows shell
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')


# Import all generator functions
from generators.header_svg import generate_header, get_latest_github_activity
from generators.skills_svg import generate_skills
from generators.dashboard_svg import generate_dashboard
from generators.cp_gauge import generate_cp_gauge
from generators.connect_svg import generate_connect_card
from generators.footer_svg import generate_footer

def get_live_status(username="BezaleelPaul"):
    url = f"https://api.github.com/users/{username}/events/public"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    }
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
                        # Github returns ISO format, e.g. "2026-06-03T13:45:00Z"
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
        print("README.md not found in the root directory!")
        return
        
    with open(readme_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Regex to find status line inside whoami block JSON
    # It looks for "status"      : "..."
    pattern = r'("status"\s*:\s*)"[^"]*"'
    replacement = f'\\1"{live_status}"'
    
    new_content, count = re.subn(pattern, replacement, content)
    if count > 0:
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated live status in README.md: '{live_status}'")
    else:
        print("Could not locate 'status' JSON field in README.md to update.")

def main():
    print("Starting README System builds...")
    
    # 1. Run all SVG generators
    try:
        generate_header()
    except Exception as e:
        print(f"Failed to generate header: {e}")
        
    try:
        generate_skills()
    except Exception as e:
        print(f"Failed to generate skills: {e}")
        
    try:
        generate_dashboard()
    except Exception as e:
        print(f"Failed to generate dashboard: {e}")
        
    try:
        generate_cp_gauge()
    except Exception as e:
        print(f"Failed to generate CP gauge: {e}")
        
    try:
        generate_connect_card()
    except Exception as e:
        print(f"Failed to generate connect card: {e}")
        
    try:
        generate_footer()
    except Exception as e:
        print(f"Failed to generate footer: {e}")
        
    # 2. Update status in README
    update_readme()
    
    print("All builds completed.")

if __name__ == "__main__":
    main()

import os
import json
import datetime
import urllib.request

from generators.github_stats_svg import fetch_user_stats, fetch_repo_stars
from generators.dashboard_svg import fetch_contributions, calculate_stats
from generators.activity_log_svg import fetch_recent_activity, format_event
from generators.cp_gauge import fetch_codeforces_data, fetch_leetcode_data, get_rank_color
from generators.skills_svg import SKILLS_DATA

USERNAME = "BezaleelPaul"

PROJECTS = [
    {
        "name": "NADICARE Twin Engine",
        "status": "Active",
        "stack": ["Python", "Streamlit", "XGBoost"],
        "description": "AI-driven digital twin for real-time cardiac performance modeling and stress recovery.",
        "features": [
            "Real-time simulation of heart rate response to exercise, stress, and recovery",
            "XGBoost algorithms to forecast recovery windows and physiological safety limits",
            "Dynamic Plotly dashboards comparing actual vs. predicted cardiac load",
        ],
        "repo": "https://github.com/BezaleelPaul/bnmit-nadicare-health",
        "demo": None,
    },
    {
        "name": "File Organizer",
        "status": "Active",
        "stack": ["Python", "Tkinter"],
        "description": "Smart GUI tool to automatically sort files by extension and user preferences.",
        "features": [
            "Copy or move files via toggle switch",
            "Add custom extensions through the GUI",
            "Dark theme with clean modern UX",
        ],
        "repo": "https://github.com/BezaleelPaul/File-Organizer",
        "demo": None,
    },
    {
        "name": "BESCOM Calculator",
        "status": "Active",
        "stack": ["HTML", "CSS", "JavaScript"],
        "description": "Domestic electricity bill calculator with accurate BESCOM tariff slabs.",
        "features": [
            "Accurate monthly bill calculation",
            "User-friendly interactive UI",
            "Live hosted on GitHub Pages",
        ],
        "repo": "https://github.com/BezaleelPaul/BESCOM-Calculator",
        "demo": "https://bezaleelpaul.github.io/BESCOM-Calculator/",
    },
    {
        "name": "Maclaurin Visualizer",
        "status": "Active",
        "stack": ["JavaScript", "HTML", "Canvas"],
        "description": "Interactive math learning tool for visualizing Maclaurin series convergence.",
        "features": [
            "Real-time partial sum visualization",
            "Slider controls for degree & function selection",
            "Ideal for teaching calculus concepts",
        ],
        "repo": "https://github.com/BezaleelPaul",
        "demo": None,
    },
]

SOCIALS = [
    {"name": "LinkedIn", "handle": "bezaleel-paul", "url": "https://www.linkedin.com/in/bezaleel-paul-7b114b307", "icon": "in"},
    {"name": "GitHub", "handle": "@BezaleelPaul", "url": "https://github.com/BezaleelPaul", "icon": "gh"},
    {"name": "Portfolio", "handle": "bezaleelpaul.github.io", "url": "https://bezaleelpaul.github.io/", "icon": "pf"},
    {"name": "Kaggle", "handle": "bezaleelpaul", "url": "https://www.kaggle.com/bezaleelpaul", "icon": "kg"},
    {"name": "Codeforces", "handle": "BezaleelPaulN", "url": "https://codeforces.com/profile/BezaleelPaulN", "icon": "cf"},
    {"name": "LeetCode", "handle": "BezaleelPaulN", "url": "https://leetcode.com/u/BezaleelPaulN/", "icon": "lc"},
    {"name": "CodeChef", "handle": "bezaleelpauln", "url": "https://www.codechef.com/users/bezaleelpauln", "icon": "cc"},
    {"name": "HackerRank", "handle": "bezaleel321", "url": "https://www.hackerrank.com/bezaleel321", "icon": "hr"},
]

def get_live_status():
    url = f"https://api.github.com/users/{USERNAME}/events/public"
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
                        created_at = datetime.datetime.strptime(event["created_at"], "%Y-%m-%dT%H:%M:%SZ")
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
                        return f"last pushed to {repo_name} {time_str}"
    except Exception as e:
        print(f"Error fetching live status for profile data: {e}")
    return "building AI cardiac twin models"

def utc_timestamp():
    try:
        return datetime.datetime.now(datetime.UTC).strftime("%Y-%m-%dT%H:%M:%SZ")
    except AttributeError:
        return datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")

def generate_profile_data():
    user = fetch_user_stats(USERNAME)
    stars, forks, watchers, top = fetch_repo_stars(USERNAME)
    contributions, date_strs = fetch_contributions(USERNAME)
    total_30d, streak, today, avg, best_day, best_day_date = calculate_stats(contributions, date_strs)
    events = fetch_recent_activity(USERNAME, max_events=10)
    activity = [format_event(e) for e in events]
    cf = fetch_codeforces_data()
    lc = fetch_leetcode_data()
    cf_rank_color = get_rank_color(cf.get("rank", "unrated"))

    series = [{"date": d, "count": contributions[d]} for d in date_strs]

    data = {
        "generated_at": utc_timestamp(),
        "profile": {
            "name": "Bezaleel Paul N",
            "alias": "BezForge",
            "location": "Bangalore, India",
            "role": "AI/ML · Full-Stack · Builder",
            "status": get_live_status(),
            "open_to_work": True,
            "focus": ["AI/ML", "Full-Stack", "Competitive Programming"],
            "mission": ("I code what motivates me — on the spot. I enjoy the arts, contemplative "
                        "thought, and multi-faceted, intellectually demanding, and imaginatively "
                        "rigorous projects."),
        },
        "stats": {
            "stars": stars,
            "forks": forks,
            "watchers": watchers,
            "followers": user.get("followers", 0),
            "following": user.get("following", 0),
            "repos": user.get("repos", 0),
            "gists": user.get("gists", 0),
            "created": user.get("created", ""),
            "top_repos": top,
        },
        "dashboard": {
            "total_30d": total_30d,
            "streak": streak,
            "today": today,
            "avg_per_day": avg,
            "best_day": best_day,
            "best_day_date": best_day_date,
            "series": series,
        },
        "activity": activity,
        "skills": SKILLS_DATA,
        "cp": {
            "codeforces": {**cf, "color": cf_rank_color},
            "leetcode": lc,
        },
        "projects": PROJECTS,
        "socials": SOCIALS,
    }

    os.makedirs("site/data", exist_ok=True)
    with open("site/data/profile.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("Generated site/data/profile.json successfully.")

if __name__ == "__main__":
    generate_profile_data()

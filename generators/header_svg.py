import os
import json
import datetime
import urllib.request
from urllib.error import URLError

def get_latest_github_activity(username="BezaleelPaul"):
    url = f"https://api.github.com/users/{username}/events/public"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    }
    
    # Check for GITHUB_TOKEN or check if running in actions
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("TOKEN")
    if token:
        headers["Authorization"] = f"token {token}"
        
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                data = json.loads(response.read().decode())
                if data and isinstance(data, list):
                    for event in data:
                        repo_name = event.get("repo", {}).get("name")
                        if repo_name:
                            # Strip username prefix if present
                            if "/" in repo_name:
                                return repo_name.split("/")[-1]
                            return repo_name
    except Exception as e:
        print(f"Error fetching GitHub activity: {e}")
        
    return "NADICARE Twin Engine"

def generate_header():
    username = "BezaleelPaul"
    repo = get_latest_github_activity(username)
    try:
        timestamp = datetime.datetime.now(datetime.UTC).strftime("%Y-%m-%d %H:%M UTC")
    except AttributeError:
        # Fallback for Python < 3.11
        timestamp = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
    
    svg_content = f"""<svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glitch" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="1" result="noise">
        <animate attributeName="baseFrequency" values="0.05;0.09;0.05" dur="2s" repeatCount="indefinite"/>
      </feTurbulence>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <linearGradient id="green-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#070a0e;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#081f08;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#070a0e;stop-opacity:1" />
    </linearGradient>
    <style>
      .title-text {{
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 44px;
        fill: #39ff14;
        text-anchor: middle;
        font-weight: 800;
        letter-spacing: 4px;
        filter: drop-shadow(0 0 8px rgba(57, 255, 20, 0.6)) url(#glitch);
      }}
      .status-text {{
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 13px;
        fill: #8b949e;
        text-anchor: middle;
        letter-spacing: 1px;
      }}
      .status-highlight {{
        fill: #39ff14;
        font-weight: bold;
      }}
      .border-rect {{
        stroke: #39ff14;
        stroke-width: 1.5;
        stroke-opacity: 0.3;
        fill: url(#green-grad);
        rx: 10px;
      }}
    </style>
  </defs>
  
  <!-- Background Board -->
  <rect x="2" y="2" width="796" height="196" class="border-rect" />
  
  <!-- Subtle decorative grid lines -->
  <path d="M 20,0 L 20,200 M 780,0 L 780,200 M 0,20 L 800,20 M 0,180 L 800,180" stroke="#39ff14" stroke-opacity="0.08" stroke-width="1"/>
  
  <!-- Name with glitch -->
  <text x="400" y="95" class="title-text">
    BEZALEEL PAUL N
  </text>
  
  <!-- Status line -->
  <text x="400" y="145" class="status-text">
    [ <tspan class="status-highlight">SYSTEM ONLINE</tspan> ]  |  Last deploy: {timestamp}  |  Building: <tspan class="status-highlight">{repo}</tspan>
  </text>
  
  <!-- Blinking cursor -->
  <rect x="710" y="133" width="8" height="15" fill="#39ff14">
    <animate attributeName="opacity" values="1;0;1" dur="1.2s" repeatCount="indefinite"/>
  </rect>
</svg>
"""
    
    os.makedirs("assets", exist_ok=True)
    with open("assets/header.svg", "w", encoding="utf-8") as f:
        f.write(svg_content)
    print("Generated header.svg successfully.")

if __name__ == "__main__":
    generate_header()

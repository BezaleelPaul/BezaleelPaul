import os
import json
import urllib.request
import math

def fetch_codeforces_data(handle="BezaleelPaulN"):
    url = f"https://codeforces.com/api/user.info?handles={handle}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    }
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                data = json.loads(response.read().decode())
                if data.get("status") == "OK" and data.get("result"):
                    user_info = data["result"][0]
                    return {
                        "handle": user_info.get("handle", handle),
                        "rating": user_info.get("rating", 0),
                        "maxRating": user_info.get("maxRating", 0),
                        "rank": user_info.get("rank", "unrated").upper(),
                        "maxRank": user_info.get("maxRank", "unrated").upper(),
                    }
    except Exception as e:
        print(f"Error fetching Codeforces stats: {e}. Using fallback data.")
        
    # Fallback/default data if API is down
    return {
        "handle": handle,
        "rating": 1380,
        "maxRating": 1420,
        "rank": "PUPIL",
        "maxRank": "PUPIL"
    }

def get_rank_color(rank):
    rank = rank.lower()
    if "legendary" in rank or "grandmaster" in rank or "red" in rank:
        return "#ff3333"
    elif "candidate" in rank or "master" in rank or "orange" in rank:
        return "#ffcc33"
    elif "expert" in rank or "violet" in rank:
        return "#aa00aa"
    elif "specialist" in rank or "blue" in rank:
        return "#3333ff"
    elif "pupil" in rank or "green" in rank:
        return "#39ff14"
    elif "newbie" in rank or "gray" in rank:
        return "#8b949e"
    else:
        return "#39ff14"

def generate_cp_gauge():
    handle = "BezaleelPaulN"
    cf_data = fetch_codeforces_data(handle)
    
    rating = cf_data["rating"]
    max_rating = cf_data["maxRating"]
    rank = cf_data["rank"]
    max_rank = cf_data["maxRank"]
    
    # Scale: 0 to 3000 rating represents 240 degrees (from -120 to 120)
    # Clamp rating for the gauge display
    gauge_rating = min(max(0, rating), 3000)
    angle = (gauge_rating / 3000.0) * 240.0 - 120.0
    
    rank_color = get_rank_color(rank)
    max_rank_color = get_rank_color(max_rank)
    
    # Draw arc path using polar coordinates
    # Center = (580, 140), Radius = 90
    # Start angle = -120 (degrees from top, going clockwise is positive. Wait, SVG polar: 0 is right.
    # In math polar, 0 is right, 90 is top. In SVG, let's just use simple trigonometry:
    # Let's write the arc path manually for -120 to 120 degrees relative to top.
    # Angle in radians = angle * pi / 180
    # relative to top: x = cx + R * sin(ang), y = cy - R * cos(ang)
    
    cx, cy = 570, 140
    r = 95
    
    # We can draw 5 tick marks or color bands. Let's do a glowing dial path from -120 to 120
    # Start angle: -120 -> rad = -120 * pi / 180 = -2.0944
    # End angle: 120 -> rad = 2.0944
    # Start point: x1 = 570 + 95 * sin(-120) = 570 - 82.27 = 487.7, y1 = 140 - 95 * cos(-120) = 140 - (-47.5) = 187.5
    # End point: x2 = 570 + 95 * sin(120) = 570 + 82.27 = 652.3, y2 = 140 - 95 * cos(120) = 187.5
    # Using simple SVG paths:
    # A rx ry x-axis-rotation large-arc-flag sweep-flag x y
    # Here rx=95, ry=95, large-arc=1 (since 240 > 180), sweep=1 (going clockwise)
    # Path: M 487.7,187.5 A 95,95 0 1 1 652.3,187.5
    
    # Needle details
    # Needle starts at (cx, cy) and extends to length 85
    # Needle angle = angle (in degrees).
    # We can draw the needle pointing straight UP (angle 0) and rotate it using animateTransform!
    
    svg_content = f"""<svg viewBox="0 0 800 260" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0d1117;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#070a0e;stop-opacity:1" />
    </linearGradient>
    <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="needle-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <style>
      .bg-card {{
        fill: url(#cp-grad);
        stroke: #39ff14;
        stroke-width: 1.5;
        stroke-opacity: 0.3;
        rx: 10px;
      }}
      .stat-panel {{
        stroke: #30363d;
        stroke-width: 1;
        fill: none;
        rx: 8px;
      }}
      .sec-title {{
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 14px;
        fill: #39ff14;
        font-weight: bold;
        letter-spacing: 2px;
      }}
      .cf-handle {{
        font-family: 'JetBrains Mono', monospace;
        font-size: 18px;
        fill: #c9d1d9;
        font-weight: bold;
      }}
      .stat-label {{
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        fill: #8b949e;
        letter-spacing: 1px;
      }}
      .stat-val-rating {{
        font-family: 'JetBrains Mono', monospace;
        font-size: 26px;
        font-weight: 800;
        fill: {rank_color};
        filter: drop-shadow(0 0 4px {rank_color}55);
      }}
      .stat-val-rank {{
        font-family: 'JetBrains Mono', monospace;
        font-size: 16px;
        font-weight: bold;
        fill: {rank_color};
      }}
      .stat-val-max {{
        font-family: 'JetBrains Mono', monospace;
        font-size: 13px;
        fill: #c9d1d9;
      }}
      .max-highlight {{
        color: {max_rank_color};
        font-weight: bold;
        fill: {max_rank_color};
      }}
      .dial-bg {{
        stroke: #161b22;
        stroke-width: 8;
        fill: none;
        stroke-linecap: round;
      }}
      .dial-fill {{
        stroke: #39ff14;
        stroke-width: 8;
        fill: none;
        stroke-linecap: round;
        filter: url(#neon-glow);
        stroke-dasharray: 400;
        stroke-dashoffset: 400;
      }}
      .needle {{
        stroke: #ff3333;
        stroke-width: 3;
        stroke-linecap: round;
        filter: url(#needle-glow);
      }}
      .needle-cap {{
        fill: #ff3333;
        stroke: #0d1117;
        stroke-width: 2;
      }}
      .dial-label {{
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        fill: #8b949e;
        text-anchor: middle;
      }}
      .dial-center-val {{
        font-family: 'JetBrains Mono', monospace;
        font-size: 22px;
        font-weight: bold;
        fill: #c9d1d9;
        text-anchor: middle;
      }}
    </style>
  </defs>

  <!-- Background card -->
  <rect x="2" y="2" width="796" height="256" class="bg-card" />

  <!-- Left Stats Panel -->
  <rect x="20" y="20" width="400" height="220" class="stat-panel" />
  <text x="35" y="45" class="sec-title">// COMPETITIVE PROGRAMMING</text>
  
  <text x="35" y="80" class="cf-handle">{handle}</text>
  
  <!-- Current Rating / Rank -->
  <text x="35" y="115" class="stat-label">CODEFORCES RATING</text>
  <text x="35" y="145" class="stat-val-rating">{rating}</text>
  <text x="120" y="142" class="stat-val-rank">[{rank}]</text>
  
  <!-- Max Rating -->
  <text x="35" y="180" class="stat-label">MAX RATING RECORD</text>
  <text x="35" y="205" class="stat-val-max">{max_rating} <tspan class="max-highlight">[{max_rank}]</tspan></text>
  
  <!-- Small hint -->
  <text x="35" y="225" class="stat-label" font-size="9" fill="#58a6ff">Updates automatically every 6 hours</text>

  <!-- Right Gauge Panel -->
  <rect x="440" y="20" width="340" height="220" class="stat-panel" />
  <text x="455" y="45" class="sec-title">// RATING GAUGE</text>
  
  <!-- Gauge Arc Background -->
  <path d="M 487.7,187.5 A 95,95 0 1 1 652.3,187.5" class="dial-bg" />
  
  <!-- Gauge Arc Fill (Animated using SVG SMIL) -->
  <path d="M 487.7,187.5 A 95,95 0 1 1 652.3,187.5" class="dial-fill">
    <!-- Animated fill arc based on rating percentage (max 3000 rating = 400 stroke-dashoffset) -->
    <animate attributeName="stroke-dashoffset" from="400" to="{400 - int((gauge_rating / 3000.0) * 400)}" dur="1.5s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1"/>
  </path>
  
  <!-- Ticks or labels on the dial -->
  <text x="480" y="202" class="dial-label">0</text>
  <text x="570" y="38" class="dial-label">1500</text>
  <text x="660" y="202" class="dial-label">3000</text>
  
  <!-- Rating display inside dial -->
  <text x="570" y="175" class="dial-center-val">{rating}</text>
  <text x="570" y="190" class="dial-label" font-size="8">CF RATING</text>
  
  <!-- Needle -->
  <g>
    <!-- Rotate needle from -120 to target angle (default pointing straight up, which is 0 degrees) -->
    <!-- The transform origin is the center of rotation (cx, cy) = (570, 140) -->
    <line x1="{cx}" y1="{cy}" x2="{cx}" y2="{cy - 80}" class="needle">
      <animateTransform attributeName="transform" type="rotate" from="-120 {cx} {cy}" to="{angle} {cx} {cy}" dur="1.5s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1"/>
    </line>
    <circle cx="{cx}" cy="{cy}" r="8" class="needle-cap" />
    <circle cx="{cx}" cy="{cy}" r="3" fill="#0d1117" />
  </g>
</svg>
"""
    
    os.makedirs("assets", exist_ok=True)
    with open("assets/cp_gauge.svg", "w", encoding="utf-8") as f:
        f.write(svg_content)
    print("Generated cp_gauge.svg successfully.")

if __name__ == "__main__":
    generate_cp_gauge()

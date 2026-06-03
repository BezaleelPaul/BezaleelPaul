import os

def generate_skills():
    skills_data = {
        "LANGUAGES": [
            {"name": "Python", "val": 90},
            {"name": "JavaScript", "val": 80},
            {"name": "TypeScript", "val": 60},
            {"name": "HTML / CSS", "val": 85}
        ],
        "FRAMEWORKS": [
            {"name": "React", "val": 70},
            {"name": "Node.js", "val": 70},
            {"name": "FastAPI", "val": 60},
            {"name": "Flutter", "val": 50}
        ],
        "AI / ML": [
            {"name": "TensorFlow", "val": 55},
            {"name": "XGBoost", "val": 65},
            {"name": "OpenAI API", "val": 60},
            {"name": "Streamlit", "val": 70}
        ],
        "TOOLS": [
            {"name": "Git", "val": 90},
            {"name": "Firebase", "val": 70},
            {"name": "SQLite", "val": 60},
            {"name": "Godot", "val": 50}
        ]
    }

    svg_header = """<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0d1117;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#070a0e;stop-opacity:1" />
    </linearGradient>
    <filter id="neon-glow" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <style>
      .bg-rect {
        fill: url(#card-grad);
        stroke: #39ff14;
        stroke-width: 1.5;
        stroke-opacity: 0.3;
        rx: 10px;
      }
      .group-title {
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 14px;
        fill: #39ff14;
        font-weight: bold;
        letter-spacing: 2px;
      }
      .skill-label {
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 13px;
        fill: #c9d1d9;
      }
      .skill-percent {
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 12px;
        fill: #39ff14;
        font-weight: bold;
      }
      .bar-bg {
        fill: #161b22;
        rx: 3px;
      }
      .bar-fill {
        fill: #39ff14;
        filter: url(#neon-glow);
        rx: 3px;
      }
      .panel-border {
        stroke: #30363d;
        stroke-width: 1;
        fill: none;
        rx: 8px;
      }
    </style>
  </defs>

  <!-- Outer container -->
  <rect x="2" y="2" width="796" height="396" class="bg-rect" />

  <!-- Subdecorative grid pattern -->
  <path d="M 400,10 L 400,390 M 10,200 L 790,200" stroke="#30363d" stroke-opacity="0.5" stroke-dasharray="4 4" stroke-width="1"/>
"""

    svg_footer = "\n</svg>"
    
    body_elements = []
    
    # Grid coordinates for 4 cards
    # Row 1: LANGUAGES (0,0), FRAMEWORKS (1,0)
    # Row 2: AI / ML (0,1), TOOLS (1,1)
    card_positions = {
        "LANGUAGES": {"x": 20, "y": 20},
        "FRAMEWORKS": {"x": 410, "y": 20},
        "AI / ML": {"x": 20, "y": 210},
        "TOOLS": {"x": 410, "y": 210}
    }
    
    delay = 0.0
    for category, skills in skills_data.items():
        pos = card_positions[category]
        cx = pos["x"]
        cy = pos["y"]
        
        # Draw category panel box
        body_elements.append(f'  <!-- Card for {category} -->')
        body_elements.append(f'  <rect x="{cx}" y="{cy}" width="370" height="170" class="panel-border" />')
        body_elements.append(f'  <text x="{cx + 15}" y="{cy + 25}" class="group-title">// {category}</text>')
        
        for i, skill in enumerate(skills):
            sy = cy + 50 + (i * 28)
            name = skill["name"]
            val = skill["val"]
            max_width = 220
            target_width = int((val / 100.0) * max_width)
            
            # Label
            body_elements.append(f'  <text x="{cx + 15}" y="{sy + 10}" class="skill-label">{name}</text>')
            # Bar background
            body_elements.append(f'  <rect x="{cx + 110}" y="{sy}" width="{max_width}" height="10" class="bar-bg"/>')
            # Bar fill with animation
            body_elements.append(f'  <rect x="{cx + 110}" y="{sy}" width="0" height="10" class="bar-fill">')
            body_elements.append(f'    <animate attributeName="width" from="0" to="{target_width}" dur="1.2s" begin="{delay:.1f}s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1"/>')
            body_elements.append(f'  </rect>')
            # Percent label
            body_elements.append(f'  <text x="{cx + 110 + max_width + 10}" y="{sy + 10}" class="skill-percent">{val}%</text>')
            
            delay += 0.1
            
    svg_body = "\n".join(body_elements)
    
    os.makedirs("assets", exist_ok=True)
    with open("assets/skills.svg", "w", encoding="utf-8") as f:
        f.write(svg_header + svg_body + svg_footer)
    print("Generated skills.svg successfully.")

if __name__ == "__main__":
    generate_skills()

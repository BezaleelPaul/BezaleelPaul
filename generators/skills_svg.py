import os

def generate_skills():
    skills_data = [
        {
            "category": "LANGUAGES",
            "icon": "&lt;/&gt;",
            "items": [
                {"name": "Python", "level": 92, "color": "#3776AB"},
                {"name": "JavaScript", "level": 82, "color": "#F7DF1E"},
                {"name": "TypeScript", "level": 65, "color": "#3178C6"},
                {"name": "HTML / CSS", "level": 85, "color": "#E34F26"},
                {"name": "C / C++", "level": 55, "color": "#00599C"},
            ]
        },
        {
            "category": "FRAMEWORKS",
            "icon": "⚡",
            "items": [
                {"name": "React", "level": 72, "color": "#61DAFB"},
                {"name": "Node.js", "level": 70, "color": "#339933"},
                {"name": "FastAPI", "level": 62, "color": "#009688"},
                {"name": "Flutter", "level": 50, "color": "#02569B"},
                {"name": "Streamlit", "level": 68, "color": "#FF4B4B"},
            ]
        },
        {
            "category": "AI / ML",
            "icon": "🧠",
            "items": [
                {"name": "TensorFlow", "level": 58, "color": "#FF6F00"},
                {"name": "XGBoost", "level": 65, "color": "#39B54A"},
                {"name": "OpenAI API", "level": 62, "color": "#74AA9C"},
                {"name": "Scikit-learn", "level": 60, "color": "#F7931E"},
            ]
        },
        {
            "category": "TOOLS &amp; OPS",
            "icon": "🛠️",
            "items": [
                {"name": "Git &amp; GitHub", "level": 90, "color": "#F05032"},
                {"name": "Firebase", "level": 70, "color": "#FFCA28"},
                {"name": "SQL / NoSQL", "level": 65, "color": "#4479A1"},
                {"name": "Docker", "level": 45, "color": "#2496ED"},
                {"name": "Linux CLI", "level": 75, "color": "#FCC624"},
            ]
        }
    ]

    card_width = 370
    card_height = 200
    cols = 2
    rows = 2
    padding = 16
    gap = 16
    total_width = cols * card_width + (cols - 1) * gap + 2 * padding
    total_height = rows * card_height + (rows - 1) * gap + 2 * padding

    def build_card(category, icon, items, cx, cy):
        lines = []
        lines.append(f'  <rect x="{cx}" y="{cy}" width="{card_width}" height="{card_height}" rx="8" fill="#0d1117" stroke="#30363d" stroke-width="1" />')
        lines.append(f'  <rect x="{cx}" y="{cy}" width="{card_width}" height="32" rx="8" fill="#161b22" />')
        lines.append(f'  <rect x="{cx}" y="{cy + 24}" width="{card_width}" height="8" fill="#161b22" />')
        lines.append(f'  <text x="{cx + 14}" y="{cy + 21}" font-family="\'JetBrains Mono\', monospace" font-size="13" fill="#39ff14" font-weight="bold" letter-spacing="2">{category}</text>')
        lines.append(f'  <text x="{cx + card_width - 14}" y="{cy + 21}" font-family="monospace" font-size="13" fill="#8b949e" text-anchor="end">{icon}</text>')

        bar_x = cx + 100
        bar_max_w = card_width - 115

        for i, skill in enumerate(items):
            sy = cy + 48 + i * 29
            name = skill["name"]
            level = skill["level"]
            color = skill["color"]
            target_w = int((level / 100.0) * bar_max_w)

            lines.append(f'  <text x="{cx + 14}" y="{sy + 10}" font-family="\'JetBrains Mono\', monospace" font-size="11" fill="#c9d1d9">{name}</text>')
            lines.append(f'  <rect x="{bar_x}" y="{sy}" width="{bar_max_w}" height="8" rx="4" fill="#161b22" />')
            lines.append(f'  <rect x="{bar_x}" y="{sy}" width="0" height="8" rx="4" fill="{color}" opacity="0.85">')
            lines.append(f'    <animate attributeName="width" from="0" to="{target_w}" dur="1.5s" begin="{i * 0.15}s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1"/>')
            lines.append(f'  </rect>')
            lines.append(f'  <rect x="{bar_x}" y="{sy}" width="{target_w}" height="8" rx="4" fill="{color}" opacity="0.3">')
            lines.append(f'    <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" begin="{i * 0.15}s" repeatCount="indefinite"/>')
            lines.append(f'  </rect>')
            lines.append(f'  <text x="{bar_x + bar_max_w + 8}" y="{sy + 10}" font-family="\'JetBrains Mono\', monospace" font-size="10" fill="#8b949e" text-anchor="end">{level}%</text>')

        return "\n".join(lines)

    cards = []
    positions = [
        (padding, padding),
        (padding + card_width + gap, padding),
        (padding, padding + card_height + gap),
        (padding + card_width + gap, padding + card_height + gap),
    ]

    for i, (cat, pos) in enumerate(zip(skills_data, positions)):
        cards.append(build_card(cat["category"], cat["icon"], cat["items"], pos[0], pos[1]))

    svg = f'''<svg viewBox="0 0 {total_width} {total_height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="skills-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0d1117;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#070a0e;stop-opacity:1" />
    </linearGradient>
    <style>
      .bg-rect {{
        fill: url(#skills-bg);
        stroke: #39ff14;
        stroke-width: 1.5;
        stroke-opacity: 0.2;
        rx: 10px;
      }}
    </style>
  </defs>

  <rect x="2" y="2" width="{total_width - 4}" height="{total_height - 4}" class="bg-rect" />

{chr(10).join(cards)}
</svg>'''

    os.makedirs("assets", exist_ok=True)
    with open("assets/skills.svg", "w", encoding="utf-8") as f:
        f.write(svg)
    print("Generated skills.svg successfully.")

if __name__ == "__main__":
    generate_skills()

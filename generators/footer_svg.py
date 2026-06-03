import os

def generate_footer():
    svg_content = """<svg viewBox="0 0 800 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="footer-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#0d1117;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#0d2a0d;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0d1117;stop-opacity:1" />
    </linearGradient>
    <style>
      .footer-rect {
        fill: url(#footer-grad);
        stroke: #39ff14;
        stroke-width: 1.5;
        stroke-opacity: 0.2;
        rx: 8px;
      }
      .footer-text {
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 20px;
        fill: #39ff14;
        text-anchor: middle;
        font-weight: bold;
        letter-spacing: 3px;
        filter: drop-shadow(0 0 5px rgba(57, 255, 20, 0.5));
      }
      .decor-line {
        stroke: #39ff14;
        stroke-width: 1;
        stroke-opacity: 0.15;
      }
    </style>
  </defs>
  
  <rect x="2" y="2" width="796" height="116" class="footer-rect" />
  
  <!-- Subtle decorative grid lines -->
  <line x1="20" y1="20" x2="780" y2="20" class="decor-line" />
  <line x1="20" y1="100" x2="780" y2="100" class="decor-line" />
  <line x1="100" y1="20" x2="100" y2="100" class="decor-line" stroke-dasharray="2 2" />
  <line x1="700" y1="20" x2="700" y2="100" class="decor-line" stroke-dasharray="2 2" />
  
  <text x="400" y="68" class="footer-text">
    BUILD . LEARN . SHIP
  </text>
  
  <!-- Mini cursor blink -->
  <rect x="545" y="52" width="6" height="18" fill="#39ff14">
    <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
  </rect>
</svg>
"""
    os.makedirs("assets", exist_ok=True)
    with open("assets/footer.svg", "w", encoding="utf-8") as f:
        f.write(svg_content)
    print("Generated footer.svg successfully.")

if __name__ == "__main__":
    generate_footer()

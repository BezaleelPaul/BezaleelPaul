import os

def generate_connect_card():
    svg_content = """<svg viewBox="0 0 800 260" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="conn-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0d1117;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#070a0e;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="scan-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#39ff14;stop-opacity:0" />
      <stop offset="50%" style="stop-color:#39ff14;stop-opacity:0.25" />
      <stop offset="100%" style="stop-color:#39ff14;stop-opacity:0" />
    </linearGradient>
    <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <style>
      .bg-card {
        fill: url(#conn-grad);
        stroke: #39ff14;
        stroke-width: 1.5;
        stroke-opacity: 0.3;
        rx: 10px;
      }
      .panel {
        stroke: #30363d;
        stroke-width: 1;
        fill: none;
        rx: 8px;
      }
      .sec-title {
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 14px;
        fill: #39ff14;
        font-weight: bold;
        letter-spacing: 2px;
      }
      .holo-avatar {
        stroke: #39ff14;
        stroke-width: 1.5;
        stroke-dasharray: 4 4;
        fill: none;
      }
      .holo-grid {
        stroke: #39ff14;
        stroke-width: 0.5;
        stroke-opacity: 0.15;
      }
      .name-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 20px;
        font-weight: bold;
        fill: #39ff14;
        filter: drop-shadow(0 0 5px rgba(57, 255, 20, 0.4));
      }
      .subtitle {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        fill: #8b949e;
        letter-spacing: 1px;
      }
      .link-item {
        cursor: pointer;
      }
      .link-bg {
        fill: #161b22;
        stroke: #30363d;
        stroke-width: 1;
        rx: 5px;
        transition: fill 0.3s;
      }
      .link-bg:hover {
        fill: #0d2a0d;
        stroke: #39ff14;
      }
      .link-text {
        font-family: 'JetBrains Mono', monospace;
        font-size: 13px;
        fill: #c9d1d9;
        font-weight: bold;
      }
      .scan-line {
        stroke: #39ff14;
        stroke-width: 1.5;
        stroke-opacity: 0.7;
        filter: url(#neon-glow);
      }
      .hologram-beam {
        fill: url(#scan-grad);
      }
    </style>
  </defs>

  <!-- Background card -->
  <rect x="2" y="2" width="796" height="256" class="bg-card" />

  <!-- Left Hologram Visualizer Panel -->
  <rect x="20" y="20" width="340" height="220" class="panel" />
  <text x="35" y="45" class="sec-title">// HOLOGRAM DIAGNOSTIC</text>

  <!-- Interactive Grid Effect -->
  <g class="holo-grid">
    <path d="M 40,70 L 340,70 M 40,110 L 340,110 M 40,150 L 340,150 M 40,190 L 340,190 M 40,230 L 340,230" />
    <path d="M 80,60 L 80,230 M 130,60 L 130,230 M 180,60 L 180,230 M 230,60 L 230,230 M 280,60 L 280,230" />
  </g>

  <!-- Virtual Avatar (Abstract vector matrix style) -->
  <g transform="translate(60, 80)">
    <!-- Head -->
    <circle cx="60" cy="40" r="22" class="holo-avatar" />
    <!-- Shoulders -->
    <path d="M 20,95 Q 60,65 100,95" class="holo-avatar" />
    <!-- Concentric rings -->
    <circle cx="60" cy="55" r="45" stroke="#39ff14" stroke-opacity="0.2" stroke-width="1" fill="none" stroke-dasharray="10 5" />
    <circle cx="60" cy="55" r="55" stroke="#39ff14" stroke-opacity="0.1" stroke-width="1" fill="none" stroke-dasharray="2 10" />
  </g>

  <text x="195" y="115" class="name-label">BEZALEEL P.</text>
  <text x="195" y="135" class="subtitle">IDENTITY CONFIRMED</text>
  <text x="195" y="155" class="subtitle">ROLE: FULL-STACK / AI</text>
  <text x="195" y="175" class="subtitle">LOC: BANGALORE, IN</text>

  <!-- Right Connections Panel -->
  <rect x="380" y="20" width="400" height="220" class="panel" />
  <text x="395" y="45" class="sec-title">// PING CONNECT CONNECTIONS</text>

  <!-- Social links buttons (Visual representations, markdown wrap does the actual linking) -->
  <g class="link-item" transform="translate(400, 70)">
    <rect x="0" y="0" width="170" height="40" class="link-bg" />
    <!-- LinkedIn Icon representation -->
    <rect x="15" y="10" width="20" height="20" rx="3" fill="#0077b5" />
    <text x="21" y="25" font-family="sans-serif" font-weight="bold" font-size="14" fill="white">in</text>
    <text x="50" y="25" class="link-text">LINKEDIN</text>
  </g>

  <g class="link-item" transform="translate(590, 70)">
    <rect x="0" y="0" width="170" height="40" class="link-bg" />
    <!-- GitHub Icon representation -->
    <circle cx="25" cy="20" r="10" fill="#39ff14" opacity="0.8" />
    <text x="50" y="25" class="link-text">PORTFOLIO</text>
  </g>

  <g class="link-item" transform="translate(400, 130)">
    <rect x="0" y="0" width="170" height="40" class="link-bg" />
    <!-- Kaggle Icon representation -->
    <rect x="15" y="10" width="20" height="20" rx="3" fill="#20beff" />
    <text x="21" y="25" font-family="sans-serif" font-weight="bold" font-size="14" fill="white">K</text>
    <text x="50" y="25" class="link-text">KAGGLE</text>
  </g>

  <g class="link-item" transform="translate(590, 130)">
    <rect x="0" y="0" width="170" height="40" class="link-bg" />
    <circle cx="25" cy="20" r="10" fill="#f2a900" />
    <text x="50" y="25" class="link-text">LEETCODE</text>
  </g>
  
  <text x="400" y="210" class="subtitle" font-size="10">CLICK ON THE MARKDOWN BUTTONS BELOW TO CONNECT</text>

  <!-- Scanning Hologram Beam -->
  <polygon points="20,20 360,20 360,20 20,20" class="hologram-beam">
    <animate attributeName="points" 
             values="20,20 360,20 360,20 20,20; 20,20 360,20 360,230 20,230; 20,230 360,230 360,230 20,230; 20,20 360,20 360,20 20,20" 
             dur="5s" repeatCount="indefinite" />
  </polygon>

  <!-- Scanning Line -->
  <line x1="20" y1="20" x2="360" y2="20" class="scan-line">
    <animate attributeName="y1" values="20;230;20" dur="5s" repeatCount="indefinite"/>
    <animate attributeName="y2" values="20;230;20" dur="5s" repeatCount="indefinite"/>
  </line>
</svg>
"""
    os.makedirs("assets", exist_ok=True)
    with open("assets/connect.svg", "w", encoding="utf-8") as f:
        f.write(svg_content)
    print("Generated connect.svg successfully.")

if __name__ == "__main__":
    generate_connect_card()

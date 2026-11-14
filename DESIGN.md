# Design System — Smart AI Clock (iOS 27 Liquid Glass)

## Visual World
- **Aspect & Grid**: Fixed `21:9` horizontal frame divided into 3 equal frosted-glass tiles (`grid-cols-3`).
- **Backdrop**: Deep midnight navy (`#040712` / `#060a17`) illuminated by slow-drifting Aurora Bokeh radial glows (sky cyan, indigo, violet-pink) so the glass refracts real light behind the cards.
- **Liquid Glass Materials**:
  - `.liquid-glass-card`: translucent gradient surface + `backdrop-filter: blur(36px) saturate(185%)` + `1px` specular mask rim border + soft depth shadow.
  - `.liquid-circle-btn` & `.liquid-pill-btn`: frosted pill/circle controls with top inner sheen and subtle colored illumination states (cyan for AI Focus Guard, rose for AI Wellness/Recording, amber for Alarm, indigo for White Noise/Timer).
  - `.ai-iridescent-orb`: Apple Intelligence / Siri style conic gradient ring around dark glass AI sphere.
- **Typography**: Apple SF Pro system stack (`-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text"`) with `tabular-nums` for clock digits, countdowns, and task deadlines.
- **Motion**: Spring-driven layout morphing (`stiffness: 330, damping: 32, mass: 0.85`) for pinch/double-tap expansion and edge-snapping AI orb physics.

---
name: Pitch Precision Utility
colors:
  surface: '#101412'
  surface-dim: '#101412'
  surface-bright: '#363a38'
  surface-container-lowest: '#0b0f0d'
  surface-container-low: '#181c1a'
  surface-container: '#1c201e'
  surface-container-high: '#272b29'
  surface-container-highest: '#323633'
  on-surface: '#e0e3e0'
  on-surface-variant: '#d1c5ac'
  inverse-surface: '#e0e3e0'
  inverse-on-surface: '#2d312f'
  outline: '#9a9078'
  outline-variant: '#4e4633'
  surface-tint: '#f0c110'
  primary: '#ffe5a0'
  on-primary: '#3d2f00'
  primary-container: '#f5c518'
  on-primary-container: '#695200'
  inverse-primary: '#745b00'
  secondary: '#81da8e'
  on-secondary: '#003914'
  secondary-container: '#00682b'
  on-secondary-container: '#8ce598'
  tertiary: '#9efcae'
  on-tertiary: '#003916'
  tertiary-container: '#83df94'
  on-tertiary-container: '#00632c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe08b'
  primary-fixed-dim: '#f0c110'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#584400'
  secondary-fixed: '#9df7a8'
  secondary-fixed-dim: '#81da8e'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005320'
  tertiary-fixed: '#9af7aa'
  tertiary-fixed-dim: '#7eda90'
  on-tertiary-fixed: '#00210a'
  on-tertiary-fixed-variant: '#005323'
  background: '#101412'
  on-background: '#e0e3e0'
  surface-variant: '#323633'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: Work Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Work Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: -0.01em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 0.75rem
  gutter-desktop: 1rem
  margin: 1rem
  margin-desktop: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system is engineered for a high-focus desktop creator tool that transforms real football sequences into stylized 2D cartoon trivia videos. The visual aesthetic fuses high-contrast pitch cartography with the clean, deliberate ergonomics of a desktop production suite (e.g., video sequencers, audio workstations).

### Aesthetic Pillars
- **Pitch-Side High Contrast**: Crisp pitch chalk lines cut cleanly across muted, deep green pitch surfaces and warm anthracite frames. Pitch markings act as functional visual guides rather than mere ornament.
- **Utilitarian Desktop Architecture**: Built specifically for Tauri 2 desktop shell execution. Dense, low-latency, and zero-distraction. There are no SaaS banners, no cloud synchronization indicators, and no decorative bloat.
- **Minimalist 2D Cartoon Energy**: UI elements mirror the bold, deliberate lines of the 2D match canvas—sturdy borders, clear geometry, and uncompromising contrast.

The emotional signature is tactile, focused, and immediate: the feeling of an offline desktop cutting room calibrated specifically for Turkish football creators operating under rapid turnarounds.

## Colors

The palette is anchored in stadium night turf, encased in a low-glare dark anthracite chassis, and punctuated by high-visibility stadium floodlight yellow.

### Palette Architecture
- **Primary (`#F5C518`)**: Stadium Yellow. Reserved for primary calls-to-action, playback playheads, active keyframe markers, and crucial user prompts. High luminous intensity against dark backgrounds.
- **Secondary (`#1F7A3A`)**: Base Pitch Turf. Used for match stage backgrounds, grass canvas surfaces, and active football state backdrops.
- **Tertiary (`#2E8B4A`)**: Alternating Pitch Turf Stripe. Used alongside the secondary green to generate field orientation strips, field zones, and tactical grid overlays.
- **Neutral Chassis (`#141816`)**: Deep Warm Anthracite. The foundation frame for desktop window chrome, timeline docks, and toolbars.

### Extended Neutral Tiers
- **Canvas Base**: `#141816` (Desktop frame, root window background)
- **Panel Surface**: `#1A201D` (Sidebars, inspector drawers, bottom timeline dock)
- **Card & Input Surface**: `#232B27` (Property panels, card containers, field inputs)
- **Chalk Line Weak**: `rgba(255, 255, 255, 0.12)` (Component dividers, timeline tick marks)
- **Chalk Line Crisp**: `rgba(255, 255, 255, 0.35)` (Active container boundaries, scrubber tracks)
- **Pitch Marking Pure**: `#FFFFFF` (Pitch penalty boxes, centre circle, active drag handles)

### Functional Feedback
- **Warning / Offside Alert**: `#FF5C38` (Collision warnings, invalid frame ranges)
- **Success / Render Ready**: `#34D399` (Export success, local buffer cached)

## Typography

Typography balances aggressive, tight headline punch with exact, monospaced computational certainty.

- **Headline Family (`Space Grotesk`)**: Provides geometric authority and sharp modern grotesque styling. Headlines and section labels use tight negative letter-spacing for high-density desktop displays.
- **Body Family (`Work Sans`)**: Highly legible, workhorse grotesque used for player roster names, action descriptions, configuration menus, and export settings.
- **Label / Data Family (`JetBrains Mono`)**: Strict monospace numerals for video timecodes (`00:04:12.08`), frame numbers (`F_0128`), pitch coordinates (`X: 42.5 Y: 18.2`), rendering percentages, and kit color hex codes.

## Layout & Spacing

The desktop workspace follows a high-density utility workbench layout. The Tauri 2 window chrome houses an edge-to-edge three-pane workstation:

### Layout Shell Structure
- **Left Panel (Tool & Asset Palette)**: Fixed 280px width. Houses video input selection, team kit swatches (Galatasaray, Fenerbahçe, Beşiktaş, Trabzonspor presets), player sprite presets, and quiz text overlays.
- **Center Stage (Match Simulation Pitch)**: Fluid canvas. Houses the 9:16 or 1:1 preview pitch with 2D cartoon footballers, ball trajector scrubbers, and zoom windows.
- **Right Panel (Inspector & Quiz Rules)**: Fixed 320px width. Houses timecode triggers, quiz question reveal timings, hint blur controls, and export configurations.
- **Bottom Shelf (Timeline & Clip Trimmer)**: Fixed height 220px docked strip with scrubber, audio waveform, and sprite keyframe tracks.

### Grid Rhythm
Elements utilize strict 4px / 8px scale increments. Margins inside desktop inspector cards are tightly set to `space-md` (12px) to maximize available workspace for visual previewing on laptops and multi-monitor setups.

## Elevation & Depth

Visual depth is achieved through structural tonal layering and crisp pitch-line borders rather than heavy atmospheric drop shadows. This preserves CPU/GPU rendering overhead in the Tauri webview and reinforces the offline CAD-like utility aesthetic.

### Surface Tiers
- **Base Level 0 (`#141816`)**: Native application frame, titlebar, and workspace gutters.
- **Panel Level 1 (`#1A201D`)**: Fixed docks, sidebars, and timeline track foundations. Separated from Level 0 via `1px solid rgba(255, 255, 255, 0.08)`.
- **Container Level 2 (`#232B27`)**: Inspector modules, asset cards, dropdown menus, and modal dialogs. Outlined with `1px solid rgba(255, 255, 255, 0.14)`.
- **Canvas Pitch Surface**: `#1F7A3A` layered beneath `#2E8B4A` striped canvas masks. Inset border `2px solid rgba(255, 255, 255, 0.25)` defines pitch bounds.

### Outlines & Highlights
No fuzzy diffused shadows are permitted on standard UI widgets. Overlays, contextual menus, and floating tooltips use an absolute dark drop-shadow: `0 8px 24px rgba(0, 0, 0, 0.60)` accompanied by a stark `1px solid rgba(255, 255, 255, 0.20)` border.

## Shapes

The interface implements a strict `12px` (`0.75rem` / `rounded-md`) standard corner radius across cards, modal containers, buttons, and input blocks to maintain a modern, approachable utility shell without becoming playful or pill-dominated.

### Radius Assignments
- **Panels & Dock Views**: `0px` where docked directly against Tauri window edges; `12px` on floating inspector panels.
- **Buttons, Text Inputs, and Dropdown Triggers**: Uniform `12px` corner radius.
- **Cards & Asset Tiles**: `12px` corner radius with strict `overflow: hidden` to crop child football preview sprites.
- **Status Tags, Kit Badges, & Scrubbers**: `6px` radius (`0.375rem`) for compact tags and keyframe markers.
- **The Ball Asset**: Precise `50%` circular badge.

## Components

### Buttons
- **Primary Action (Export Video / Generate Quiz)**: `#F5C518` background, `#141816` text, bold `Space Grotesk`, `12px` radius. Hover: `#E0B312`. Active: `#CCA00E`.
- **Secondary Action (Add Keyframe / Swap Kit)**: `#232B27` background, `rgba(255, 255, 255, 0.15)` border, `#FFFFFF` text. Hover: border `rgba(255, 255, 255, 0.35)`.
- **Destructive (Clear Clip)**: Background `#1A201D`, text `#FF5C38`, border `rgba(255, 92, 56, 0.3)`.

### Chips & Kit Selectors
- **Kit Color Chips**: Fixed `32x32px` swatches with a bold `2px` black inner outline representing 2D cartoon kits. Active state shows an outer `#F5C518` border with a 2px offset.
- **Metadata Badges**: Monospace label pills (`JetBrains Mono`, 11px) with background `#141816`, text `rgba(255, 255, 255, 0.7)`, and border `rgba(255, 255, 255, 0.12)`.

### Inputs & Number Steppers
- **Frame & Timecode Inputs**: Background `#1A201D`, border `1px solid rgba(255, 255, 255, 0.15)`, text `#FFFFFF` set in `JetBrains Mono`. Focus state brings a sharp `1px solid #F5C518` border with zero glow blur.

### Keyframe Timeline Track
- Base strip colored in `#141816`. Scrubber head is an inverted stadium yellow `#F5C518` triangle with a 1px vertical chalk guideline extending through all active sprite tracks.
- Pitch grass transition segments represent 2D cartoon player motion with solid `#2E8B4A` highlight pills.

### 2D Cartoon Sprite Palette Cards
- Visual cards displaying the bald, featureless player sprites against miniature grass swatches (`#1F7A3A`).
- Outlined with crisp `1px` chalk lines, transitioning to a `2px` `#F5C518` border when selected for positional placement.
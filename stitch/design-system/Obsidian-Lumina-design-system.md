# Obsidian Lumina Design System
**Project:** Context Guardian Mobile App (ID: 1000442996372313964)
**Asset ID:** `assets/b235a59c8e804c6ba1ff5cdd12df0e17`
**Theme Mode:** Dark (`#0B0F17`)
**Primary Color:** `#6366F1` (Indigo Lumina)
**Secondary Color:** `#06B6D4` (Electric Cyan)
**Tertiary Color:** `#10B981` (Emerald Guard)

---

## Brand & Style

This design system targets demanding prosumers, technologists, and knowledge workers who treat cognitive focus as their most valuable asset. The product evokes feelings of deep focus, silent vigilance, ambient intelligence, and computational luxury.

The design movement merges **Dark Tactical Glassmorphism** with **Luminous Minimalism**:
- **Backgrounds:** Multi-tiered obsidian and slate surfaces layered over subtle radial glows rather than flat ink-black voids.
- **Atmosphere:** Deep space clarity balanced by crisp, hyper-refined micro-accents. Interfaces look alive, vigilant, and effortless—avoiding the visual clutter of traditional B2B SaaS consoles or data-heavy monitoring tools.
- **Accents:** Intelligent neon bursts (electric indigo and reactive emerald-cyan) serve exclusively as beacons of state, active processing, and system health.

## Layout & Spacing

A mobile-first layout built on an 8pt architectural rhythm, with a supplementary 4pt sub-grid for badges, micro-tags, and status indicators.

### Form Factors & Behavior
- **Mobile Handheld (Primary, 360px - 480px):** Single-column canvas with a continuous vertical flow. Fixed outer canvas margin of `1.25rem` (`20px`). Structural card padding stays at `1.25rem` to maximize touch targets while keeping density high.
- **Tablet / Large Mobile Foldables (481px - 768px):** Expands to an asymmetric 2-column layout. The context shield and live timeline occupy the primary pane, while secondary metrics sit adjacent. Canvas margin expands to `1.5rem` (`24px`).
- **Desktop Dashboard Preview (> 768px):** Centered max-width shell constrained to `640px` (or `1024px` split-view mode) mimicking high-end progressive native applications.

### Spacing Discipline
- `space-xs` (4px): Inner badge padding, micro-dot separators, inline tag gaps.
- `space-sm` (8px): Gaps between list title lines and meta-labels; spacing inside compact cards.
- `space-md` (16px): Structural vertical spacing between elements inside modules.
- `space-lg` (24px): Standard gap separating primary glass cards.
- `space-xl` (32px): Distinct logical session breaks and major timeline epoch transitions.

## Elevation & Depth

Visual depth is achieved through layered semi-transparent surfaces, soft edge lighting, and colored ambient glows rather than standard black drop shadows.

### Glassmorphism & Atmospheric Layering
- **Surface Level 0 (Canvas):** Pure `#0B0F17` underlying canvas with ambient background radial gradients (`rgba(99, 102, 241, 0.08)` focused at top-right, `rgba(6, 182, 212, 0.05)` at bottom-left).
- **Surface Level 1 (Base Glass Cards):** Background `rgba(17, 24, 39, 0.72)` paired with `backdrop-filter: blur(20px)` and a subtle single-pixel border `rgba(255, 255, 255, 0.08)`.
- **Surface Level 2 (Floating Modals & Interactive Sheets):** Background `rgba(30, 41, 59, 0.85)` paired with `backdrop-filter: blur(28px)` and top-edge directional sheen (`linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 100%)`).

### Colored Luminous Shadows
- **Active State Glow:** `0 0 24px -4px rgba(99, 102, 241, 0.35)`
- **Protected State Glow:** `0 0 24px -4px rgba(16, 185, 129, 0.30)`
- **Transient Floating Pill:** `0 8px 32px 0 rgba(0, 0, 0, 0.45), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)`

## Colors

The palette relies on a base of deep space obsidian shades, elevated by crystalline translucent layers and accented by vivid intelligent luminescence.

### Base Canvas & Surfaces
- **Base Canvas:** `#0B0F17` (Deep Obsidian Void)
- **Layer 1 Surface (Card / Module Base):** `#111827` (Charcoal Slate, rendered with `80%` opacity backdrop blur)
- **Layer 2 Surface (Elevated / Nested):** `#1E293B` (Interstellar Slate, rendered with `60%` opacity)
- **Border / Stroke Precision:** `rgba(255, 255, 255, 0.08)` across all ambient containers, brightening to `rgba(99, 102, 241, 0.35)` on active states.

### Core Signals & Accents
- **Primary (Neural Focus):** `#6366F1` (Indigo Lumina) paired with `#8B5CF6` (Vivid Violet) for intelligence states, timeline pulses, and dynamic gradients.
- **Secondary (Data Stream):** `#06B6D4` (Electric Cyan) for active connectivity, telemetry readouts, and context boundaries.
- **Tertiary (Guardian Shield):** `#10B981` (Emerald Guard) reserved for optimal security scores, active protections, and verified integrity.

### Text Contrast Tiers
- **Text High-Contrast:** `#F8FAFC` (95% luminous white)
- **Text Mid-Contrast:** `#94A3B8` (Subtle informational gray)
- **Text Low-Contrast:** `#475569` (Muted labels and time micro-stamps)

## Typography

The type scale combines **Plus Jakarta Sans** for structural voice and **Inter** for data clarity. 

- **Display & Headings:** Plus Jakarta Sans provides geometric polish with open apertures and modern curves.
- **Body:** Neutral and rhythmic, optimized for quick scans on mobile screens under various ambient lighting conditions.
- **Labels & Micro-Tags:** Inter delivers uncompromised micro-legibility at 10px–12px with tracked-out spacing (`0.02em` to `0.08em`).

## Components

### Buttons
- **Primary Lumina Button:** Pill or 16px rounded radius. Solid high-gradient background (`linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)`), text color `#FFFFFF` in `label-md` weight.
- **Secondary Glass Action:** Translucent fill (`rgba(255, 255, 255, 0.05)`), border stroke `rgba(255, 255, 255, 0.10)`. Text `#F8FAFC`.
- **Ghost Action:** No fill, no border; hover activates `rgba(255, 255, 255, 0.06)` background.

### Cards & Modular Context Sheets
- Framed in `24px` rounded radii, enclosed in fine `rgba(255, 255, 255, 0.08)` borders.
- Padding set to `1.25rem` (`20px`). Content uses strict vertical rhythm without divider rules.

### Micro-Tags & Badge Pills
- Compact status capsules (`padding: 3px 10px`, radius `9999px`).
- **Emerald Guard (Secure):** Background `rgba(16, 185, 129, 0.12)`, text `#34D399`, left-aligned 6px pulsing dot.
- **Cyan Pulse (Active Stream):** Background `rgba(6, 182, 212, 0.12)`, text `#22D3EE`.
- **Violet Core (Neural Processing):** Background `rgba(99, 102, 241, 0.15)`, text `#A5B4FC`.

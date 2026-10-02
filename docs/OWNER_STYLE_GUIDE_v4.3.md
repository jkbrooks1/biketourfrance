# BikeTourFrance.net Unified Style & Positioning Guide v4.3

Owner-supplied reference, stored verbatim on 2026-10-02. This is the authority. `docs/STYLE_GUIDE.md` records how this site implements it and lists every deviation.

## PURPOSE

This document defines the mandatory visual, structural, positional, interaction, and branding standards for all BikeTourFrance.net marketing properties, tour landing pages, rider information pages, and related web experiences.

This is a deterministic implementation guide.

It is not inspirational.
It is not conceptual.
It is not optional.

Any implementation that deviates from this guide is non-compliant.

---

# BRAND POSITIONING

## Brand Name

Always written exactly as:

BikeTourFrance.net

Never:
- Bike Tour France
- BikeTourFrance
- bike tour france
- BTF

except where abbreviated internally.

---

# POSITIONING

BikeTourFrance.net is:
- practical
- informed
- calm
- experienced
- rider-oriented
- logistics-aware
- structured
- trustworthy

BikeTourFrance.net is NOT:
- luxury tourism
- influencer culture
- hyper-athletic race culture
- startup SaaS aesthetic
- AI-generated visual chaos
- digital nomad branding
- backpacker hostel branding
- ultra-minimal sterile tech branding

Tone:
- experienced rider
- capable tour organizer
- calm competence
- practical confidence
- understated authority

---

# CORE VISUAL PRINCIPLES

## 1. Mobile-first integrity

No desktop-compression artifacts.
No broken mobile rhythm.
No desktop-first layouts forced into mobile.

---

## 2. Multi-column density is allowed

Strategic multi-column density is permitted and encouraged when:
- readable
- aligned
- visually structured
- rhythmically spaced

Avoid clutter.
Avoid dashboard chaos.

---

## 3. Width compliance

Maximum readable layout width:

1200px

Hard upper limit:

1280px

Container standard:

width: calc(100% - 40px);
max-width: 1280px;
margin: 0 auto;

---

## 4. Vertical rhythm

Spacing must feel intentional and systemized.

No random gaps.
No compressed stacking.
No accidental whitespace.

---
4.5 Logo
White on transparent
https://pub-40b24fc600d44d828529b84a0d97ded7.r2.dev/BTF_LOGO_White_on_Transparent.png
White on btf green
https://pub-40b24fc600d44d828529b84a0d97ded7.r2.dev/BTF_White_on_green-6x.png


## 5. Low visual pressure

Interfaces must feel:
- breathable
- stable
- readable
- navigable

Avoid:
- visual shouting
- CTA overload
- excessive contrast density
- overcrowding

---

## 6. Stack-based flow

Pages should progress vertically in a logical reading sequence.

Users should always understand:
- where they are
- what this is
- what comes next
- what action is available

---

# COLOR SYSTEM

## PRIMARY BRAND GREEN

Canonical:

#2D5016

Usage:
- header band
- footer band
- primary CTA buttons
- navigation
- anchors
- emphasis
- borders

---

## DARK GREEN

#1F3D11

Usage:
- hover states
- pressed states
- secondary emphasis

---

## PRESSED GREEN

#17300C

Usage:
- active button states
- pressed interactions

---

## WARM BEIGE

#F5F0E8

Usage:
- secondary button backgrounds
- warm neutral sections
- subtle separation backgrounds

---

## MUTED BLUE

#1B4F72

Usage:
- tertiary hover state
- informational accents only

---

## WHITE

#FFFFFF

Usage:
- primary text on green
- logo treatment
- clean section backgrounds

---

# TYPOGRAPHY

## PRIMARY TYPEFACE

Montserrat, system-ui, sans-serif

Fallback stack mandatory.

---

## TYPOGRAPHIC CHARACTER

Typography should feel:
- modern
- geometric
- clean
- readable
- structured

Avoid:
- whimsical fonts
- luxury serif systems
- condensed fonts
- novelty typography

---

## FONT WEIGHTS

| Usage | Weight |
|---|---|
| Headings | 700 |
| Section headings | 600 |
| Buttons | 600 |
| Body | 400 |
| Tertiary UI | 500 |

---

## TEXT RULES

No all caps.

Sentence case preferred.

Avoid:
- aggressive marketing typography
- oversized hero slogans
- ultra-tight tracking
- excessive bolding

---

# HEADER SYSTEM

## PRIMARY HEADER BAND

The site header is a full-width green navigation band.

This is mandatory.

---

## HEADER COLOR

#2D5016

---

## HEADER HEIGHT

Desktop:

72px

---

## HEADER LAYOUT

Structure:

[ BTF LOGO LEFT ]                       [ NAV RIGHT ]

Navigation is right-aligned.

Logo is left-aligned.

---

## LOGO RULES

Mandatory asset behavior:

- White on transparent only
- No inversion
- No alternate colorways
- No drop shadows
- No glow effects
- No gradient overlays

The logo must remain visually clean and flat.

---

## NAVIGATION LABELS

Approved labels:

- Overview
- Schedule short meeting to discuss
- Overnight Destinations

Avoid generic SaaS navigation wording.

---

# BUTTON SYSTEM (MANDATORY)

## Button Hierarchy

| Type | Usage | Visual Weight |
|---|---|---|
| Primary | Main conversion action / dominant CTA | Highest |
| Secondary | Supporting actions | Medium |
| Tertiary | Inline or low-priority actions | Lowest |

---

## PRIMARY BUTTON (MANDATORY)

Purpose:
- Main CTA
- Registration
- Booking
- Critical navigation actions
- Conversion-driving actions

Visual rules:
- Forest green fill
- White text
- Elevated appearance via shadow
- Subtle hover lift
- Semibold typography
- Rounded corners
- Must appear obviously clickable

Canonical values:
- Background: #2D5016
- Text: #FFFFFF
- Radius: 6px
- Padding: 12px 24px
- Font: Montserrat, system-ui, sans-serif
- Weight: 600
- Size: 16px
- Min Height: 44px

Hover:
- Background: #1F3D11
- Motion: translateY(-2px)

Active:
- Background: #17300C

---

## SECONDARY BUTTON (MANDATORY)

Purpose:
- Supporting actions
- Alternative paths
- Non-primary navigation

Visual rules:
- Warm beige fill
- Forest green border
- Forest green text
- Clear container edge
- Less visual dominance than primary

---

## TERTIARY BUTTON (MANDATORY)

Purpose:
- Minimal inline actions
- Text-style interactions
- Low-emphasis controls

Visual rules:
- No container
- No shadow
- Underlined text
- Behaves visually like a text link

---

# CLICKABILITY REQUIREMENTS (MANDATORY)

All clickable elements must visually communicate clickability immediately.

Approved clickability cues:
- Elevation/shadow
- Border containers
- Hover transitions
- Color transitions
- Underlines
- Pointer cursor
- Pressed states
- Minimum 44px touch targets

Non-obvious click targets are non-compliant.

---

# ACCESSIBILITY REQUIREMENTS

Mandatory:
- Minimum touch target height: 44px
- Visible keyboard focus state
- Focus outline offset minimum: 2px
- Contrast ratio minimum: WCAG AA compliant
- No color-only state indication

---

# HERO SYSTEM

## HERO PURPOSE

The hero section must answer:
- What is this?
- Where is this?
- Why would I care?
- What experience is being offered?

within seconds.

---

## HERO CHARACTER

Should feel:
- calm
- cinematic
- stable
- premium but grounded
- trustworthy

Avoid:
- hype
- startup energy
- extreme motion
- animated chaos

---

# IMAGE SYSTEM

## IMAGE CATEGORIES

Two separate visual systems exist:

### 1. Panda illustrations

Purpose:
- emotional narrative
- atmosphere
- rider experience
- “what this feels like”

### 2. Engraving illustrations

Purpose:
- cultural places
- landmarks
- historical identity
- “what we see”

---

## HARD RULE

Do NOT mix photography and illustration styles in the same section.

This is mandatory.

---

# INTERACTION DESIGN

Interactions should feel:
- responsive
- lightweight
- calm
- obvious
- friction-reduced

Avoid:
- animation-heavy interfaces
- gamification
- novelty interactions
- surprise motion

---

# NON-COMPLIANT ELEMENTS

The following are prohibited unless explicitly approved:
- generic Astro template leftovers
- startup SaaS cards
- glassmorphism
- neon gradients
- AI-style visual clutter
- dashboard chaos
- giant floating CTAs
- autoplay media
- excessive animation
- aggressive shadows
- tiny text
- tiny click targets
- overcompressed sections
- random inconsistent spacing
- mismatched illustration systems
- mixed photography + engraving sections
- luxury travel clichés
- influencer aesthetic

---

# FINAL RULE

If an implementation decision is ambiguous:

choose:
- clarity
- calmness
- readability
- structure
- practical usability

over:
- novelty
- visual tricks
- trendiness
- complexity
- decorative excess
- startup aesthetics

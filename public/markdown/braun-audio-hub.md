# Braun Audio Hub — Edition 01

![Braun-inspired radio player UI](img/projects/braun-audio-hub-hero.png)

## Overview

**Braun Audio Hub** is a Braun-inspired web radio player — a playful experiment that started in **Google Stitch** for visual exploration, then moved to **Google AI Studio** for integration and shipping. I wanted to explore **open APIs**, wire them through Gemini models, and see how far I could push a small creative idea with AI-assisted design and coding.

## From idea to UI: Google Stitch

Another slice of this experiment was **Google Stitch** for the earliest design passes. It made it trivial to **ideate quickly** — riffing on cream-and-red Braun-like surfaces, dials, typography, and layout variants on one canvas — and then **export directly into AI Studio** so I could start iterating in code without rebuilding screens from scratch.

![Google Stitch — exploring Braun-inspired player concepts before coding](img/projects/braun-audio-hub-stitch.png)

That handoff (Stitch → AI Studio → deploy) kept momentum high: design exploration in minutes, then implementation loops where the UI already matched the direction I’d locked in visually.

## Try it

🔗 **[Open Braun Audio Hub](https://braun-audio-hub-edition-01-68667134851.us-west1.run.app)**

## What this project is

- A **nostalgia-forward** UI riff on classic Braun industrial design (think SK-era radios), rebuilt as a digital “hub” for streaming.
- A sandbox for **experimenting with AI Studio** (after Stitch exports): integrating AI features feels almost **one-click simple**, and **shipping** with deploy-from-studio workflows is similarly frictionless.
- A reminder that **generous free tiers** can fund real experiments — this build cost me nothing beyond time, and I still catch myself **listening to stations while I work**.

## What I enjoyed

- **Speed of iteration** — Gemini + AI Studio lowered the barrier from idea to working UI.
- **Deployment story** — publishing feels like a double-click compared to some heavier local/agent setups.
- **The vibe** — it brought back real nostalgia; dialing between stations and hearing audio while iterating made it feel less like a demo and more like a toy I actually use.

## Honest limitations

Google AI Studio isn’t a drop-in replacement for tools like **Claude Code**, **Cursor**, **Replit**, or **Lovable** — there are real constraints on customization, debugging depth, and how much “production polish” you can expect without leaving the studio comfort zone. For this project, that trade-off was fine: it was always meant as a **fun experiment**, not a production platform bet.

## Tech angle

- Experimentation with **Gemini** models and AI Studio’s integration patterns  
- **Open APIs** for streaming / radio-style playback  
- Lightweight deploy to **Cloud Run** (`*.run.app`) for a always-on demo

---

*Braun industrial design is referenced here as inspiration only — this is an independent fan experiment and not affiliated with Braun.*

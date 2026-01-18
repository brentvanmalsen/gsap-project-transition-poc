# GSAP Project Intro to Page Transition — Proof of Concept

This repository contains a small proof of concept that recreates a cinematic project transition (designed in Figma) as a working web animation using GSAP. The interaction starts from a project intro layout and transitions into a project detail state, where the album cover becomes a left-aligned hero and the supporting content appears on the right.

The goal of this POC is to better understand how GSAP timelines and sequencing translate a designed animation into a feasible implementation. This also helps me make more informed animation choices in Figma, because I now better understand what a developer would need in order to build the transition.

---

## What this POC shows

- A clear **start state** (project intro)
- A **click-triggered** transition on the project image
- A GSAP **timeline-based** animation that:
  - moves the image toward the left first
  - expands the image into a **left-aligned hero**
  - reveals a **right-side panel**
  - fades in supporting content and text in sequence
- A simple **close** action to return to the intro state

---

## Tech stack

- GSAP 3 (CDN)
- HTML5
- CSS3
- JavaScript (vanilla)

No build tools, frameworks or bundlers are used.

---

## Project structure

- index.html
- style.css
- main.js
- images/album_cover.jpg
- fonts/Maharlika-Regular.ttf

## How to run

1. Clone or download this repository:
   ```bash
   git clone https://github.com/brentvanmalsen/gsap-project-transition-poc.git
2. Open the project folder.
3. Run the prototype by opening index.html in your browse

## Interaction flow

1. Page loads in the Project Intro state
2. User clicks the project image
3. GSAP timeline starts
4. Image moves left, then expands into a left-aligned hero
5. Right-side panel appears
6. Supporting content fades in
7. Text appears in a timed sequence
8. End state: Project detail visible

## Why this POC exists

Earlier in the semester I set a personal development goal to learn more about GSAP as an animation technique. I want to design UX animations with a clearer sense of technical feasibility, so I can make better decisions while designing animations in Figma.

This POC builds on an earlier GSAP prototype (animated mobile navigation), but goes further by animating core page content and layout transformation rather than a contained overlay component. It focuses on translating an already designed animation into a realistic implementation, and documenting the logic clearly enough that it could be reused or implemented by developers within the team.


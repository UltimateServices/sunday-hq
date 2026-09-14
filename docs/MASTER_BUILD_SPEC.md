<!-- Dylan attachment 2026-09-14. Canonical master build spec. Do not delete. Product overrides: `/` = Top-10 Apple Home; `/dashboard` = Command Center; live-gate; Odds API tomorrow; Fade Board parked. -->

MASTER BUILD SPECIFICATION — Sunday NFL Props & Parlay Intelligence Platform

This document defines the complete product, data, modeling, workflow, automation, architecture, research, and decision-support requirements for the NFL Sunday intelligence application.

This is separate from the UI blueprint.

The application is a private NFL analytics and betting-research platform deployed through GitHub and Vercel.

Do not treat this as a simple picks page.

The system must function as a complete Sunday NFL command center that researches the entire slate, organizes information, calculates projections and probabilities, evaluates sportsbook markets, detects important news and changes, ranks opportunities, builds correlated parlays, evaluates boosts, tracks results, and learns from previous weeks.

PRIMARY MARKETS
- QB passing yards
- QB passing touchdowns
- QB rushing yards
- QB completions
- QB attempts
- Interceptions
- RB rushing yards
- RB receiving yards
- RB receptions
- RB scrimmage yards
- RB touchdowns
- WR receiving yards
- WR receptions
- WR touchdowns
- TE receiving yards
- TE receptions
- TE touchdowns
- Anytime touchdown props
- First touchdown props
- 2+ touchdown props
- Alternate yardage lines
- Longest reception
- Longest rush
- Team totals
- Game totals
- Same-game parlays
- Multi-game parlays
- Sportsbook profit boosts

CORE WORKFLOW
collect → verify → normalize → model → compare → rank → explain → monitor → record → learn

1. PRODUCT PHILOSOPHY
The system should have three layers:

Layer 1 — Command Center
The user should understand the most important information in approximately 5 minutes:
- What changed overnight?
- Who is healthy?
- Who is questionable?
- Which injuries matter?
- Which games have weather problems?
- Which games have the best scoring environments?
- Which players have the strongest projections?
- Where are the largest sportsbook/model discrepancies?
- What are the best overs?
- What are the best unders?
- Who has the highest touchdown probability?
- Which team totals look strongest?
- Which bets should be avoided?
- Which parlays make logical sense?
- Where should a boost be used?

Layer 2 — Research Boards
Pages/sections for:
- Games
- QBs
- RBs
- WRs
- TEs
- TDs
- Props
- Team Totals
- Game Totals
- Weather
- Injuries
- Matchups
- Line Movement
- Fantasy Projections
- Parlays
- Boosts

Layer 3 — Deep Dive
Clicking any player or game must reveal exactly why the model is producing its projection.
No recommendation should ever be a mysterious black box.

2. GLOBAL PRODUCT STANDARD
The app should behave like a combination of:
- sportsbook research terminal
- trading terminal
- fantasy analytics platform
- NFL data dashboard
- private betting intelligence assistant

The app must be data-dense, fast, mobile-friendly, and easy to scan.

3. HEALTH / AVAILABILITY SYSTEM
Never label a player “100% healthy.”

Use standardized statuses:
- NO KNOWN LIMITATION
- MINOR CONCERN
- QUESTIONABLE
- EXPECTED LIMITED
- GAME-TIME DECISION
- HIGH RISK
- OUT
- IR / PUP / NFI

Track:
- injury
- body part
- designation
- practice participation
- Wednesday status
- Thursday status
- Friday status
- Saturday update
- game-day update
- expected snap limitation
- recent return from injury
- reinjury concern
- illness
- concussion status
- coach comments
- reliable reporter expectations when available
- official inactive status

Health must affect projections.

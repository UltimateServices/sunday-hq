# Sunday HQ — MASTER BUILD SPECIFICATION (FULL)

Product overrides (Dylan):
- `/` = Top-10 Apple/user-friendly Home (Props / Overs / Unders / Spreads by highest grades)
- `/dashboard` = Command Center (research workspace)
- Live-gate stays until Odds API keys are set (tomorrow)
- No inventing data/odds; Fade Board parked
- Condensed contracts remain `docs/MASTER_SPEC.md` and `docs/UI_BLUEPRINT.md`

Source: Dylan attachment 2026-09-14 (1597 lines, sections 1–143). Incomplete stubs/drafts are obsolete.

---

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
8. GAME PAGE REQUIREMENTS
Each game must include:
- teams
- kickoff
- stadium
- weather
- spread
- game total
- implied team totals
- model spread
- model total
- summary
- injuries
- weather
- offensive matchups
- defensive matchups
- expected game script
- pace
- pass rate
- rush rate
- red-zone expectations
- top player projections
- best props
- best unders
- TD candidates
- team total opportunity
- parlay correlations
- risks
- line movement

9. GAME SCRIPT ENGINE
Model probable game scripts.

Examples:
- favorite leads most of game
- close game
- underdog leads

Translate into:
- QB pass attempts
- RB carries
- RB target share
- WR/TE volume
- late-game passing
- rushing suppression
- blowout risk

10. QB PROJECTION BOARD
Rank at least top 25 QBs by:
- passing attempts
- completions
- passing yards
- passing TDs
- interception probability
- rushing yards
- rushing TD probability
- 300+ yard probability
- fantasy projection
- matchup score
- confidence

11. QB MATCHUP MODEL
Evaluate opponent:
- passing yards allowed
- yards per attempt
- completion rate
- explosive pass rate
- pressure rate
- sack rate
- blitz rate
- man/zone tendencies
- red-zone pass defense
- passing TD rate
- interception rate
- EPA allowed

Adjust for opponent quality faced.

12. QB PROTECTION MODEL
Compare:
- OL pass protection
- opponent pass rush
- missing tackles/guards/center
- pressure mismatch
- scramble/sack risk

13. RB PROJECTION BOARD
Rank by:
- projected carries
- rushing yards
- YPC
- targets
- receptions
- receiving yards
- scrimmage yards
- red-zone carries
- goal-line carries
- anytime TD probability
- 2+ TD probability
- fantasy projection
- matchup
- confidence

14. RB WORKLOAD MODEL
Track:
- snap share
- carry share
- route participation
- target share
- red-zone carries
- inside-10 carries
- inside-5 carries
- two-minute usage
- third-down usage
- goal-line role
- recent role changes
- committee competition

Lower confidence when workload is unstable.

15. RB MATCHUP MODEL
Evaluate:
- rush EPA
- rush success rate
- YPC allowed
- yards before contact
- yards after contact
- explosive rushing plays
- RB receptions allowed
- RB receiving yards allowed
- goal-line defense
- defensive-line injuries
- linebacker injuries
- expected game script

16. WR PROJECTION BOARD
Rank by:
- targets
- receptions
- receiving yards
- air yards
- target share
- first-read share
- red-zone targets
- end-zone targets
- TD probability
- 100+ yard probability
- fantasy projection
- coverage grade
- confidence

17. WR ROLE MODEL
Track:
- route participation
- target share
- targets per route
- air-yard share
- average depth of target
- first-read share
- slot %
- outside %
- red-zone target share
- end-zone target share
- YAC
- explosive reception rate
- recent role changes

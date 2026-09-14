<!-- Dylan attachment 2026-09-14. Canonical master build spec. Do not delete. Product overrides: `/` = Top-10 Apple Home; `/dashboard` = Command Center; live-gate; Odds API tomorrow; Fade Board parked. -->

# Sunday HQ — MASTER BUILD SPECIFICATION (STUB)

**DO NOT MERGE this file until it is ~1600 lines.**

Body pending from Dylan’s attached “MASTER BUILD SPECIFICATION — Sunday NFL Props & Parlay Intelligence Platform” (≈1597 lines, sections 1–143), to be written verbatim onto this branch by Mr. Football.

This stub is not the spec. Do not invent sections 1–143.

Product overrides (Dylan):
- `/` = Top-10 Apple/user-friendly Home (Props / Overs / Unders / Spreads by highest grades)
- `/dashboard` = Command Center (research workspace)
- Live-gate stays until Odds API keys are set (tomorrow)
- No inventing data/odds; Fade Board parked
- Condensed contracts remain `docs/MASTER_SPEC.md` and `docs/UI_BLUEPRINT.md`

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

4. TEAMMATE INJURY IMPACT
Do not evaluate players in isolation.

If a WR1 is out, consider effects on:
- WR2 target share
- WR3 routes
- TE targets
- RB receiving work
- QB efficiency
- red-zone distribution

Do the same for:
- RB injuries
- OL injuries
- TE injuries
- QB injuries
- defensive injuries
- corner injuries
- safety injuries
- linebacker injuries
- pass-rusher injuries
- defensive-line injuries

5. OFFENSIVE LINE MODULE
Track expected starters:
- LT
- LG
- C
- RG
- RT
- backups

Track:
- injuries
- continuity
- pass protection quality
- run blocking quality

OL injuries should impact:
- QB passing projection
- QB sack risk
- QB scramble probability
- RB rushing efficiency
- team scoring projection

6. WEATHER MODEL
For every outdoor game collect:
- temperature
- feels-like temperature
- wind
- wind gusts
- rain probability
- expected rain amount
- snow probability
- humidity
- field condition
- stadium type
- roof status
- weather severity

Severity:
- GREEN
- MINOR
- MODERATE
- MAJOR
- SEVERE

Estimate directional impact on:
- passing
- deep passing
- receiving
- rushing
- kicking
- team scoring
- turnovers

Wind should receive special attention.

Dome games:
- clearly label DOME / WEATHER SAFE

Retractable roof:
- OPEN
- CLOSED
- EXPECTED OPEN
- EXPECTED CLOSED
- UNKNOWN

7. GAME ENVIRONMENT MODEL
Rank every game.

Inputs:
- sportsbook total
- model total
- pace
- play volume
- passing efficiency
- rushing efficiency
- defensive efficiency
- explosive-play potential
- injuries
- weather
- game-script uncertainty
- red-zone efficiency
- projected possessions

Output:
- Game Environment Score 0–100
- expected combined points
- expected plays
- expected pass attempts
- expected rush attempts
- weather grade
- injury grade
- upside grade

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

18. WR / COVERAGE MATCHUP MODEL
Evaluate:
- opposing CB quality
- shadow likelihood
- slot matchup
- man coverage
- zone coverage
- single-high
- two-high
- safety help
- corner injuries
- coverage efficiency
- explosive passes allowed

Do not reduce coverage to simplistic one-WR-vs-one-CB logic.

19. TE MODEL
Track:
- routes
- targets
- receptions
- yards
- red-zone targets
- end-zone targets
- TD probability
- linebacker coverage
- safety coverage
- fantasy projection

20. TARGET REDISTRIBUTION MODEL
If a player is out, estimate where volume shifts.

Do not simply transfer 100% of lost targets or touches to one replacement.

Use historical and role-based redistribution.

21. TOUCHDOWN MODEL
Create rankings for:
- anytime TD
- first TD
- 2+ TD
- QB rushing TD

Inputs:
- team implied total
- player red-zone share
- inside-10 touches
- inside-5 touches
- end-zone targets
- snap share
- goal-line role
- opponent red-zone defense
- game script
- health

Recent TD count must never be the main driver.

22. TEAM SCORING MODEL
Project points for every team.
Compare model total to sportsbook team total.

Rank:
- best team-total overs
- best team-total unders

23. GAME TOTAL MODEL
Project every game total and explain whether the edge comes from:
- pace
- efficiency
- explosive plays
- injuries
- weather
- game script
- red-zone efficiency

24. PACE / PLAY VOLUME MODEL
Track:
- seconds per snap
- neutral pace
- projected plays
- opponent pace
- pass rate
- rush rate
- neutral pass rate
- trailing pass rate
- leading rush rate

25. SPREAD / GAME-SCRIPT SENSITIVITY
Adjust projections for:
- large favorite
- large underdog
- close spread
- likely blowout
- catch-up passing
- fourth-quarter rushing

26. IMPLIED TEAM TOTALS
Use implied team scoring as a strong input for TD probability and offensive environment.

27. RED-ZONE MODEL
Track team:
- red-zone trips
- red-zone TD rate
- red-zone pass rate
- red-zone rush rate

Track player:
- red-zone touches
- red-zone target share
- inside-10 touches
- inside-5 touches
- end-zone targets
- goal-line carries

28. EXPLOSIVE PLAY MODEL
Track:
- 20+ yard passes
- 40+ yard passes
- 20+ yard rushes
- explosive rate
- defense explosive plays allowed
- player explosive ability

Use for:
- yardage props
- longest reception
- longest rush
- alternate lines
- ceiling outcomes

29. RECENT FORM
Show last 1 / 3 / 5 games.
Do not overreact to one game.
Separate:
- sustainable role change
- random variance

30. HOME / AWAY SPLITS
Only use when sample size and context justify it.

31. OPPONENT-ADJUSTED HISTORY
Prefer performance against similar scheme/strength over simple career-vs-team splits.

32. HEAD-TO-HEAD HISTORY
Include previous meetings but downweight old games when personnel/coaching changed.

33. COACHING TENDENCIES
Track:
- pass rate over expectation
- red-zone play calling
- fourth-down aggressiveness
- RB committee usage
- leading/trailing tendencies
- play-calling changes

34. PERSONNEL GROUPINGS
Where useful track:
- 11 personnel
- 12 personnel
- 21 personnel
- opponent performance vs packages

35. DEFENSIVE SCHEME
Track:
- man %
- zone %
- blitz rate
- single-high
- two-high
- pressure
- how offense performs vs those looks

36. FANTASY PROJECTIONS
Use multiple reliable projection systems when possible.

Rank:
- QB
- RB
- WR
- TE
- FLEX
- overall

Track:
- source projection
- consensus projection
- median
- mean
- high
- low
- disagreement

37. PROJECTION CONSENSUS
Example output:
- Model: 86
- External Median: 82
- External High: 91
- External Low: 69
- Sportsbook: 72.5

High disagreement lowers confidence.

38. SPORTSBOOK MARKET CONSENSUS
Compare across books:
- line
- odds
- opening line
- current line

A line must never be evaluated without price.

39. OPENING VS CURRENT LINE
Track all movement.

Examples:
- 59.5 → 68.5
- -110 → -145
- team total +2 points

40. STEAM / MOVEMENT DETECTION
Detect unusual synchronized movement across books.

Do not automatically recommend following steam.

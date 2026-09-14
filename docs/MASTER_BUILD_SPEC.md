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

41. BEST-LINE SHOPPING
Find the best available line and price.

42. IMPLIED PROBABILITY
Convert sportsbook odds to implied probability.

43. PROBABILITY MODEL
Do not output only a projection.

Example:
- line: 72.5
- projection: 84.3
- median: 80.1
- over probability: 63.7%
- under probability: 36.3%

44. EXPECTED VALUE
Calculate:
- sportsbook odds
- implied probability
- model probability
- expected value

Rank by value, not just raw stat difference.

45. MEDIAN VS MEAN
Use both.
For volatile players, median can be more decision-useful than mean.

46. DISTRIBUTION SIMULATION
Where supported, simulate player/game outcomes to estimate:
- yardage probabilities
- receptions
- TDs
- alternate lines
- team totals
- game totals

47. EDGE SCORE
Create standardized Edge Score 0–100.

Possible inputs:
- projection edge
- probability edge
- EV
- projection consensus
- health certainty
- workload certainty
- matchup
- weather
- market movement
- role stability

48. CONFIDENCE SCORE
Confidence is different from edge.

Inputs:
- sample size
- workload certainty
- injury uncertainty
- weather uncertainty
- projection agreement
- role stability
- line volatility
- personnel changes

Grades:
- A+
- A
- A-
- B+
- B
- B-
- C
- PASS

49. FLOOR / MEDIAN / MEAN / CEILING
Display for major player projections.

50. VOLATILITY SCORE
- LOW
- MEDIUM
- HIGH
- VERY HIGH

Volume-driven players should generally be more stable than boom/bust players.

51. MATCHUP SCORE
Give every relevant player a matchup score 0–100.
Always allow decomposition of the score.
52. HEALTH SCORE
Incorporate:
- player health
- teammate availability
- opposing defensive availability

53. WEATHER SCORE
Grade weather environment 0–100 or equivalent categorical score.

54. MARKET VALUE SCORE
Compare projection/probability to line and odds.

55. “WHY?” EXPLANATION ENGINE
Every recommendation must provide:
- why model likes it
- supporting factors
- risks
- market context
- data quality

56. TRAP / RISK DETECTION
Flag:
- last-week overreaction
- uncertain role
- line already moved too far
- injury uncertainty
- poor projection agreement
- suspiciously low volume
- matchup deterioration

57. AVOID LIST
Generate a list of markets to avoid because of:
- uncertain injuries
- unclear workload
- bad weather
- poor matchup
- conflicting projections
- new QB
- committee uncertainty
- return from injury
- market already corrected

58. BEST OVERS
Rank overs by:
- QB
- RB
- WR
- TE
- receptions
- team totals

59. BEST UNDERS
Give unders equal analytical quality.

60. BEST TDs
Rank anytime TD candidates by modeled probability versus offered odds.

61. BEST TEAM TOTALS
Rank team over/under opportunities.

62. BEST GAME TOTALS
Rank full-game over/under opportunities.

63. FIRST-HALF ANGLES
If supported, model first-half separately from full-game.

64. TOP QB BOARD
Minimum:
- top 25 passing yard projections
- passing TD projections
- rushing
- fantasy

65. TOP RB BOARD
Show:
- carries
- rush yards
- scrimmage yards
- TD probability

66. TOP WR BOARD
Show:
- targets
- receptions
- yards
- TD probability

67. TOP TE BOARD
Same structure.

68. TOP TD BOARD
Top 25 players by anytime TD probability.

69. TOP FANTASY BOARD
Rank entire slate by fantasy projection.

70. BEST MATCHUP BOARD
Top offensive mismatch situations.

71. WORST MATCHUP BOARD
Players who should be downgraded.

72. BEST WEATHER GAMES
Dome / low-wind / strong environment.

73. WORST WEATHER GAMES
High-wind / severe weather first.

74. HIGH-SCORING ENVIRONMENTS
Rank games by projected scoring and play volume.

75. LOW-SCORING ENVIRONMENTS
Useful for unders and TD avoidance.

76. SURPRISE OPPORTUNITY REPORT
Highlight backups/secondary players whose role may rise due to injuries.

77. LATE-NEWS SENSITIVITY
Show which recommendations depend on unresolved statuses.

78. PARLAY CENTER
Support:
- same-game parlays
- cross-game parlays
- conservative
- balanced
- aggressive
- TD parlays
- yardage parlays
- team-total parlays

79. CORRELATION ENGINE
Positive examples:
- QB pass yards + WR receiving yards
- QB pass TD + WR TD
- team total over + offensive TD
- trailing script + QB pass attempts
- favorite script + RB carries

Negative examples:
- RB rushing over + team being blown out
- QB passing under + multiple WR overs
- game under + many offensive overs
Grades:
- STRONG POSITIVE
- POSITIVE
- NEUTRAL
- NEGATIVE
- STRONG NEGATIVE

80. PARLAY CONSTRUCTION RULE
Do not simply combine top-ranked props.
Require logical compatibility.

81. PARLAY OUTPUT
Every parlay should show:
- legs
- individual probabilities
- combined estimated probability
- correlation adjustment
- sportsbook odds
- estimated fair odds
- EV
- risk grade
- required game script

82. “HOW THIS PARLAY WINS”
Explain the game script needed.

83. “HOW THIS PARLAY LOSES”
Explain primary failure modes.

84. BOOST ENGINE
Input:
- sportsbook
- boost %
- max stake
- min odds
- max odds
- minimum legs
- eligible markets
- expiration

Output:
- best use
- second-best
- third-best
- normal EV
- boosted EV
- EV gain
- risk

85. BOOST OPTIMIZATION
Do not choose longest odds automatically.
Choose highest improvement in expected value within constraints.

86. ALTERNATE LINES
Calculate probabilities/EV for alternate:
- 25+
- 40+
- 50+
- 60+
- 75+
- 80+
- 100+
or relevant increments.

87. SAFE-VOLUME BOARD
Rank players with secure:
- carries
- targets
- routes
- attempts
- snaps

88. CEILING BOARD
Rank upside using:
- game environment
- explosive role
- volume
- matchup
- red-zone usage

89. FLOOR BOARD
Rank high-stability usage players for conservative constructions.

90. NO FORCED PICKS
If no plays meet thresholds, show none.
Never force a fixed number of bets.

91. MINIMUM EDGE THRESHOLD
Require a meaningful advantage before displaying a recommendation.

92. MINIMUM DATA THRESHOLD
Do not heavily recommend low-sample players without strong contextual evidence.

93. MY CARD
Statuses:
- RESEARCHING
- WATCHING
- READY
- BET PLACED
- PASS
- CANCELLED
- RESULT PENDING
- WIN
- LOSS
- PUSH

94. BET SNAPSHOT
When bet is placed, store:
- projection
- line
- odds
- confidence
- weather
- health
- timestamp
- boost
- units

Never overwrite historical bet context.

95. BANKROLL / UNITS
Use unit recommendations, not mandatory dollar amounts:
- 0.25
- 0.5
- 0.75
- 1
- 1.5

Parlays generally should receive smaller unit treatment.

96. NO LOSS CHASING
Never increase suggested stake because earlier bets lost.

97. SUNDAY ROUTINE — EARLY MORNING
- build slate
- update injuries
- pull weather
- pull fantasy projections
- pull markets
- build player/team/game projections
- build rankings
- detect overnight changes

98. SUNDAY ROUTINE — MID-MORNING
- refresh injuries
- refresh weather
- refresh lines
- detect movements
- recalculate projections
- recalculate edges
- recalculate rankings

99. SUNDAY ROUTINE — PRE-INACTIVES
- flag unresolved injuries
- identify recommendations dependent on them
- mark unstable plays
100. SUNDAY ROUTINE — OFFICIAL INACTIVES
Rebuild affected games:
- workloads
- target shares
- rushing shares
- TD probabilities
- team totals
- game totals
- parlays
- confidence

101. SUNDAY ROUTINE — FINAL PRE-KICKOFF
- update lines
- update weather
- confirm actives
- confirm roof
- freeze pregame snapshot
- finalize early-window card

102. LATE WINDOWS
Separate processing for:
- 1 PM
- 4 PM
- Sunday Night Football

Late games should be refreshed again after early games begin.

103. DATA FRESHNESS
Every major data item should show timestamp where relevant.

Examples:
- Weather updated 10:41 AM
- Injury updated 10:52 AM
- Prop line updated 11:04 AM
- Projection updated 11:05 AM

104. SOURCE RELIABILITY
Prefer:
1. official NFL/team statuses
2. official inactive lists
3. reliable structured injury data
4. trusted reporting
5. projection systems
6. secondary reporting
7. social chatter

If sources disagree:
- mark SOURCE CONFLICT
- do not silently choose

105. DATA NORMALIZATION
Normalize:
- player IDs
- team IDs
- game IDs
- team abbreviations
- player names
- sportsbook names
- prop names
- positions
- odds format
- timestamps
- injury statuses

Never rely only on text names.

106. HISTORICAL DATABASE
Store every relevant Sunday snapshot:
- date
- week
- game
- player
- model version
- projection
- sportsbook line
- odds
- health
- weather
- matchup
- confidence
- probability
- closing line
- actual result
- recommendation
- result

107. CLOSING LINE VALUE
Track CLV separately from wins/losses.

Example:
- bet Over 68.5
- close 74.5
- CLV +6 yards

108. RESULTS TRACKING
Track:
- wins
- losses
- pushes
- units
- ROI
- CLV
- probability edge
- EV at bet time

109. PERFORMANCE BY MARKET
Track separately:
- QB yards
- QB TD
- RB yards
- WR yards
- receptions
- TDs
- team totals
- game totals
- overs
- unders
- parlays
- boosts

110. PERFORMANCE BY CONFIDENCE
Determine whether A-tier plays actually outperform lower tiers.

111. PERFORMANCE BY SOURCE
Track which projection inputs are most accurate over time.

112. CALIBRATION
If model says 60%, outcomes should approximately calibrate to 60% over a meaningful sample.

Use buckets:
- 50–55%
- 55–60%
- 60–65%
- 65–70%
- 70%+

113. POST-WEEK REVIEW
Classify misses:
- workload error
- injury assumption
- game-script error
- weather error
- matchup error
- efficiency variance
- early injury
- benching
- blowout
- overtime
- turnovers
- pure variance

114. MONDAY MODEL REVIEW
Show:
- best calls
- worst calls
- biggest projection misses
- best CLV
- worst CLV
- injury errors
- workload errors
- weather errors
- market errors
- model improvement ideas

Do not automatically reweight the model from one week.
115. ADMIN CONTROLS
Allow configuration of:
- minimum edge
- minimum probability
- minimum EV
- confidence weighting
- market weighting
- source weighting
- injury weighting
- weather weighting
- recent-game weighting
- season weighting
- minimum samples
- alert thresholds
- parlay limits
- sportsbooks
- refresh settings

116. PLAYER SEARCH
Search any player.
Player profile should show:
- season performance
- recent games
- current projections
- prop history
- market history
- matchup history
- model accuracy
- health context

117. TEAM PAGE
Every team should include:
- offense
- defense
- pace
- pass rate
- rush rate
- red zone
- OL
- injuries
- QB
- RB committee
- target distribution
- upcoming opponent
- team total history

118. ALERT CENTER
Alerts:
- PLAYER OUT
- PLAYER ACTIVE
- EXPECTED LIMITED
- STARTING OL OUT
- CB1 OUT
- WEATHER WORSENING
- WIND ABOVE THRESHOLD
- PROP MOVED
- ODDS MOVED
- TEAM TOTAL MOVED
- GAME TOTAL MOVED
- PROJECTION CHANGED
- MODEL EDGE APPEARED
- MODEL EDGE DISAPPEARED

119. CHANGE LOG
Chronological audit trail:
- timestamp
- event
- previous value
- new value
- reason
- downstream impact

120. DATA QUALITY STATES
If missing/uncertain:
- DATA UNAVAILABLE
- STALE DATA
- SOURCE CONFLICT
- LOW SAMPLE
- MODEL UNCERTAINTY

Never fabricate.

121. MODEL TRANSPARENCY
Any composite score must be decomposable.

Example:
Matchup Score 82:
- run defense +14
- OL advantage +9
- game script +7
- red-zone matchup +4
- weather +2

122. NO FALSE CERTAINTY
Never use:
- LOCK
- GUARANTEED
- 100%
- CAN’T MISS

Use:
- Strong Edge
- High Confidence
- Moderate Edge
- Speculative
- Avoid

123. “GOOD PLAYER” VS “GOOD BET”
System must always distinguish between:
- good player
- good matchup
- good projection
- good bet

These are not the same.

124. GITHUB PROJECT ORGANIZATION
Keep clear separation between:
- frontend
- backend/API
- database
- data ingestion
- projection models
- utilities
- scheduled routines
- tests
- configuration
- documentation

Secrets must never be committed.

125. VERCEL REQUIREMENTS
Design for:
- stateless deployment
- persistent external database
- repeatable scheduled jobs
- idempotent ingestion
- no reliance on temporary local state
- safe retries
- proper production/dev environments

126. DATABASE REQUIREMENTS
Use persistent storage for:
- games
- teams
- players
- player aliases
- injuries
- weather snapshots
- sportsbooks
- markets
- lines
- odds history
- projections
- model versions
- recommendations
- parlays
- boosts
- bets
- results
- CLV
- performance metrics
- alerts
- change log
- job history

127. MODEL VERSIONING
Every generated projection/recommendation should be traceable to a model version.

Store model version on historical records.
128. JOB IDEMPOTENCY
Scheduled jobs should be safe to rerun.
Avoid duplicate lines, duplicate projections, duplicate alerts, duplicate game snapshots.

129. ERROR HANDLING
If one external source fails:
- app should continue where possible
- show degraded status
- use last valid data only when clearly labeled
- log failure
- avoid silently substituting fake values

130. OBSERVABILITY
Track:
- job success/failure
- source freshness
- API failures
- missing games
- missing players
- duplicates
- unmatched names
- projection failures
- stale odds
- stale weather
- failed settlements

131. TESTING
Before production Sunday:
- verify all NFL teams
- verify schedule
- verify player-team mapping
- verify game IDs
- verify time zones
- verify injury mapping
- verify inactive processing
- verify weather/stadium mapping
- verify duplicate prop detection
- verify odds conversion
- verify implied probability
- verify EV
- verify push handling
- verify settlement
- verify line history
- verify model snapshot preservation

132. DO NOT OVERFIT
Recent games matter but should not overwhelm season/context without evidence of a real role change.

133. MODEL INPUT WEIGHTING
Projection framework should consider:
- season baseline
- recent usage
- opponent
- game environment
- market expectation
- injuries
- weather
- personnel
- coaching
- historical efficiency
- fantasy consensus

134. SOURCE WEIGHTING
Allow source reliability and historical accuracy to influence projection consensus.

135. SUNDAY HOME OUTPUT
The final Sunday decision layer should include:
- Critical News
- What Changed
- Top 10 Model Edges
- Top 10 Volume Plays
- Top 10 TDs
- Top 10 Unders
- Top 10 Team Totals
- Top QB Projections
- Top RB Projections
- Top WR Projections
- Top TE Projections
- Best Game Environments
- Weather Warnings
- Injury Warnings
- Best Boost
- Best Correlated Parlays
- Avoid List
- My Card

136. STANDARD RECOMMENDATION FORMAT
Every recommendation:
- Player
- Market
- Book
- Line
- Odds
- Model
- Median
- Edge
- Model Probability
- Implied Probability
- EV
- Confidence
- Matchup
- Health
- Weather
- Market Movement
- Why
- Risks
- Data Quality

137. EXAMPLE RECOMMENDATION
Player: Example WR
Market: Receiving Yards Over 82.5
Odds: -110
Model: 96.4
Median: 92.7
Edge: +13.9 yards
Over Probability: 64%
Implied Probability: 52.4%
Probability Edge: +11.6 percentage points
Confidence: A
Health: No Known Limitation
Weather: Dome
Matchup: Strong
Line Movement: 79.5 → 82.5

WHY:
- High target share
- Favorable script
- Strong route participation
- Opponent vulnerable to outside WR production

RISKS:
- Market already moved
- Projection disagreement may be rising
138. DEVELOPMENT PHASES
PHASE 1
- app shell
- auth if needed
- database structure
- games
- teams
- players
- Command Center basics

PHASE 2
- injuries
- weather
- fantasy projections
- player projections

PHASE 3
- sportsbook lines
- odds history
- implied probability
- EV
- prop center

PHASE 4
- matchup engines
- TD model
- team totals
- game totals

PHASE 5
- parlays
- correlation
- boosts
- My Card

PHASE 6
- historical results
- CLV
- model performance
- calibration

PHASE 7
- alerts
- change detection
- admin weighting
- model learning tools

139. DATA-CORRECTNESS PRIORITY
Do not sacrifice correctness to add visual features faster.

140. PERMANENT PLATFORM RULE
Build the foundation so future seasons, players, games, sportsbooks, prop types, model versions, and historical records can be added without restructuring the application.

141. FINAL SYSTEM OBJECTIVE
The platform should answer:
- Who should I research first?
- Who has the strongest workload?
- Who has the best matchup?
- Who has the safest role?
- Who has the highest ceiling?
- Who is most likely to score?
- Where does the model disagree with the sportsbook?
- Which market already moved?
- Which opportunity is still valuable?
- What should I avoid?
- Which legs fit together?
- Where should my boost go?
- What changed since I last checked?

142. CORE DECISION FORMULA
The strongest opportunity is where:
expected performance
+ probability
+ market price
+ health
+ workload
+ matchup
+ game environment
+ market movement
+ correlation
+ uncertainty
combine favorably.

143. FINAL INSTRUCTION TO DEVELOPMENT AGENT
Do not simplify away major modules from this specification.

If a feature cannot be completed immediately:
- preserve its place in the architecture
- mark it pending
- do not redesign the product around its temporary absence

Do not optimize only for the fastest MVP.

Treat this as a permanent private NFL intelligence platform, not a one-season experiment.

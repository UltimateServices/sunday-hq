# Sunday HQ — Page-by-Page UI Blueprint (FULL)

OVERRIDE: `/` is Dylan’s Top-10 Apple/user-friendly shareable Home (Props / Overs / Unders / Spreads by highest grades).
Item 9 “default after login / Command Center” maps to `/dashboard`, NOT `/`.
Live-gate stays: if Odds tape is not LIVE, do not present seed tickets as bettable.
Do not invent numbers, DK prices, or missing engines.
Fade Board is parked — not in this ship.
Condensed contracts remain docs/MASTER_SPEC.md and docs/UI_BLUEPRINT.md.

Source: Dylan full attachment 2026-09-14. Incomplete chat pastes are obsolete.

---

PAGE-BY-PAGE UI BLUEPRINT — Sunday NFL Intelligence Platform

This document defines the exact UI structure, page hierarchy, card systems, table layouts, user interactions, filters, mobile behavior, navigation behavior, and visual priorities for the NFL intelligence application.

This should be treated as the UI implementation specification.

Do not reduce this into generic dashboard pages.

The platform should feel like a combination of:
- sportsbook research terminal
- NFL analytics dashboard
- fantasy projection platform
- market-monitoring terminal
- personal Sunday betting workspace

The owner should be able to use it quickly on an iPhone Sunday morning while still having a dense, powerful desktop experience.

1. GLOBAL APP SHELL
DESKTOP
Use a fixed left sidebar, approximately 220–250px.
Main content occupies remaining viewport.
Optional right-side context drawer appears only when needed.
Primary layout: LEFT SIDEBAR / TOP HEADER / MAIN CONTENT / OPTIONAL RIGHT DRAWER.

2. LEFT SIDEBAR
Order:
COMMAND CENTER
GAMES
PROPS
TOUCHDOWNS
TEAM TOTALS
GAME TOTALS
QUARTERBACKS
RUNNING BACKS
WIDE RECEIVERS
TIGHT ENDS
FANTASY
MATCHUPS
WEATHER
INJURIES
MARKET MOVEMENT
PARLAYS
BOOSTS
MY CARD
RESULTS
MODEL PERFORMANCE
ADMIN
SETTINGS

Use icons but always display labels. Current page must be visually obvious. Allow sidebar collapse.

3. MOBILE NAVIGATION
Bottom navigation: HOME / GAMES / PROPS / MY CARD / MORE.
MORE opens full navigation drawer.
Mobile header always shows NFL week, refresh status, alerts, and search.

4. GLOBAL TOP HEADER
Desktop: page title and NFL week on left; last refresh, next refresh, Refresh, Search, Alerts, User/Settings on right.

5. GLOBAL SEARCH
Search players, teams, games, props, sportsbooks. Separate result types visually. Player opens player deep dive; team opens team page; game opens game page.

6. GLOBAL ALERT PANEL
Right-side drawer with ALL / INJURIES / WEATHER / MARKETS / PROJECTIONS.
Each alert: time, severity, event, impact.

7. ALERT SEVERITY
INFO / WATCH / IMPORTANT / CRITICAL. Do not overuse CRITICAL.

8. GLOBAL REFRESH INDICATOR
Show data health, current source count, degraded sources, stale times, and detail view.

9. COMMAND CENTER PAGE
Default page after login. (PRODUCT OVERRIDE: implemented as /dashboard; / is Top-10 Home)

10. COMMAND CENTER HERO
Show NFL Sunday, week, date, games, props analyzed, qualified edges, injury flags, weather flags, market moves.

11. COMMAND CENTER PRIMARY CARDS
Eight cards: BEST OVER / BEST UNDER / BEST TD / BEST TEAM TOTAL / BEST QB MATCHUP / BEST RB MATCHUP / BEST GAME ENVIRONMENT / BIGGEST WARNING.
Each shows player/team, market, projection, line, confidence, status icons. Click for deeper analysis.

12. CRITICAL NEWS STRIP
Horizontal feed of only decision-relevant NFL news: ruled out, expected active, snap limits, roof changes, wind changes, OL inactives, etc.

13. WHAT CHANGED SECTION
Large component showing time, player/game, change, previous value, new value, impact, and reason.
Filters: ALL / INJURY / PROJECTION / MARKET / WEATHER / LINEUP.

14. SUNDAY SCOREBOARD STRIP
Every game in horizontal strip with away/home, kickoff, spread, total, weather, environment score. Filters ALL / 1 PM / 4 PM / SNF.

15. TOP OPPORTUNITIES
Rank, Player, Market, Book Line, Model, Edge, Probability, EV, Confidence, Health, Weather, Why.

16. TOP VOLUME
Projected opportunities, recent opportunities, role stability, confidence. Volume Stability: LOW / MEDIUM / HIGH / ELITE.

17. TOUCHDOWN LEADERS
Rank, Player, TD Probability, Book Odds, Implied Probability, Edge, Team Total, Goal-Line Role, Confidence.

18. HOME WEATHER
Only meaningful weather. If none: NO MATERIAL WEATHER ISSUES. Show wind, gusts, severity and market impacts.

19. HOME INJURIES
Only materially relevant injuries. Show player, status, position, importance and downstream model impact.

20. GAME ENVIRONMENT RANKINGS
Top games by market total, model total, expected plays, passing/rushing/TD environments, weather, overall score.

21. BEST OVERS / UNDERS
Split panel desktop; tabs mobile. Top five each.

22. COMMAND CENTER PARLAY PREVIEW
Best Conservative / Balanced / Aggressive with legs, combined probability, odds, fair odds, correlation grade, risk.

23. MY CARD PREVIEW
Watching / Ready / Placed kept separate.

24. GAMES PAGE
Filters ALL / EARLY / LATE / SNF.

25. GAME CARD
Away/home, spread, total, model spread/total, weather, injury count, environment score, best prop, best TD, team-total angle, primary risk.

26. GAME CARD EXPANSION
Projected plays/pass/rush, scripts, top player projections, injuries, weather, market movement.

27. INDIVIDUAL GAME PAGE
Team logos, matchup, kickoff, stadium, spread, total, implied totals, model totals, environment, weather.

28. GAME SUMMARY CARDS
GAME ENVIRONMENT / PASSING ENVIRONMENT / RUSHING ENVIRONMENT / TD ENVIRONMENT, each 0–100.

29. GAME SCRIPT
Probability visualization for each team leading vs close game, with projection impacts.

30. KEY FACTORS
Positive vs negative factors.

31. GAME PLAYER TABLE
ALL / QB / RB / WR / TE with Player, Usage, Yards, Receptions, TD Probability, Fantasy, Top Prop, Confidence.

32. GAME BEST BETS
BEST OVERS / BEST UNDERS / TDs / TEAM TOTAL / PARLAYS.

33. GAME MARKET MOVEMENT
Opening/current game total, team totals and important player props.

34. PROPS PAGE
Filters: Position, Player, Team, Opponent, Game, Kickoff, Market, O/U, Sportsbook, Confidence, Min Probability, Min EV, Min Edge, Health, Weather, Favorites.

35. PROP TABLE
Rank, Player, Pos, Game, Market, Book, Line, Odds, Model, Median, Difference, Model Probability, Implied Probability, EV, Confidence, Health, Weather, Movement, Why.
Sortable, customizable, sticky header.

36. PROP ROW EXPANSION
Floor, Median, Mean, Ceiling, recent results, usage, market movement, inputs, reasons, risks, alternate lines, book comparison, Add to My Card.

37. PROP QUICK ACTIONS
STAR / ADD TO CARD / WATCH / OPEN PLAYER / OPEN GAME / COMPARE BOOKS / WHY.

38. QUARTERBACK PAGE
Top cards: Highest Passing Projection / Highest Passing TD / Best Matchup / Best Rushing QB / Largest Market Edge.

39. QB TABLE
Rank, QB, Opponent, Attempts, Completions, Pass Yards, Pass TD, INT Probability, Rush Yards, Rush TD %, Fantasy, Matchup, OL Grade, Weather, Health, Confidence.

40. QB DETAIL DRAWER
SUMMARY / PROPS / MATCHUP / GAME LOG / MARKET, plus Why, Risks, Injury, OL, Weather.

41. RB PAGE
Top cards: Highest Rush Projection / Carry Projection / TD Probability / Safest Workload / Best Matchup.

42. RB TABLE
Rank, RB, Opponent, Carries, Rush Yards, Targets, Receptions, Receiving Yards, Scrimmage Yards, Goal-Line Share, TD %, 2+ TD %, Snap %, Matchup, Confidence.

43. RB ROLE BADGES
WORKHORSE / LEAD BACK / COMMITTEE / PASS-DOWN BACK / GOAL-LINE BACK / ROLE UNCERTAIN.

44. WR PAGE
Top cards: Highest Yard Projection / Target Projection / Reception Projection / TD Probability / Best Coverage Matchup.

45. WR TABLE
Rank, WR, Opponent, Targets, Receptions, Receiving Yards, Air Yards, Target Share, First Read %, Red Zone %, TD %, 100+ %, Coverage Grade, Health, Confidence.

46. WR MATCHUP DRAWER
Coverage type, CB matchup, slot/outside, man/zone grades, deep-ball matchup, explosive opportunity, safety help, defensive injuries.

47. TE PAGE
Rank, TE, Opponent, Routes, Targets, Receptions, Yards, Red Zone Targets, TD %, Coverage Matchup, Fantasy, Confidence.

48. TOUCHDOWN CENTER
Hero top TD candidate. Tabs ANYTIME / FIRST TD / 2+ TD / QB RUSH TD.

49. TD TABLE
Rank, Player, Pos, Opponent, Book Odds, Implied %, Model TD %, Probability Edge, Team Total, Red Zone Share, Inside 10, Inside 5, End Zone Targets, Goal-Line Role, Confidence.

50. TD EXPANSION
Expected TDs, red-zone trend, last-five opportunities, team TD projection, opponent red-zone defense, scripts, Why, Risks.

51. TEAM TOTALS
Best Over / Best Under / Highest Model Total / Largest Disagreement.

52. TEAM TOTAL TABLE
Rank, Team, Opponent, Market Total, Model Total, Difference, Over %, Under %, Odds, Environment, Weather, Offensive Health, Defensive Health, Confidence.

53. TEAM TOTAL DETAIL
Projected TDs, FGs, possessions, red-zone trips, pass/rush projection, script, injuries, weather.

54. GAME TOTALS
Game, Market Total, Model Total, Difference, Over %, Under %, Expected Plays, Pace, Explosive Grade, Weather, Health, Confidence.

55. FANTASY
OVERALL / QB / RB / WR / TE / FLEX. Rank, Player, Consensus, Model, High, Low, Spread, Opponent, Matchup, Health, Confidence.

56. FANTASY DISAGREEMENT
HIGH DISAGREEMENT badge with source differences.

57. MATCHUPS
QB / RB / WR / TE / OL-DL.

58. MATCHUP BOARD
BEST MATCHUPS and WORST MATCHUPS with player, opponent, score, reasons, health, environment.

59. MATCHUP DEEP DIVE
Break overall score into coverage, volume, environment, weather, injury context, etc.

60. WEATHER PAGE
Meaningful Weather Games first, then All Outdoor Games.

61. WEATHER CARD
Game, stadium, temp, wind, gust, rain, snow, humidity, field, severity, market impacts.

62. WEATHER TIMELINE
Kickoff / Q2 / halftime / Q3 / Q4 when supported.

63. INJURIES PAGE
Filters TEAM / POSITION / STATUS / IMPACT / GAME.

64. INJURY TABLE
Player, Team, Position, Status, Injury, Practice Trend, Expected Availability, Snap Concern, Model Impact, Last Update.

65. INJURY IMPACT
Show downstream target/carry/projection changes without implying false precision.

66. MARKET MOVEMENT
Top cards: Largest Line Move / Odds Move / Most Active Market / Largest Reverse Move.

67. MARKET TABLE
Player/Game, Market, Open Line, Current Line, Move, Open Odds, Current Odds, Price Change, Books Moving, Market Heat, Last Change.

68. MARKET TIMELINE
Chronological line/price movement and projection movement when available.

69. PARLAY CENTER
Controls: Same Game / Cross Game / TD / Conservative / Balanced / Aggressive / Legs / Sportsbook / Boost.

70. PARLAY OUTPUT
Title, Risk, Legs, Book Odds, Fair Odds, Estimated Probability, Correlation Score, EV, Confidence.

71. PARLAY LEGS
Player, Market, Line, Individual Probability, Correlation Impact, Confidence.

72. PARLAY SCRIPT
WHY THESE LEGS FIT and HOW THIS PARLAY LOSES.

73. CORRELATION VISUAL
Strong Positive / Positive / Neutral / Negative / Strong Negative.

74. BOOST PAGE
Sportsbook, Boost %, Max Bet, Min/Max Odds, Min Legs, Eligible Markets, Expiration.

75. BOOST RESULTS
Best Use / Second / Third. Bet, Normal Odds, Boosted Odds, Model Probability, Normal EV, Boosted EV, EV Gain, Risk.

76. MY CARD
WATCHING / READY / PLACED / SETTLED.

77. MY CARD BET
Player, Market, Line, Odds, Projection, Probability, EV, Confidence, Added Time, Current Line, Movement, Status.

78. MY CARD CHANGE WARNING
Warn when line/projection materially changes.

79. BET ENTRY
Sportsbook, Line, Odds, Stake Units, Boost, Parlay Group, Timestamp. Dollars not required.

80. RESULTS
Record, Units Won/Lost, ROI, CLV, Average Probability Edge.

81. RESULTS FILTERS
Week, Season, Market, Position, Confidence, Sportsbook, Straight/Parlay, O/U.

82. RESULTS TABLE
Bet, Line Taken, Closing Line, CLV, Odds, Units, Result, Actual, Model Projection, Confidence.

83. MODEL PERFORMANCE
Overall Accuracy, ROI, CLV, Best Market, Worst Market, Best Confidence Tier.

84. PERFORMANCE CHARTS
Separate charts for probability accuracy, ROI by market, CLV, projection error by position and market.

85. CALIBRATION
Predicted probability vs actual win rate in buckets 50–55, 55–60, 60–65, 65–70, 70+.

86. PLAYER PROFILE
Photo if available, Name, Team, Position, Opponent, Health, Current Projection, Fantasy Rank, Overall Grade.

87. PLAYER TABS
OVERVIEW / PROPS / USAGE / MATCHUPS / GAME LOG / MARKET HISTORY / MODEL HISTORY.

88. PLAYER OVERVIEW
Projected Yards, Receptions/Carries, TD Probability, Fantasy, Floor, Median, Ceiling, Volatility.

89. PLAYER USAGE
Recent targets, carries, snaps, routes, red-zone usage with metric selector.

90. PLAYER PROP HISTORY
Week, Opponent, Market Line, Projection, Actual, Result, Closing Line, CLV.

91. TEAM PAGE
Team, Opponent, Implied Total, Model Total, Injury Count, Environment.

92. TEAM TABS
OVERVIEW / OFFENSE / DEFENSE / PACE / RED ZONE / INJURIES / PLAYERS / MARKETS.

93. ADMIN
Data Sources, Model Weights, Thresholds, Sportsbooks, Automation, Alerts, Feature Flags, Data Health.

94. MODEL WEIGHTS
Recent Usage, Season Usage, Opponent Matchup, Vegas, Fantasy Consensus, Weather, Injuries, Game Script. Validate totals/ranges.

95. THRESHOLDS
Minimum edge, probability, EV, weather alert, market move, projection change.

96. SUNDAY ROUTINE STATUS
Show each scheduled job, status, timestamp and safe RUN NOW controls.

97. DATA HEALTH
Source, Status, Last Successful Pull, Records, Latency, Errors, Freshness.

98. MOBILE COMMAND CENTER ORDER
Critical Alerts / Top 5 Opportunities / My Card / TDs / Injuries / Weather / Games / Best Overs / Best Unders / Team Totals / Parlays.

99. MOBILE PLAYER CARD
Player, position/team, opponent, market/line, model, probability, confidence, health, weather, WHY, ADD.

100. MOBILE SWIPES
Optional Add-to-Card and Dismiss gestures; buttons must always remain.

101. TABLE BEHAVIOR
Desktop: sticky headers/columns, sorting, visibility settings, saved filters, virtualization/pagination.
Mobile: cards when practical.

102. MOBILE FILTER DRAWER
Position, Game, Market, Book, Confidence, Edge, Health, Weather, Apply, Clear.

103. STANDARD BADGES
HEALTHY / QUESTIONABLE / LIMITED / OUT / DOME / WIND / RAIN / SNOW / ROLE CHANGE / LINE MOVE / STEAM / HIGH EDGE / HIGH VOLATILITY / LOW SAMPLE / SOURCE CONFLICT / STALE DATA.

104. CONFIDENCE
A+ / A / A- / B+ / B / B- / C / PASS, optionally numeric detail.

105. EDGE DISPLAY
Clearly label yard edge, probability edge and EV separately.

106. TOOLTIPS
Plain-English definitions for CLV, EV, Market Heat, Environment Score, Role Stability, Projection Spread, etc.

107. WHY STANDARD
Every recommendation gets WHY drawer: Model Case / Supporting Factors / Risk Factors / Market Context / Data Quality.

108. DATA QUALITY
HIGH / MEDIUM / LOW with reasons such as current sources, stale weather, projection disagreement, injury uncertainty.

109. VISUAL PRIORITY
Largest visual emphasis: projection, line, probability, confidence, status.

110. EMPTY STATES
Never manufacture plays. Show NO PLAYS CURRENTLY MEET YOUR FILTERS and useful next actions.

111. LOADING
Use skeletons, never fake production sample data.

112. ERRORS
Clearly show unavailable source, last valid time, Retry, cached option.

113. CACHED DATA
May remain visible but always marked stale with timestamp.

114. URL STATE
Use query parameters for bookmarkable filters.

115. SAVED VIEWS
Examples: My Sunday WR Overs / Top TDs / 1 PM High Confidence / Late Games / Unders Only.

116. QUICK FILTERS
A/A+ ONLY / HEALTHY ONLY / NO WEATHER RISK / 1 PM / 4 PM / TDs / OVERS / UNDERS / TOP EDGE / TOP EV.

117. FAVORITES
Star players without changing model ranking.

118. GAME WINDOW SWITCHER
ALL / EARLY / LATE / SNF globally where logical.

119. FINAL CARD MODE
Hide research clutter. Show My Card, top recommendations, critical alerts, last-minute changes.

120. LIVE SUNDAY MODE
UPCOMING / LIVE / FINAL. Active/completed games should not dominate pregame research.

121. LOCKED BET SNAPSHOT
At placement store projection, line, odds, confidence, weather, injury state. Never overwrite historical context.

122. PLAYER COMPARISON
Compare 2–4 players by projection, line, probability, usage, matchup, TD probability, health, weather, confidence.

123. PROP COMPARISON
Same player across receptions, yards, alt yards, TD, etc., with probability and EV.

124. GAME COMPARISON
Optional later feature.

125. COMMAND PALETTE
CMD/CTRL+K for search, props, My Card, refresh, TD center, alerts.

126. NOTIFICATION CENTER
Only projection/health/market/weather/availability/bet-status information.

127. MY CARD NEGATIVE ALERT
Warn when selected edge disappears and explain why.

128. MY CARD POSITIVE ALERT
Alert when edge improves and explain why.

129. SUNDAY TIMELINE
Configurable initial slate, major refresh, pregame, inactive, late-game and SNF refresh milestones.

130. REUSABLE DESIGN COMPONENTS
PlayerCard, GameCard, PropRow, PropCard, ProjectionBadge, ConfidenceBadge, HealthBadge, WeatherBadge, MarketMovementBadge, EdgeBadge, EVBadge, TDCard, ParlayCard, AlertRow, ChangeRow, StatTile, RankingTable, WhyDrawer, FilterDrawer.

131. CONSISTENCY
Same health/weather/confidence definitions, icons, labels and underlying states everywhere.

132. PERFORMANCE
Summary data first; deep data on expansion. Avoid loading massive historical data unnecessarily.

133. COMMAND CENTER LOAD PRIORITY
Critical alerts, games, opportunities, injuries, weather before historical modules.

134. ACCESSIBILITY
Keyboard navigation, screen-reader labels, contrast, focus states, non-color indicators.

135. NO VISUAL NOISE
No casino effects, flashing, confetti, excessive animation or unnecessary gradients.

136. SUNDAY MORNING USER JOURNEY
Open app → critical changes → injuries → weather → opportunities → TDs → team totals → positional projections → My Card → Why → parlay → boost → finalize.

137. BEFORE 1 PM
Switch EARLY → alerts → inactives → early props → totals → TDs → My Card → Final Card.

138. AROUND LATE WINDOW
Switch LATE → refresh late injuries/weather/markets → reassess My Card and parlays.

139. SUNDAY NIGHT
Switch SNF → game-centric workspace with all props, TDs, totals, boost and parlays.

140. FINAL UI RULE
Every component should help answer: What changed? What matters? Who projects best? Where is value? What is risky? Why? What should I investigate next?

PRIMARY ROUTES
/dashboard
/games
/games/[game-id]
/props
/quarterbacks
/running-backs
/wide-receivers
/tight-ends
/touchdowns
/team-totals
/game-totals
/fantasy
/matchups
/weather
/injuries
/markets
/parlays
/boosts
/my-card
/results
/model-performance
/players/[player-id]
/teams/[team-id]
/admin
/settings

BUILD PRIORITY
Phase 1: Global shell, Sidebar, Header, Command Center, Games, Player pages, Basic mobile.
Phase 2: Props, QB, RB, WR, TE, Injuries, Weather.
Phase 3: TD, Team Totals, Game Totals, Matchups, Fantasy.
Phase 4: Markets, My Card, Alerts, Change Tracking.
Phase 5: Parlays, Boosts, Final Card.
Phase 6: Results, Model Performance, Admin, Advanced Settings.

FINAL INSTRUCTION TO UI AGENT
Do not build routes as isolated pages. Build one connected research workspace.

A player clicked anywhere should resolve to the same player context. A game clicked anywhere should resolve to the same game context. Health, weather, confidence, projections, market movement and explanations must use consistent shared components and definitions.

Highest-priority information throughout:
1. Availability
2. Projection
3. Market price
4. Probability
5. Edge
6. Confidence
7. Matchup
8. Weather
9. Market movement
10. Explanation

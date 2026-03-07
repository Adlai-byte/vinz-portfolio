# Code Breaker Game — Design

## Overview

A dedicated `/game` page with a terminal-styled Mastermind game. The player guesses a 4-color code from 6 possible colors, with classic feedback (`X correct, Y misplaced`), unlimited attempts, and an `ACCESS GRANTED` animation + stats on success.

## Page Structure

- **Route:** `/game`
- **Nav link:** Add "Game" to the navbar
- **Layout:** Terminal window centered on page (reuses existing title bar pattern with colored dots + `vinz@dev ~ % ./code-breaker`)

## Game Flow

```
1. Terminal shows intro text:
   > Initializing code_breaker v1.0...
   > A secret 4-color code has been generated.
   > Crack the code. You have unlimited attempts.
   > Available: red green blue yellow purple orange

2. Player selects 4 colors by clicking color buttons below the terminal

3. Player hits "$ crack" to submit guess

4. Terminal appends a line:
   [attempt 01]  R G B Y  ->  2 correct, 1 misplaced

5. Repeat until all 4 correct

6. Win screen:
   > ACCESS GRANTED
   > Code cracked in 5 attempts (1m 23s)
   > [$ play_again]
```

## Components

| Component | Purpose |
|-----------|---------|
| `src/app/game/page.tsx` | Page wrapper with Navbar |
| `src/components/CodeBreaker.tsx` | All game logic + UI |

## Color Palette

6 colors using bright accent style:
- Red `#ff5f57`, Green `#28c840`, Blue `#3b82f6`, Yellow `#febc2e`, Purple `#a855f7`, Orange `#f97316`

## Input Area (below terminal output)

- 4 "slots" showing selected colors (or empty circles)
- 6 color buttons to pick from
- Click a color -> fills next empty slot
- Click a filled slot -> removes it
- `$ crack` button to submit (disabled until 4 selected)
- `$ reset` button to clear current selection

## Terminal Output

- Auto-scrolls to bottom (same pattern as TerminalWindow.tsx)
- Each guess is a line: `[attempt XX]  colored-dots  ->  2 correct, 1 misplaced`
- `0 correct, 0 misplaced` displayed in dimmed text
- Win line in green: `ACCESS GRANTED`
- Stats line: `Code cracked in X attempts (Xm Xs)`

## No new dependencies needed — React + Tailwind only.

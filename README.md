# Striver Calendar

A frontend-only monthly planning calendar built with React and Vite.

The app focuses on a visual, interactive calendar experience with month-themed styling, drag-to-select event creation, local persistence, month-wise notes, and quick export to Google Calendar.

## Tech Stack

- React 19
- Vite
- date-fns for date logic and formatting
- react-icons for iconography
- localStorage and sessionStorage for client-side persistence

## Core Features

### 1) Monthly Calendar View

- Displays one month at a time.
- Weekday header is always shown.
- Date body is fixed to a 7 x 6 matrix (42 date cells).
- Leading empty cells align day 1 to the correct weekday.
- Trailing empty cells fill the remainder of the matrix.

Why this choice:
- A fixed matrix prevents layout jump between months and keeps event placement visually stable.

### 2) Year Boundary Navigation Guard

- Navigation is restricted to the current year.
- Going back before January shows a boundary screen with Happy New Year and current year.
- Going forward after December shows Happy New Year and next year.

Why this choice:
- Keeps the product focused on near-term planning and avoids unbounded timeline complexity.

### 3) Drag-to-Select Event Creation

- Users drag across day cells to create a date range.
- On drag end, an event modal opens.
- Event title is optional; fallback title is generated if empty.

Why this choice:
- Range selection is faster for multi-day plans than opening a form for each individual date.

### 4) Event Modal and Notes Integration

- Event modal accepts:
	- title
	- optional note
- If note is provided, it is also written into monthly notes storage and synced to notes panel.

Why this choice:
- Reduces duplicate user input by connecting event and notes workflows.

### 5) Event Persistence (localStorage)

- Events are persisted using localStorage key calendar-events.
- Dates are serialized to ISO and hydrated back to Date objects on load.
- Invalid persisted records are filtered out.

Why this choice:
- Frontend-only persistence without backend dependencies, while keeping date operations safe.

### 6) Monthly Notes Panel

- Notes are grouped by month key in yyyy-MM format.
- Notes can be created and deleted.
- Notes persist via localStorage key monthly-notes.
- Event creation dispatches a custom event monthly-notes-updated to sync notes panel.

Why this choice:
- Month-scoped notes keep context relevant and easy to scan.
- Event-driven sync avoids tight coupling between components.

### 7) Hover Event Preview

- Hovering event lines shows a floating preview dialog with:
	- event title
	- start and end dates

Why this choice:
- Improves readability in dense days without requiring a click for basic details.

### 8) Add Existing Event to Google Calendar

- Clicking an event line opens an event-options modal.
- Users can open a prefilled Google Calendar create URL.
- Date range is mapped as all-day with end date + 1 day (Google all-day convention).

Why this choice:
- Provides interoperability with a common external calendar tool with minimal friction.

### 9) Month-Aware Theme Surface

- Calendar provider surface background color changes by active month.
- The color is scoped to calendar surface, not full page background.

Why this choice:
- Preserves visual personality while avoiding global page color side effects.

### 10) Session-Persistent Active Month

- Last visited month is stored in sessionStorage key currentMonthVisited.
- Refresh within same session restores month.
- Closing session clears this state naturally.

Why this choice:
- Better UX continuity during refreshes while honoring session-level scope.

### 11) Hero Section by Month

- Header image changes according to current month index.
- Month and year are prominently displayed.

Why this choice:
- Gives seasonal context and visual variation through the year.

### 12) Reusable UI Components

- Event modal, notes modal, Google-calendar modal are separate components.
- Gooey animated button component is reused across action buttons.

Why this choice:
- Improves maintainability and style consistency.

### 13) Responsive Layout

- Main calendar + notes stack vertically on smaller screens.
- Width adapts for tablet/mobile breakpoints.

Why this choice:
- Keeps interaction usable on constrained screens.

## Architecture Overview

### State Ownership

- CalendarContext owns currentDate and session persistence logic.
- CalendarContent owns interaction-heavy transient state:
	- drag range
	- event modal open state
	- hover preview state
	- selected event for Google export
- MonthlyNotes owns notes CRUD state and month filtering.

### Data Model

Event:
- id
- title
- start (Date)
- end (Date)

Note:
- id
- content
- dates (string array)
- monthKey (yyyy-MM)

## Storage Keys

- calendar-events: persisted event list
- monthly-notes: persisted notes list
- currentMonthVisited: session-level active month

## Scripts

- npm run dev: start development server
- npm run build: production build
- npm run preview: preview production build
- npm run lint: run ESLint

## Design and UX Decisions Summary

- Fixed 7 x 6 matrix for stable layout.
- Context-based currentDate to avoid prop drilling.
- Local and session storage to stay fully frontend.
- Modular modal components for separation of concerns.
- Interop action for Google Calendar export.
- Month-scoped theming for stronger visual identity.

## Known Improvement Areas

- Navigation controls currently include custom hit-area elements that can be further polished for accessibility semantics and focus visuals.
- Additional unit/component tests can improve confidence for date-grid edge cases and persistence hydration.
- Animation hooks for month transitions can be expanded once a final motion direction and behavior are locked.

## Project Goal

Build a practical monthly planner that is:
- fast to use
- visually distinctive
- maintainable as a pure frontend application
- easy to extend with richer interactions later

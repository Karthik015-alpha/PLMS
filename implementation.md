# Implementation Notes

## What was checked

The main app modules were reviewed against the project flow defined in [CLAUDE.md](CLAUDE.md):

`UI -> Hooks -> Services -> Supabase`

## Module review

- Dashboard: aligned with the current architecture.
- Subjects: aligned.
- Topics: aligned.
- Notes: aligned.
- Planner: aligned.
- Analytics: aligned.
- Settings: aligned.
- Study Desk: needs a change.

## Verified gap

The Study Desk page previously performed inline `fetch()` calls inside [app/(protected)/study-desk/page.tsx](app/(protected)/study-desk/page.tsx), including direct requests to `/api/topics` and `/api/notes`. That broke the shared hook-driven flow used elsewhere in the app.

## What should change

1. Move Study Desk data loading into reusable hooks, ideally by extending the existing topics and notes hooks or creating a dedicated Study Desk hook.
2. Keep the page component focused on rendering and filter state only.
3. Preserve the current API route and service layers so the flow stays consistent:
   `UI -> Hooks -> API Routes -> Services -> Supabase`
4. Avoid direct `fetch()` calls from the page except where there is a narrowly justified mutation path.

## Recommended next step

Refactored: Study Desk now consumes [hooks/use-study-desk.ts](hooks/use-study-desk.ts) instead of assembling its own topic and note fetch logic in the page component.
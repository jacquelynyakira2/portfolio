Bear → macOS Notes Reskin Plan

Goal
- Match macOS Notes UI visually while keeping Bear functionality and data (`~/configs/bear`) unchanged.

Constraints
- No logic changes; UI-only edits in `src/components/apps/Bear.tsx` and `src/styles/bear.css`.
- Keep Dock integration and app open/close behavior.
- Respect dark/light modes; prioritize Apple Notes visual language.

References
- Apple Notes UI screenshots
- Sheel-ui/apple-notes-frontend for cues: https://github.com/Sheel-ui/apple-notes-frontend.git

Deliverables
- Updated `Bear.tsx` layout/classes (three panes)
- Content pane toolbar (presentational)
- Revised `bear.css` for typography, lists, code, tables, selection

Steps
1) Sidebar
   - Light sidebar surface (light/dark variants)
   - Compact rows, rounded hover/active; subtle separators
2) Notes List (Middlebar)
   - Section label; row with title + meta + excerpt
   - Selected row with warm yellow tint
3) Content Pane
   - Toolbar icons; date line; improved markdown spacing/colors
4) CSS
   - SF-like font stack fallback; list/blockquote/code/table in dark mode
   - Utility: `.line-clamp-2`
5) QA
   - Switch sections/notes; links open in new tab; theme check

Tasks
- [ ] Sidebar reskin
- [ ] Middle list reskin
- [ ] Content toolbar + markdown styling
- [ ] CSS overhaul
- [ ] Verify functionality



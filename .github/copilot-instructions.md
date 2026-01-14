# AI Coding Agent Instructions for project42cardviewer

## Project Overview
**project42cardviewer** is a React-based card viewer application built with Vite, TypeScript, and plain CSS. It's deployed to GitHub Pages and designed to display and manage card collections with a clean, responsive interface.

## Tech Stack & Build System
- **Framework**: React 18.2+ with TypeScript 5.1+
- **Build Tool**: Vite 5.0+ (faster development server and optimized production builds)
- **Styling**: Plain CSS (no CSS-in-JS framework)
- **Deployment**: GitHub Pages via `gh-pages` package

### Critical Commands
```bash
npm run dev          # Start Vite dev server (hot module reload enabled)
npm run build        # Production build to /dist directory
npm run preview      # Preview production build locally
npm run deploy       # Deploy dist/ to gh-pages branch
```

## Project Structure (Target State)
The feature branch `feature/card-viewer-starter` contains the scaffolded setup. Expected structure after full development:
```
src/
  components/
    CardList.tsx     # Grid/list display of cards
    CardDetail.tsx   # Detailed view for single card
    PrintView.tsx    # Print layout (9 cards per A4)
  pages/            # Page-level components (if routing added)
  styles/
    CardList.css
    CardDetail.css
    PrintView.css    # A4 print layout (3x3 grid)
    global.css       # CSS variables, responsive breakpoints
  types/
    Card.ts          # Card interface definition
  hooks/
    useCardStorage.ts # Local storage management
  utils/
    cardStorage.ts    # LocalStorage API wrapper
  App.tsx           # Main app component, routes between views
  main.tsx          # React entry point
public/             # Static assets
.github/
  copilot-instructions.md  # This file
vite.config.ts      # Vite configuration
tsconfig.json       # TypeScript configuration
```

## Data Model

### Card Interface
```typescript
interface Card {
  id: string;                    // UUID
  name: string;                  // Card name
  group: string;                 // Category/group (e.g., "Fighter", "Mage")
  stats: {
    analyseren: number;          // 1-10
    ontwerpen: number;           // 1-10
    integratie: number;          // 1-10
    samenwerken: number;         // 1-10
    realiseren: number;          // 1-10
    testen: number;              // 1-10
    verantwoording: number;      // 1-10
    zelfontwikkeling: number;    // 1-10
  };
  flavorText: string;           // Card description/flavor text
}
```

### Local Storage Strategy
- **Key**: `project42_cards` (JSON stringified array of Card objects)
- **Initialization**: If not present, start with empty array; load sample data from `src/data/sample-cards.json` for demo
- **No persistence library**: Use native `localStorage` API directly via `useCardStorage` hook
- **Data validation**: Validate card structure on load; silently fall back to empty if corrupted

## Architecture & Patterns

### Component Design
- **Functional components with hooks**: All React components use functional component pattern
- **State management**: Use `useCardStorage` hook for card data (wraps localStorage), local state for UI (filters, detail view)
- **View modes**: Three main views managed by top-level App.tsx routing or conditional rendering:
  - **CardList**: Clickable grid/list of all cards
  - **CardDetail**: Full details of selected card (format TBD)
  - **PrintView**: 3x3 grid (9 cards) optimized for A4 paper, `@media print` hiding nav

### Styling Approach
- **Mobile-first responsive design**: Start with mobile, use `@media (min-width: ...)` for desktop layouts
- **CSS variables for theming**: Define card dimensions, colors, spacing at root in `global.css`
- **Print CSS**: In `PrintView.css`, use `@media print` rules to:
  - Set page size to A4 (210mm × 297mm)
  - 3x3 card grid with exact sizing (e.g., 63mm × 89mm cards, standard trading card size)
  - Remove margins, set zero padding on cards
  - Hide navigation/UI controls
- **No CSS framework**: All layouts use CSS Grid/Flexbox

### TypeScript Convention
- Define all types in `src/types/Card.ts` (card-related) and component prop interfaces at top of component files
- Use `Record<string, number>` or typed object for the stats dictionary if not explicit; prefer explicit typing
- Avoid `any` types; use union types for view modes

## Integration Points
- **GitHub Pages deployment**: The `homepage` field in `package.json` is critical for routing (`https://Jaapapa.github.io/project42cardviewer`). Vite must be configured to match this base URL in `vite.config.ts`
- **Local storage**: No backend API; all card data persists in browser localStorage
- **Print workflow**: Users print directly from PrintView via browser print dialog (Ctrl+P / Cmd+P); CSS handles page layout

## Development Workflow
1. **Feature branches**: Create branches from `feature/card-viewer-starter` for new features
2. **Testing**: When tests are added, follow React Testing Library patterns (no current test setup)
3. **Build verification**: Always run `npm run build` before pushing to verify production build succeeds
4. **Deployment**: `npm run deploy` pushes the built dist/ to gh-pages; use cautiously on main branch

## Known Constraints & Future Considerations

### Card Detail Visual Format
**ASCII-art / 80's Computer Terminal Style** with the following layout (top to bottom):

```
┌─────────────────────────────────────┐
│ [Card Name] | [Group]              │
├─────────────────────────────────────┤
│                                     │
│     [Space for Graphic/Image]       │
│                                     │
├─────────────────────────────────────┤
│ Analyseren    ████████░░ 8/10       │
│ Ontwerpen     ███████░░░ 7/10       │
│ Integratie    ██████░░░░ 6/10       │
│ Samenwerken   █████░░░░░ 5/10       │
│ Realiseren    ████░░░░░░ 4/10       │
│ Testen        ███░░░░░░░ 3/10       │
│ Verantwoording██░░░░░░░░ 2/10       │
│ Zelfontwikkeling█░░░░░░░░ 1/10      │
├─────────────────────────────────────┤
│ "Card flavor text appears here in a│
│  framed box with ASCII borders"     │
└─────────────────────────────────────┘
```

**Implementation notes:**
- Use box-drawing characters (┌─┐│└┘├┤┬┴┼) for ASCII borders
- Stats display with filled (█) and empty (░) blocks for visual bar representation
- Consider using `<pre>` or monospace font (e.g., `font-family: 'Courier New', monospace`)
- Color scheme: retro terminal colors (e.g., green/amber text on dark background, or monochrome)
- Card dimensions should fit standard trading card size (~63mm × 89mm) or responsive web card

### Additional Notes
- **CSS-only styling**: If design complexity grows significantly, consider adding PostCSS or CSS Modules, but document the decision
- **State management**: Currently minimal; if Redux/Zustand becomes necessary, align on architecture early
- **Browser support**: Default to modern browsers (ES2020+) as per Vite defaults

## Documentation & Questions
- Refer to [Vite docs](https://vitejs.dev/) for build configuration questions
- Component library or design system decisions should be discussed and documented before implementation

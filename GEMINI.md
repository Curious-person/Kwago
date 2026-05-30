# Kwago: Minimalist Collector's Journal & Shop

Kwago is a clean, high-performance platform combining a content-first blog for collectors with a minimalist shop for action figures and statues.

## Tech Stack

- **Framework**: Next.js 16 (App Router) / React 19 (Experimental/Preview environment)
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (`@supabase/ssr`)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Components**: shadcn/ui (base-nova style), Base UI
- **Content**: MDX (`next-mdx-remote`)

## Domain Model

- **Blog Posts**: Educational and community content for collectors (e.g., authenticity guides, maintenance).
- **Products**: High-end collectibles (Marvel Legends, Weta Workshop statues), supporting both 'New' and 'Used' conditions.

## Design Philosophy ("Clarity over Complexity")

- **Typography**: Inter/Geist font family.
- **Color Palette**: Zinc-based (zinc-900 for headings, zinc-500 for body). Primary accent is #0066FF.
- **Shadows**: **Strictly zero shadows.** Use flat backgrounds and subtle borders for separation.
- **Shapes**: Pill-shaped (rounded-full) buttons and inputs.
- **Spacing**: 8px grid system with generous white space.

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`:
  - `ui/`: Atomic components (Button, Input, Badge).
  - `layout/`: Structural components (Navbar, Footer, Newsletter).
  - `blog/`: Domain components (PostCard, HeroPost, CategoryFilter).
- `lib/`:
  - `supabase.ts`: Supabase client configuration.
  - `store.ts`: Zustand store for global application state.
  - `utils.ts`: Utility functions.
- `types/`: TypeScript interfaces and definitions.

## Key Commands

- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Start**: `npm run start`
- **Lint**: `npm run lint`

## Development Guidelines

- **Modern React/Next.js**: This project uses Next.js 16 and React 19. Be cautious with legacy patterns and refer to the latest documentation (or `node_modules/next/dist/docs/`).
- **Styling**: Always use Tailwind CSS 4 utility classes. Adhere to the "Zero Shadows" rule.
- **Data Fetching**: Use Supabase. Server Components are preferred for data fetching where possible.
- **State**: Use Zustand (`lib/store.ts`) for cross-component UI state (e.g., search status, active filters).
- **Icons**: Use `lucide-react`.

## Important Files

- `DESIGN.md`: Detailed design specifications.
- `AGENTS.md`: Important warnings about the experimental Next.js version.
- `seed_data.sql`: Database schema and initial data.

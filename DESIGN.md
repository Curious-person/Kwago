# Design Documentation: Minimalist Journal

This project implements a clean, high-performance, content-first blog platform inspired by modern minimalist design.

## Design Philosophy

The UI follows a **"Clarity over Complexity"** approach:

- **Typography**: Uses the Inter font family (via Geist) with generous tracking and line-height for readability.
- **Color Palette**:
  - `Primary`: #0066FF (Blue) used for accents, links, and primary actions.
  - `Background`: #FFFFFF (White) with subtle #F9FAFB for sectional contrast.
  - `Text`: High contrast zinc-900 for headings, zinc-500 for body text.
- **Spacing**: Follows an 8px grid system with large gutters to provide visual "breathing room."
- **Components**: Rounded-full (pill-shaped) buttons and inputs to soften the layout.
  - **Modals**: Modal containers must use `rounded-3xl` with generous padding (`p-8`). Button rows within modals should have `mt-8`, use `flex gap-4 w-full`, and contain `rounded-full` buttons.
- **Shadows**: Primarily **zero shadows**. However, interactive buttons use a **solid 3D block shadow** (cartoon style) to provide depth and interaction feedback without breaking the minimalist aesthetic. Note: Modal buttons like Cancel/Delete specifically drop the shadow for a flatter look.
- **Animations**:
  - **Scroll Reveal**: Elements use a "fade-in-up" entrance animation as they enter the viewport to create a dynamic reading experience.
  - **Inertial Scrolling**: Pages implement a momentum-based smooth scroll (via Lenis) for a premium, high-end feel with a "gradual stop" deceleration.

---

## Component Folder Structure

```text
components/
├── ui/         # Base atomic components (Button, Input, Badge)
├── layout/     # Structural components (Navbar, Footer, Newsletter)
└── blog/       # Domain-specific components (PostCard, HeroPost, CategoryFilter)
```

## Usage Guide

### UI Components

#### `Button`

Versatile button component supporting various states.

```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="md">Subscribe</Button>
<Button variant="outline">Load More</Button>
```

#### `Badge`

Used for featured tags or category labels.

```tsx
import { Badge } from '@/components/ui/Badge';

<Badge variant="featured">Featured</Badge>
<Badge variant="category">Technology</Badge>
```

### Blog Components

#### `PostCard`

A responsive card for displaying article previews in a grid.

```tsx
<PostCard
  title="The Future of Calm UI"
  excerpt="..."
  category="Technology"
  date="Oct 19, 2024"
  image="/path-to-image.jpg"
/>
```

#### `HeroPost`

The primary featured article component with a split layout.

---

## Implementation Details

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Images**: Next.js `next/image` for optimized loading and layout stability.
- **Responsive Design**: All components and pages MUST be strictly mobile-responsive. Follow a mobile-first approach for all styling (designing for mobile base classes first, then scaling up with Tailwind's `sm:`, `md:`, `lg:` prefixes).

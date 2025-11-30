# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 16 application with React 19, TypeScript, Tailwind CSS v4, and shadcn/ui components. Uses the App Router architecture with React Server Components (RSC) enabled.

## Development Commands

```bash
# Development server (http://localhost:3000)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Linting
pnpm lint
```

## Tech Stack & Key Dependencies

- **Next.js 16.0.5** with App Router
- **React 19.2.0** with React Compiler enabled (`babel-plugin-react-compiler`)
- **TypeScript 5** with strict mode
- **Tailwind CSS v4** (latest major version)
- **shadcn/ui** components (New York style)
- **Radix UI** primitives via `@radix-ui/react-slot`
- **class-variance-authority** for component variant management
- **lucide-react** for icons

## Architecture

### React Compiler

This project has the React Compiler enabled (`reactCompiler: true` in next.config.ts). The compiler automatically optimizes React components by memoizing render output and reducing re-renders. Avoid manual `useMemo`, `useCallback`, and `React.memo` unless necessary, as the compiler handles most optimization automatically.

### File Structure

```
app/                    # Next.js App Router pages and layouts
  layout.tsx           # Root layout with Geist fonts and global styles
  page.tsx             # Home page
  globals.css          # Tailwind v4 CSS with custom theme variables
components/ui/         # shadcn/ui components
lib/
  utils.ts            # Utility functions (cn for className merging)
public/               # Static assets
```

### Path Aliases

The project uses `@/*` path aliases configured in tsconfig.json:
- `@/components` → `./components`
- `@/lib` → `./lib`
- `@/utils` → `./lib/utils`
- `@/ui` → `./components/ui`
- `@/hooks` → `./hooks`

Always use these aliases for imports instead of relative paths.

### Component Patterns

**shadcn/ui Integration**: This project uses shadcn/ui with the "New York" style variant. Components are installed into `components/ui/` and use:
- `class-variance-authority` (cva) for variant management
- `@radix-ui/react-slot` for polymorphic component composition
- `cn()` utility from `lib/utils.ts` for className merging

When adding new shadcn/ui components, maintain consistency with existing patterns:
```tsx
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
```

**Component Composition**: Use the `asChild` pattern (via Radix Slot) for flexible component composition. See `components/ui/button.tsx` for reference implementation.

### Styling System

**Tailwind CSS v4**: This project uses the latest Tailwind v4 with significant differences from v3:
- Uses `@import "tailwindcss"` instead of separate base/components/utilities imports
- Theme configuration via `@theme inline` in globals.css
- Custom color system using CSS variables and OKLCH color space
- Dark mode via custom variant: `@custom-variant dark (&:is(.dark *))`

**Color System**: All colors use OKLCH format for perceptually uniform colors. Theme colors are defined as CSS variables in `:root` and `.dark` selectors. The design system includes:
- Semantic color tokens (background, foreground, primary, secondary, etc.)
- Chart colors (chart-1 through chart-5)
- Sidebar-specific colors
- Border radius tokens (sm, md, lg, xl)

**Animations**: Uses `tw-animate-css` for enhanced animation utilities.

### Font Configuration

Uses Geist and Geist Mono fonts from `next/font/google`:
- Applied via CSS variables (`--font-geist-sans`, `--font-geist-mono`)
- Configured in `app/layout.tsx`
- Available in Tailwind as `font-sans` and `font-mono`

## Important Conventions

1. **TypeScript Strict Mode**: Project uses strict TypeScript. All new code must be fully typed.

2. **Component Naming**: Use PascalCase for component files and exports.

3. **Styling**: Prefer Tailwind utility classes over custom CSS. Use the `cn()` utility to merge className strings.

4. **Dark Mode**: Implemented via class-based dark mode with `.dark` class on root element. Use `dark:` variant for dark mode styles.

5. **Server vs Client Components**: Default to Server Components (no 'use client'). Only add 'use client' when using hooks, event handlers, or browser-only APIs.

6. **ESLint Configuration**: Uses flat config format (eslint.config.mjs) with Next.js recommended rules for core web vitals and TypeScript.

# Project Context & Agent Guide

This file contains essential context for AI agents (Jules, etc.) working on the `jrar-dev` project.

## 1. Project Identity

- **Name**: `jrar-dev`
- **Type**: Personal Portfolio / Developer Website
- **Aesthetic**: "Terminal" / Cyberpunk / Neo-retro. Dark mode only. High contrast.

## 2. Tech Stack

### Core

- **Framework**: [React Router 7](https://reactrouter.com/) (formerly Remix).
- **Runtime**: Cloudflare Workers (using `nodejs_compat` flag).
- **Language**: TypeScript (`v5.9+`).
- **Functional Library**: [Effect](https://effect.website/) (`v3.19+`).

### Styling

- **CSS Engine**: Tailwind CSS v4.
- **Component Primitives**: [React Aria Components](https://react-spectrum.adobe.com/react-aria/components.html).
- **Animation**: Motion (formerly Framer Motion) & `tailwindcss-animate`.
- **Icons**: `lucide-react`.

### Infrastructure (Cloudflare)

- **Deployment**: `wrangler deploy`.
- **Database**: Cloudflare D1.
  - **Binding**: `jrar_dev_db`
- **Configuration**: Defined in `wrangler.json`.

## 3. Design System & Branding

**Strict Adherence Required**:

- **Typography**: `Fragment Mono` ONLY. Do not use sans-serif fonts. Use `font-mono`.
- **Shapes**: **NO ROUNDED CORNERS**. Sharp edges only.
- **Theme**: Dark Mode ONLY. No light mode styles.

### Color System (`app/app.css`)

We use OKLCH semantic variables. Do not use raw hex codes or standard Tailwind colors (like `bg-blue-500`) unless absolutely necessary for prototyping. If there are no variables for necessary colors, create them.

**Core Tokens**:

- **App Bases**:
  - `bg-app-background` (Black)
  - `bg-app-muted` (Dark/Dim)
  - `bg-app-vivid`
  - `bg-app-accent` (Brightest)
- **Primary** (Matrix Green Hue):
  - `text-primary-background`
  - `text-primary-muted`
  - `text-primary-vivid`
  - `text-primary-accent`
- **Ruby** (Destructive/Error):
  - `text-ruby-background`
  - `text-ruby-muted`
  - `text-ruby-vivid`
  - `text-ruby-accent`

## 4. Routing & Architecture

- **Router Config**: Defined in `app/routes.ts` (React Router 7 Config-based routing).
  - Do NOT assume file-system routing logic (e.g., `_index.tsx`) unless creating files referenced in `routes.ts`.
- **Database Access**: access D1 via `context.cloudflare.env.jrar_dev_db` in loaders/actions.

## 5. Development Guidelines / Gotchas

- **Hydration**: If using random values or date-dependent rendering that mismatches server/client, use a `ClientOnly` wrapper to prevent hydration errors.
- **Effect**: Prefer using the `Effect` library wherever possible for complex logic, error handling, and async management where appropriate.
- **Terminal Components**: When creating new UI components, ensure they look like terminal interfaces (borders, monospaced text, high contrast active states).

---
name: nextjs-architecture
description: Enforces scalable Next.js App Router architecture and clean project structure
---

# Core Rules

- Use App Router structure
- Prefer Server Components by default
- Use Client Components only when needed
- Keep business logic outside UI components
- Avoid large page.tsx files
- Follow feature-based architecture
- Use TypeScript interfaces/types
- Keep reusable UI inside components/ui

# Folder Structure

Each feature/module should follow:

features/
├── components/
├── hooks/
├── services/
├── schemas/
├── types/
└── utils/

# Architecture Guidelines

- Components should focus on UI only
- API/database logic belongs in services
- Hooks should manage reusable stateful logic
- Validation schemas should be separated
- Types must be reusable
- Avoid duplicated logic

# UI Guidelines

- Use reusable components
- Keep layouts responsive
- Prefer clean spacing and readable hierarchy
- Avoid deeply nested JSX

# Performance Rules

- Avoid unnecessary client components
- Avoid unnecessary useEffect
- Prefer async server rendering when possible
- Lazy load heavy components if needed

# Code Quality

- Keep files modular
- Use meaningful naming
- Keep functions small and reusable
- Avoid hardcoded values
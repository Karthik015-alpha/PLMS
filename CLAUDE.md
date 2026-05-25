# CLAUDE.md

# PLMS - Personal Learning Management System
This file contains project-wide development rules, architecture standards, coding guidelines, and AI-assisted development instructions for Claude CLI agents.

---

# Project Overview
PLMS (Personal Learning Management System) is a portfolio-quality full-stack application designed for developers and self-learners to:

- Manage subjects
- Track topics
- Write markdown notes
- Monitor learning progress
- Plan daily study tasks
- Analyze study statistics

The system must prioritize:

- Clean architecture
- Scalability
- Maintainability
- Type safety
- Reusability
- Developer experience

---

# Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Supabase
- React Hook Form
- Zod
- shadcn/ui
- Recharts

---

# Architecture Rules

- Use feature-based architecture
- Keep components reusable
- Separate UI and business logic
- Use hooks for reusable logic
- Keep files modular
- Use async/await
- Use TypeScript everywhere
- Avoid duplicated logic
- No `any` types

---

# Folder Responsibilities

## app/
Routing, layouts, pages, API routes

## components/
Reusable UI components

## features/
Feature-specific logic

## hooks/
Reusable hooks

## services/
Supabase/database logic

## lib/
Configs, validations, constants

## utils/
Helper functions

## types/
Global TypeScript types

---

# Preferred Flow

UI
↓
Hooks
↓
Services
↓
Supabase

---

# API Rules

Use Next.js Route Handlers.

Examples:

- /api/subjects
- /api/topics
- /api/notes
- /api/planner

Rules:
- Validate using Zod
- Return typed responses
- Handle errors properly

---

# Database Tables

- public.users
- public.subjects
- public.topics
- public.notes
- public.study_plans
- public.progress

---

# UI Rules

- Responsive design mandatory
- Use Tailwind utility classes
- Keep spacing consistent
- Use reusable cards/forms/buttons
- Use loading skeletons

---

# Notes Rules

- Notes use markdown
- Support preview mode
- Notes belong to topics
- Search markdown content

---

# Progress Status

- NOT_STARTED
- IN_PROGRESS
- COMPLETED

---

# TypeScript Rules

- Strict TypeScript
- No `any`
- Use interfaces/types properly
- Keep API responses typed

---

# Naming Conventions

## Components
PascalCase

Example:
SubjectCard.tsx

## Hooks
use prefix

Example:
useSubjects.ts

## Services
feature.service.ts

Example:
notes.service.ts

---

# Supabase Rules

- Keep queries inside services
- Use RLS policies
- Never expose secret keys

---

# Claude CLI Instructions

When generating code:

- Follow existing folder structure
- Generate modular code
- Prefer reusable components
- Use modern Next.js patterns
- Keep files readable
- Avoid giant components

---

# Goal

Build a scalable and portfolio-quality PLMS app with:

- clean architecture
- reusable modules
- maintainable code
- strong TypeScript practices
# PLMS Development Guidelines

## Project

Personal Learning Management System (PLMS)

A developer-focused learning management system for tracking subjects, topics, markdown notes, progress, and study planning.

---

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Database
- Supabase Storage
- React Hook Form
- Zod
- Recharts
- shadcn/ui

---

## Core Features

- Authentication
- Dashboard
- Subjects Management
- Topics Management
- Markdown Notes
- Progress Tracking
- Daily Study Planner
- Analytics
- Search System

---

## Architecture Rules

- Use feature-based architecture
- Keep components reusable
- Separate UI and business logic
- Use hooks for reusable logic
- Use TypeScript everywhere
- Use async/await
- Use server actions where suitable
- Avoid deeply nested components
- Keep files modular and readable

---

## Folder Responsibilities

### app/
Routing and page structure

### components/
Reusable UI components

### features/
Business logic and services

### hooks/
Reusable React hooks

### lib/
Configuration and utilities

### utils/
Helper functions

### types/
Global TypeScript types

---

## UI Rules

- Responsive design mandatory
- Use Tailwind utility classes
- Maintain spacing consistency
- Use reusable cards/forms/buttons
- Keep dashboard visually clean
- Use loading skeletons where needed

---

## Notes System

- Notes use markdown format
- Support preview mode
- Notes belong to topics
- Search should include markdown content

---

## Progress Tracking

Statuses:
- Not Started
- In Progress
- Completed

Each subject should show completion percentage.

---

## Coding Rules

- No any types
- No duplicated logic
- Use proper naming conventions
- Keep components under reasonable size
- Prefer composition over large monolithic files

---

## Preferred Flow

UI
↓
Hooks
↓
Services
↓
Supabase

---

## Goal

Build a scalable and portfolio-quality PLMS application with clean architecture and maintainable code.
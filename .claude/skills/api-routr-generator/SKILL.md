---
name: api-route-generator
description: Creates clean and scalable API routes with validation and proper structure
---

# Core Rules

- Use async/await
- Always validate request input
- Use try/catch in all routes
- Return consistent JSON responses
- Use proper HTTP status codes
- Keep business logic outside route.ts
- Separate database operations into services

# API Structure

app/api/
└── feature/
    └── route.ts

Related files:

services/
schemas/
types/

# Response Format

Success Response:

{
  "success": true,
  "data": {}
}

Error Response:

{
  "success": false,
  "message": "Error message"
}

# Validation Rules

- Validate body data
- Validate params
- Validate query strings
- Reject invalid requests early

# Error Handling

- Handle all possible failures
- Never expose sensitive errors
- Use meaningful error messages
- Return correct status codes

# Best Practices

- Keep routes small
- Move reusable logic into services
- Use reusable helper functions
- Avoid duplicated API logic
- Keep APIs RESTful and predictable

# Security Rules

- Validate ownership when needed
- Never trust client input
- Sanitize inputs if required
- Protect sensitive endpoints
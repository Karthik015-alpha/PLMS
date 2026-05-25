---
name: debugging-workflow
description: Enforces systematic debugging and root-cause analysis
---

# Debugging Process

1. Reproduce the issue
2. Read the exact error carefully
3. Identify the failing layer
4. Inspect logs and stack traces
5. Verify inputs and outputs
6. Check related APIs/services
7. Verify database queries
8. Identify root cause
9. Apply minimal fix
10. Re-test after fixing

# Core Rules

- Never guess fixes
- Never patch symptoms blindly
- Never change unrelated code
- Explain root cause clearly
- Verify fixes before finalizing
- Keep fixes minimal and targeted

# Investigation Checklist

- Check console errors
- Check terminal logs
- Check API responses
- Check request payloads
- Check authentication/session state
- Check database responses
- Check environment variables
- Check async handling

# Common Problems

## Frontend
- State issues
- Hydration issues
- Infinite renders
- Missing dependencies
- Incorrect props

## Backend
- Validation failures
- Incorrect status codes
- Async issues
- API route errors
- Missing environment variables

## Database
- Wrong queries
- Foreign key failures
- Missing data
- Permission issues
- Invalid schema assumptions

# Fixing Rules

- Fix root cause only
- Preserve existing architecture
- Avoid introducing side effects
- Keep fixes maintainable
- Verify edge cases after fixing

# Final Verification

Before finishing:

- Confirm issue is resolved
- Confirm no new errors exist
- Confirm types are valid
- Confirm build passes
- Confirm expected output works
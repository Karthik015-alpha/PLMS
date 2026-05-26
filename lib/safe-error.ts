export function safeErrorMessage(err: any, fallback = 'An internal server error occurred.') {
  if (!err) return fallback;
  const raw = typeof err === 'string' ? err : (err?.message ?? String(err));

  // Patterns that likely indicate internal/DB/stack traces which should not be exposed
  const sensitivePatterns = [
    /duplicate key/i,
    /violat/i,
    /syntax error/i,
    /connection refused/i,
    /password/i,
    /permission denied/i,
    /pg_|postgres|mysql|sqlite|mariadb/i,
    /at \w+ \(/i, // stack trace like 'at Object ('
  ];

  for (const re of sensitivePatterns) {
    if (re.test(raw)) return fallback;
  }

  // If the message is short and human-friendly, return it; otherwise fallback
  if (raw.length < 200) return raw;
  return fallback;
}

export default safeErrorMessage;

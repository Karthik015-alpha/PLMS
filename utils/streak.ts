export interface StreakData {
  currentStreak: number;
  lastStudyDate: string | null;
}

/**
 * Calculates the new streak based on the current streak data and today's date.
 * If the user studied yesterday, the streak increases.
 * If the user studied today, the streak remains the same.
 * If the user missed a day or more, the streak resets to 1.
 * 
 * @param currentStreak The user's current streak count.
 * @param lastStudyDate The ISO string or Date object of the last recorded study session.
 * @param now Optional date to evaluate "today" (defaults to new Date()).
 * @returns Updated StreakData object.
 */
export function calculateNewStreak(
  currentStreak: number,
  lastStudyDate: string | Date | null,
  now: Date = new Date()
): StreakData {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  if (!lastStudyDate) {
    return {
      currentStreak: 1,
      lastStudyDate: today.toISOString(),
    };
  }

  const lastDate = new Date(lastStudyDate);
  lastDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - lastDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Already studied today, streak is unchanged
    return {
      currentStreak,
      lastStudyDate: lastDate.toISOString(),
    };
  } else if (diffDays === 1) {
    // Studied yesterday, streak increases
    return {
      currentStreak: currentStreak + 1,
      lastStudyDate: today.toISOString(),
    };
  } else {
    // Missed a day or more, streak resets
    return {
      currentStreak: 1,
      lastStudyDate: today.toISOString(),
    };
  }
}

import { useState } from "react";

/**
 * The class that restarts a one-off pulse each time `tone` changes, none before the first change.
 * Two identical keyframes alternate, so that the pulse restarts without remounting the element.
 */
export function useTonePulse(tone: string): string | undefined {
  const [seen, setSeen] = useState({ tone, changes: 0 });
  if (seen.tone !== tone) setSeen({ tone, changes: seen.changes + 1 });
  if (seen.changes === 0) return undefined;
  return seen.changes % 2 === 1 ? "cpds-pulse-a" : "cpds-pulse-b";
}

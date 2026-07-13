/**
 * Tiny browser-safe reading-time estimate.
 * Avoids the `reading-time` npm package, which pulls in Node `stream`
 * (breaks Vite browser builds → blank white page on GitHub Pages).
 */
export type ReadingTimeResult = {
  text: string;
  minutes: number;
  words: number;
};

export function readingTime(
  text: string,
  wordsPerMinute = 200,
): ReadingTimeResult {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const minutes = words / wordsPerMinute;
  const mins = Math.max(1, Math.ceil(minutes));
  return {
    text: `${mins} min read`,
    minutes,
    words,
  };
}

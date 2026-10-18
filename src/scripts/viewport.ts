// Compact = the primary window becomes the screen: phones in portrait, and
// phones in landscape whose short side cannot hold desktop windows.
// The CSS twin of this query lives in utilities.css and cv.css; keep them in step.
export const COMPACT_QUERY = '(max-width: 760px), (max-height: 520px) and (pointer: coarse)';

export const isCompact = () => matchMedia(COMPACT_QUERY).matches;

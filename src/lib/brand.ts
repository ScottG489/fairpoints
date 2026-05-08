/** Design tokens for the fair points notebook brand. */

export const TOKENS = {
  bg: "#EFE6CD",
  card: "#FBF6E5",
  ink: "#2C2418",
  inkMuted: "#7A6A52",
  inkSubtle: "#9A8A6E",
  accent: "#A07854",
  rule: "rgba(44,36,24,0.10)",
  ruleSubtle: "rgba(44,36,24,0.06)",
} as const;

export const PASTELS = [
  { name: "rose", bg: "#E5C4B5", ink: "#7C4933" },
  { name: "sage", bg: "#C0CDB1", ink: "#465536" },
  { name: "mauve", bg: "#CFC0D8", ink: "#534166" },
  { name: "peach", bg: "#EBCFAF", ink: "#7B501F" },
  { name: "sky", bg: "#BFCFD9", ink: "#3F5566" },
  { name: "butter", bg: "#E5D7AB", ink: "#705C20" },
] as const;

export type Pastel = (typeof PASTELS)[number];

/** Page-level paper background: ruled lines + aged grain over warm cream. */
export const PAPER_RULED_LINES =
  "repeating-linear-gradient(to bottom, transparent 0, transparent 27px, rgba(122,106,82,0.07) 27px, rgba(122,106,82,0.07) 28px)";

export const PAPER_AGED_GRAIN_URL = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='340' height='340'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.40  0 0 0 0 0.30  0 0 0 0 0.16  0 0 0 0.22 0'/></filter><rect width='340' height='340' filter='url(%23n)'/></svg>")`;

/** Inner-card subtle grain so cards don't feel flat against the paper. */
export const CARD_GRAIN_URL = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='1' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.42  0 0 0 0 0.32  0 0 0 0 0.18  0 0 0 0.06 0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>")`;

/** The combined-paper page background (color + ruled + grain). Apply on a wrapping element. */
export const PAGE_PAPER_STYLE: React.CSSProperties = {
  backgroundColor: TOKENS.bg,
  backgroundImage: `${PAPER_RULED_LINES}, ${PAPER_AGED_GRAIN_URL}`,
  backgroundSize: "100% 28px, 340px 340px",
};

/** Double-rule used for section separators (header bottom, house-rules y). */
export const DOUBLE_RULE = `3px double ${TOKENS.rule}`;

export const PRINCIPLES = [
  "Listen first. Ask one question before you reply.",
  "Repeat back what they said in your own words.",
  "Disagreeing is fine. Trying to win is not the point.",
  "Leave with one thing you didn't have when you arrived.",
] as const;

export const TAGLINE_LONG = "a notebook for talking";

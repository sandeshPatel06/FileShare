const ADJECTIVES = [
  "velvet", "crystal", "solar", "lunar", "amber", "cobalt", "scarlet",
  "silver", "golden", "azure", "crimson", "emerald", "violet", "neon",
  "arctic", "cosmic", "shadow", "frost", "thunder", "phantom", "stellar",
  "onyx", "jade", "coral", "ivory", "obsidian", "sapphire", "topaz",
  "swift", "bright", "quiet", "radiant", "zen", "polar", "mystic",
  "prism", "blaze", "echo", "nova", "vivid", "astral", "prime",
];

const NOUNS = [
  "ocean", "river", "forest", "canyon", "summit", "valley", "nebula",
  "comet", "horizon", "current", "cipher", "signal", "prism", "vertex",
  "anchor", "beacon", "circuit", "delta", "echo", "flux", "glyph",
  "helix", "zenith", "orbit", "pulse", "quasar", "relay", "stream",
  "spark", "crest", "oasis", "vault", "haven", "matrix", "nexus",
  "aurora", "breeze", "ridge", "spire", "grove", "glade", "solace",
];

/** Generates a readable random slug like `velvet-ocean-42` */
export function generateSlug(prefix?: string): string {
  const adj  = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num  = Math.floor(Math.random() * 900) + 100; // 100-999
  const base = `${adj}-${noun}-${num}`;
  if (prefix) {
    const cleanPrefix = prefix.toLowerCase().replace(/[^a-z0-9]/g, "");
    return cleanPrefix ? `${cleanPrefix}-${base}` : base;
  }
  return base;
}

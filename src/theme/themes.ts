export const THEME_IDS = ["ocean", "ember", "violet", "light"] as const;
export type ThemeId = (typeof THEME_IDS)[number];

const STORAGE_KEY = "portfolio-theme";

export function isThemeId(value: string): value is ThemeId {
  return (THEME_IDS as readonly string[]).includes(value);
}

export function readStoredTheme(): ThemeId {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && isThemeId(raw)) return raw;
  } catch {
    /* ignore */
  }
  return "ocean";
}

export function writeStoredTheme(theme: ThemeId) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}

/** Accent hex for Canvas / SVG — keep in sync with CSS `[data-theme]` --accentColor */
export const themeAccentHex: Record<ThemeId, string> = {
  ocean: "#5eead4",
  ember: "#fb923c",
  violet: "#c4b5fd",
  light: "#0d9488",
};

export const themeList: {
  id: ThemeId;
  label: string;
  description: string;
}[] = [
  {
    id: "ocean",
    label: "Ocean",
    description: "Teal accents on deep navy — default portfolio look.",
  },
  {
    id: "ember",
    label: "Ember",
    description: "Warm amber and rust tones for a bold, energetic feel.",
  },
  {
    id: "violet",
    label: "Violet",
    description: "Soft purple highlights on a cool dark base.",
  },
  {
    id: "light",
    label: "Daylight",
    description: "Light surfaces with teal accents for high readability.",
  },
];

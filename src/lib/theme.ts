export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const THEME_COLOR: Record<Theme, string> = {
  light: "#ffffff",
  dark: "#131019",
};

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function setTheme(theme: Theme) {
  if (theme === "dark") {
    document.documentElement.dataset.theme = "dark";
  } else {
    delete document.documentElement.dataset.theme;
  }
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // private mode — theme just won't persist
  }
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLOR[theme]);
}

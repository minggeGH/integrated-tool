import { Dark, LocalStorage } from "quasar";
import { ref } from "vue";

export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

const currentTheme = ref(THEMES.DARK);

function syncThemeDom(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.body?.setAttribute("data-theme", theme);
}

export function applyTheme(theme) {
  const nextTheme = theme === THEMES.LIGHT ? THEMES.LIGHT : THEMES.DARK;
  syncThemeDom(nextTheme);
  Dark.set(nextTheme === THEMES.DARK);
  LocalStorage.set("theme", nextTheme);
  currentTheme.value = nextTheme;
  return nextTheme;
}

export function initTheme() {
  let savedTheme = LocalStorage.getItem("theme");

  if (!savedTheme && typeof window !== "undefined") {
    savedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? THEMES.DARK
      : THEMES.LIGHT;
  }

  return applyTheme(savedTheme || THEMES.DARK);
}

export function toggleTheme(forceDark) {
  if (typeof forceDark === "boolean") {
    return applyTheme(forceDark ? THEMES.DARK : THEMES.LIGHT);
  }

  return applyTheme(currentTheme.value === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK);
}

export function isDarkTheme() {
  return currentTheme.value === THEMES.DARK;
}

export function useAppTheme() {
  return currentTheme;
}

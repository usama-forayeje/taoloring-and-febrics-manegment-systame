'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

const COOKIE_NAME = 'active_theme';
const DEFAULT_THEME = 'default';

// Helper function to get theme from cookie
function getThemeFromCookie() {
  if (typeof document === 'undefined') return DEFAULT_THEME;
  const match = document.cookie.match(new RegExp(`(^| )` + COOKIE_NAME + `=([^;]+)`));
  return match ? match[2] : DEFAULT_THEME;
}

// Helper function to set theme cookie
function setThemeCookie(theme) {
  if (typeof window === 'undefined') return;
  document.cookie = `${COOKIE_NAME}=${theme}; path=/; max-age=31536000; SameSite=Lax; ${window.location.protocol === 'https:' ? 'Secure;' : ''}`;
}

const ThemeContext = createContext({
  activeTheme: DEFAULT_THEME,
  setActiveTheme: () => {},
});

export function ActiveThemeProvider({ children, initialTheme }) {
  const [activeTheme, setActiveTheme] = useState(() => initialTheme || getThemeFromCookie());

  useEffect(() => {
    setThemeCookie(activeTheme);

    // Remove existing theme classes to avoid duplicates
    const bodyClassList = document.body.classList;
    Array.from(bodyClassList)
      .filter(className => className.startsWith('theme-'))
      .forEach(className => bodyClassList.remove(className));

    // Add new theme class
    bodyClassList.add(`theme-${activeTheme}`);
    if (activeTheme.endsWith('-scaled')) {
      bodyClassList.add('theme-scaled');
    }
  }, [activeTheme]);

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeConfig() {
  const context = useContext(ThemeContext);
  // No need for a separate error check because createContext has a default value now
  return context;
}
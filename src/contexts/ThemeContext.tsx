import React, { useState, useEffect } from "react";
import { setLanguage, getCurrentLanguage } from "@/lib/i18n";
import { ThemeContext } from "./ThemeContextBase";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<"light" | "dark" | "system">(
    "system"
  );
  const [language, setLanguageState] = useState(getCurrentLanguage());

  const applyTheme = (newTheme: "light" | "dark" | "system") => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (newTheme === "light") {
      root.classList.add("light");
    } else if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      // System theme
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.add("light");
      }
    }
  };

  const setTheme = (newTheme: "light" | "dark" | "system") => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const updateLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    setLanguageState(newLanguage);
    window.dispatchEvent(new Event("languageChange"));
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | "system"
      | null;
    if (savedTheme) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme("system");
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [theme]);

  // Listen for language changes to trigger re-renders
  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguageState(getCurrentLanguage());
    };

    window.addEventListener("languageChange", handleLanguageChange);
    return () =>
      window.removeEventListener("languageChange", handleLanguageChange);
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme, language, setTheme, updateLanguage }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

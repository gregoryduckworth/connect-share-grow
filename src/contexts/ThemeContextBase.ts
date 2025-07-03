import { createContext } from "react";

export interface ThemeContextType {
  theme: "light" | "dark" | "system";
  language: string;
  setTheme: (theme: "light" | "dark" | "system") => void;
  updateLanguage: (language: string) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

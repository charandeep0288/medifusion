import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface DarkModeContextProps {
  isDark: boolean;
  toggleDark: () => void;
}

export const DarkModeContext = createContext<DarkModeContextProps>({
  isDark: false,
  toggleDark: () => {},
});

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  const toggleDark = () => setIsDark((prev) => !prev);

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDark }}>
      {children}
    </DarkModeContext.Provider>
  );
};

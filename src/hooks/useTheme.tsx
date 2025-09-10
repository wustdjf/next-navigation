import React, { useState, useMemo } from "react";
import { createTheme } from "@mui/material";
import ThemeToggle from "@/components/ThemeToggle";

export const useTheme = () => {
  // 主题模式状态
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = window.localStorage.getItem("theme");
      if (savedTheme) {
        return savedTheme === "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // 创建Material UI主题
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  // 切换主题的回调函数
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (typeof window !== "undefined") {
      localStorage?.setItem("theme", !darkMode ? "dark" : "light");
    }
  };

  const themeNode = <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />;

  return {
    darkMode,
    theme,
    toggleTheme,
    themeNode,
  };
};

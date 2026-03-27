"use client";

import { useTheme } from "next-themes";
import { Button } from "@/app/_components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      className="w-12 h-12 rounded-full"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-6 w-6 dark:hidden" />
      <Moon className="h-6 w-6 hidden dark:block" />
    </Button>
  );
}

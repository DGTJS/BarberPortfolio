"use client";

import { useRef, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/app/_components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const hasSynced = useRef(false);

  const buttonRef = useCallback((node: HTMLButtonElement | null) => {
    if (node && !hasSynced.current) {
      hasSynced.current = true;
      setMounted(true);
    }
  }, []);

  return (
    <Button
      ref={buttonRef}
      variant="ghost"
      className="w-12 h-12 rounded-full"
      suppressHydrationWarning
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {mounted ? (
        theme === "dark" ? (
          <Moon className="h-6 w-6" />
        ) : (
          <Sun className="h-6 w-6" />
        )
      ) : (
        <Moon className="h-6 w-6" />
      )}
    </Button>
  );
}

"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import clsx from "clsx";

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-9 h-9" />; // Placeholder to avoid hydration mismatch
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={clsx(
                "p-2 rounded-full border transition-colors",
                "bg-card border-border hover:bg-neutral-200 dark:hover:bg-neutral-800",
                "text-foreground",
                className
            )}
            aria-label="Toggle Theme"
        >
            {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
}

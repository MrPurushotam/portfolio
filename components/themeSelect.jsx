"use client"
import { MonitorIcon, MoonIcon } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import React from 'react'

const ThemeSelect = () => {
    const [theme, setTheme] = useState("system");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "system";
        setTheme(savedTheme);
        applyTheme(savedTheme);
    }, []);

    const applyTheme = (selectedTheme) => {
        const root = window.document.documentElement;
        const isDark = selectedTheme === "dark" || (selectedTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

        if (isDark) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        localStorage.setItem("theme", selectedTheme);
    };
    const handleThemeChange = (selectedTheme) => {
        setTheme(selectedTheme);
        applyTheme(selectedTheme);
    };
    return (
        <div className={`w-full h-full`}>
            <div className="h-full flex items-center gap-2 rounded-3xl p-2 bg-gray-200">
                <button
                    onClick={() => handleThemeChange("light")}
                    className={`flex-1 text-center text-lg ${theme === "light" ? "font-bold text-black" : "text-gray-500"}`}
                >
                    <Sun style={{ verticalAlign: 'middle' }} />
                </button>
                <button
                    onClick={() => handleThemeChange("dark")}
                    className={`flex-1 text-center text-lg ${theme === "dark" ? "font-bold text-black" : "text-gray-500"}`}
                >
                    <MoonIcon style={{ verticalAlign: 'middle' }} />
                </button>
                <button
                    onClick={() => handleThemeChange("system")}
                    className={`flex-1 text-center text-lg ${theme === "system" ? "font-bold text-black" : "text-gray-500"}`}
                >
                    <MonitorIcon style={{ verticalAlign: 'middle' }} />
                </button>
            </div>
        </div>
    )
}

export default ThemeSelect

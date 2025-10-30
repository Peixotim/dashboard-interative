"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Wifi } from "lucide-react";
import { useTheme } from "next-themes";

interface HeaderProps {
  lastUpdate: string;
}

export function Header({ lastUpdate }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const dark = theme === "dark";
  return (
    <header className="w-full flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-7 py-2 px-2">
      <div className="flex items-center gap-4 flex-wrap">
        <h1 className="h1 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-100 dark:text-zinc-100">Dashboard Emocional</h1>
        <span className="flex items-center gap-1 px-2 py-1 rounded-md border border-zinc-600 bg-zinc-900/85 text-xs sm:text-sm text-green-400 font-semibold"><Wifi className="w-4 h-4" />Conectado</span>
      </div>
      <div className="flex items-center gap-3 mt-2 md:mt-0">
        <span className="text-zinc-400 text-xs sm:text-sm">Última atualização: <b className="text-zinc-300 font-medium">{lastUpdate}</b></span>
        <Button aria-label="Alternar tema" className="ml-1 px-1.5 h-9 w-9 border border-zinc-600 rounded-full text-zinc-400 bg-zinc-900 hover:bg-zinc-800" variant="ghost" size="icon" onClick={() => setTheme(dark ? "light" : "dark")}>
           {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
}

"use client";
import { Wifi } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

interface HeaderProps {
  lastUpdate: string;
}

export function Header({ lastUpdate }: HeaderProps) {
  return (
    <header className="w-full flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-8 py-3 px-0">
      <div className="flex items-center gap-4 flex-wrap">
        <h1 className="h1 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Dashboard Emocional</h1>
        <span className="flex items-center gap-1 px-2 py-1 rounded-md border border-zinc-600 bg-zinc-900/85 text-xs sm:text-sm text-green-400 font-semibold"><Wifi className="w-4 h-4" />Conectado</span>
      </div>
      <div className="flex items-center gap-3 mt-2 md:mt-0 ml-auto">
        <span className="text-zinc-400 text-xs sm:text-sm">Última atualização: <b className="text-zinc-300 font-medium">{lastUpdate}</b></span>
        <ModeToggle />
      </div>
    </header>
  );
}

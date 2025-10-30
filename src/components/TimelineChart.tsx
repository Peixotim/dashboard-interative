"use client";
import { useState } from "react";
import { CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import type { EmotionData } from "@/services/emotionService";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ranges = [
  { value: "30", label: "Últimos 30 pontos" },
  { value: "12", label: "Últimos 12 pontos" },
  { value: "6", label: "Últimos 6 pontos" },
];

export function TimelineChart({ data }: { data: EmotionData[] }) {
  const [range, setRange] = useState("30");
  const chartData = data.slice(-parseInt(range));

  return (
    <Card className="card-minimal rounded-2xl p-0 pt-1 shadow-sm w-full h-124 flex flex-col">
      <div className="flex items-center justify-between px-6 pt-5 pb-2">
        <div className="flex flex-col gap-1">
          <span className="h3 text-base font-semibold">Variação de Intensidade</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Em tempo real</span>
        </div>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[128px] rounded-lg py-1 text-sm border-zinc-400">
            <SelectValue placeholder="Selecione o range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-bg-0 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 shadow-md">
            {ranges.map(r => (
              <SelectItem key={r.value} value={r.value} className="rounded-lg text-sm">{r.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="px-1 sm:px-4 pb-3 flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 12, bottom: 3, right: 0, left: -2 }}>
            <defs>
              <linearGradient id="areaIntensidade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="8%" stopColor="#6366F1" stopOpacity={0.32} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke="#23232940" vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              minTickGap={18}
              tickFormatter={(t) => new Date(t).toLocaleTimeString("pt-BR", { hour12: false, hour: "2-digit", minute: "2-digit" })}
              style={{ fontSize: 12, fill: "#888" }}
            />
            <YAxis
              domain={[0, 1]}
              ticks={[0, 0.25, 0.5, 0.75, 1]}
              axisLine={false}
              tickLine={false}
              width={25}
              style={{ fontSize: 12, fill: "#6366F1" }}
            />
            <Tooltip
              content={({ payload, label }) => {
                if (!payload?.length) return null;
                const y = payload[0].value as number;
                return (
                  <div className="rounded-xl px-3 py-2 bg-zinc-900/90 dark:bg-zinc-800/95 border border-zinc-700 shadow text-xs">
                    <div className="text-zinc-300 pb-0.5">{new Date(label as string).toLocaleTimeString("pt-BR", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
                    <div className="font-bold text-[#6366F1]">{Math.round(y*100)}% intensidade</div>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="intensity"
              stroke="#6366F1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#areaIntensidade)"
              dot={false}
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

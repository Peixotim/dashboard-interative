"use client";
import { useEffect, useRef, useState } from "react";
import { generateMockEmotionData, EmotionData } from "@/services/emotionService";

export function useEmotionData() {
  const [data, setData] = useState<EmotionData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function fetchAndUpdate() {
      const novo = generateMockEmotionData();
      setData((old) => [...old.slice(-29), novo]); // máximo 30 para timeline
      setLastUpdate(new Date().toLocaleTimeString("pt-BR"));
    }
    fetchAndUpdate();
    intervalRef.current = setInterval(fetchAndUpdate, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    data,
    lastUpdate,
    loading: data.length === 0,
  };
}

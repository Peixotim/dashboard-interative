"use client";
import { useState } from "react";
// Assumindo que seus componentes estão em 'app/components/'
import { Header } from "@/components/Header";
import { EmotionCard } from "@/components/EmotionCard";
import { TimelineChart } from "@/components/TimelineChart";
import { PieChart } from "@/components/PieChart";
import { Heatmap } from "@/components/Heatmap";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { ConsentGate } from "@/components/ConsentGate";
import { WebcamCapture } from "@/components/WebcamCapture";

// 1. Importar os tipos de dados centrais
import { type EmotionAnalysis } from "@/lib/api"; 
import { type EmotionData } from "@/services/emotionService"; 

type ConsentPrefs = {
  camera: boolean;
  mic: boolean;
  bio: boolean;
  storage: boolean;
};

export default function Home() {
  const [consentPrefs, setConsentPrefs] = useState<ConsentPrefs | null>(null);
  const consented = !!consentPrefs;

  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const handleAnalysisUpdate = (data: EmotionAnalysis) => {
    if (data.dominant_emotion === "Nenhum rosto detectado") return;

   
    const dominantEmotionKey = data.dominant_emotion.toLowerCase() as keyof typeof data.emotions;
    

    const newSnapshot: EmotionData = {
      dominant: data.dominant_emotion,
      // Dividimos por 100 para normalizar para [0, 1]
      intensity: (data.emotions[dominantEmotionKey] || 0) / 100,
      scores: data.emotions,
      timestamp: new Date().toISOString(),
    };
    


    setEmotionHistory((prev) => [...prev, newSnapshot]);
    setLastUpdate(Date.now());
    if (loading) setLoading(false);
  };


  const atual = emotionHistory.at(-1);
  const scoreSums: Record<string, number> = {};
  if (emotionHistory.length > 0) {
    emotionHistory.forEach((d) => {
      Object.entries(d.scores).forEach(([emo, val]) => {
        scoreSums[emo] = (scoreSums[emo] || 0) + val / emotionHistory.length;
      });
    });
  }


  return (
    <main className="w-full min-h-screen flex flex-col bg-transparent p-2 md:p-6 xl:p-10 gap-8 font-main relative">
      {!consented && <ConsentGate onAccept={prefs => setConsentPrefs(prefs)} />}
      {consented && <>
        <Header lastUpdate={lastUpdate} />
        
        <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
            
          <div className="lg:col-span-1 flex flex-col gap-8">
            {consentPrefs?.camera && (
              <WebcamCapture 
                onAnalysisUpdate={handleAnalysisUpdate} 
                captureInterval={4000}
              />
            )}

            {loading || !atual ? (
              <div className="flex flex-col items-center justify-center gap-3 p-4 shadow-2xl shadow-indigo-900/20 rounded-3xl bg-white/10 dark:bg-zinc-900/50  dark:border-zinc-700/60 h-full min-h-[200px] backdrop-blur-sm">
                <Loader2 className="animate-spin w-8 h-8 text-zinc-500" />
                <span className="text-zinc-400 text-sm font-medium">Aguardando dados...</span>
              </div>
              // --- FIM DA ALTERAÇÃO ---
            ) : (
              <Heatmap data={emotionHistory} />
            )}
          </div>

          <div className="lg:col-span-2 flex flex-col gap-8">
            {loading || !atual ? (
              <div className="flex flex-1 h-[55vh] items-center justify-center">
                <motion.div initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .55 }} className="flex flex-col items-center gap-3">
                  <Loader2 className="animate-spin w-11 h-11 text-zinc-500" />
                  <span className="font-medium text-zinc-400 tracking-wide text-lg">Aguardando câmera...</span>
                </motion.div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="min-w-0">
                    <EmotionCard emotion={atual.dominant} intensity={atual.intensity} />
                  </div>
                  <div className="min-w-0">
                     <PieChart scoreSums={scoreSums} />
                  </div>
                </div>
             
                <div className="min-w-0 h-[400px]">
                  <TimelineChart data={emotionHistory} />
                </div>
              </>
            )}
          </div>
        </div>
      </>}
    </main>
  );
}
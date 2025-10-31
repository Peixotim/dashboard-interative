"use client";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { EmotionCard } from "@/components/EmotionCard";
import { TimelineChart } from "@/components/TimelineChart";
import { PieChart } from "@/components/PieChart";
import { Heatmap } from "@/components/Heatmap";
import { useEmotionData } from "@/hooks/useEmotionData";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { ConsentGate } from "@/components/ConsentGate";
import { WebcamCapture } from "@/components/WebcamCapture";
import { startSession, analyzeFrame } from "@/services/api";

type ConsentPrefs = {
  camera: boolean;
  mic: boolean;
  bio: boolean;
  storage: boolean;
};

export default function Home() {
  const [consentPrefs, setConsentPrefs] = useState<ConsentPrefs | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const consented = !!consentPrefs;
  const { data, lastUpdate, loading, ingest } = useEmotionData();
  const atual = data.at(-1);
  const scoreSums: Record<string, number> = {};
  data.forEach((d) => {
    Object.entries(d.scores).forEach(([emo, val]) => {
      scoreSums[emo] = (scoreSums[emo] || 0) + val / data.length;
    });
  });

  useEffect(() => {
    async function openSession() {
      if (!consented) return;
      try {
        const out = await startSession({
          device_info: { ua: navigator.userAgent },
          consent: consentPrefs,
        });
        setSessionId(out.session_uuid);
      } catch (e) {
        console.error("startSession error", e);
      }
    }
    openSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consented]);

  return (
    <main className="w-full min-h-screen flex flex-col bg-transparent p-2 md:p-6 xl:p-10 gap-8 font-main relative">
      {!consented && <ConsentGate onAccept={prefs => setConsentPrefs(prefs)} />}
      {consented && <>
        <Header lastUpdate={lastUpdate} />
        {loading || !atual ? (
          <div className="flex flex-1 h-[55vh] items-center justify-center">
            <motion.div initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .55 }} className="flex flex-col items-center gap-3">
              <Loader2 className="animate-spin w-11 h-11 text-zinc-500" />
              <span className="font-medium text-zinc-400 tracking-wide text-lg">Analisando emoções...</span>
            </motion.div>
          </div>
        ) : (
     
          <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
            

            <div className="lg:col-span-1 flex flex-col gap-8">
              {consentPrefs?.camera && (
                <WebcamCapture onCapture={async (frame) => {
                  if (!sessionId) return;
                  try {
                    const resp = await analyzeFrame({ session_uuid: sessionId, timestamp: Date.now(), frame_base64: frame });
                    if (resp?.dominant) {
                      ingest({ timestamp: Date.now(), dominant: resp.dominant, intensity: resp.intensity, scores: resp.scores });
                    }
                  } catch (e) {
                    console.warn("analyzeFrame error", e);
                  }
                }} />
              )}
             <Heatmap data={data} />
            </div>

    
            <div className="lg:col-span-2 flex flex-col gap-8">
              


              {/* Sub-grid para PieChart e Heatmap lado a lado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="min-w-0">
                  <EmotionCard emotion={atual.dominant} intensity={atual.intensity} />
                </div>
                <div className="min-w-0">
                   <PieChart scoreSums={scoreSums} />
                   
                </div>
              </div>
           
              <div className="min-w-0 h-[400px]">
                <TimelineChart data={data} />
              </div>
            </div>
          </div>
        )}
      </>}
    </main>
  );
}
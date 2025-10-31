"use client";
import { useState } from "react";
// --- INÍCIO DA CORREÇÃO ---
// 1. Importamos o tipo 'Variants' do framer-motion
import { motion, AnimatePresence, type Variants } from "framer-motion";
// --- FIM DA CORREÇÃO ---
import Link from "next/link";
import { ZapOff, Heart, EyeOff, Sparkles, RotateCcw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- INÍCIO DA CORREÇÃO ---
// 2. Adicionamos a tipagem explícita ': Variants'
const viewVariants: Variants = {
  initial: { opacity: 0, y: 20, filter: "blur(5px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 100, damping: 15 } },
  exit: { opacity: 0, y: -20, filter: "blur(5px)", transition: { duration: 0.2 } },
};
// --- FIM DA CORREÇÃO ---

export default function FeedbackPage() {
  const [view, setView] = useState<"feedback" | "thankyou">("feedback");

  function handleFeedback(reason: string) {
    console.log("Feedback do utilizador:", reason);
    setView("thankyou");
  }

  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <motion.div
        layout
        transition={{ type: "spring", damping: 20, stiffness: 150 }}
        className="relative w-[90%] max-w-lg p-4 sm:p-6 bg-white/10 dark:bg-zinc-900/50 border border-white/20 dark:border-zinc-700/60 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.3)] backdrop-blur-2xl overflow-hidden"
      >
        {/* Glow decorativo (Vermelho/Laranja) */}
        <div className="absolute inset-0 bg-gradient from-red-500/10 via-transparent to-orange-600/10 pointer-events-none" />

        <AnimatePresence mode="wait">
          
          {/* VISTA 1: Pedido de Feedback */}
          {view === "feedback" && (
            <motion.div
              key="feedback-view"
              variants={viewVariants} // Agora isto é válido
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center text-center relative z-10"
            >
              <motion.div
                animate={{ scale: [1, 0.9, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <ZapOff className="text-red-400 w-12 h-12 drop-shadow-lg" />
              </motion.div>
              
              <h2 className="text-xl sm:text-2xl font-bold mt-3 bg-gradient to-br from-red-400 to-orange-400 bg-clip-text text-transparent drop-shadow">
                A sua privacidade é a prioridade
              </h2>
              <p className="text-sm text-zinc-400 max-w-[90%] mt-2 font-medium leading-relaxed">
                Respeitamos a sua decisão. Para nos ajudar a melhorar, pode partilhar (anonimamente) o motivo da sua recusa?
              </p>

              <div className="flex flex-col gap-2 w-full mt-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start gap-3 bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white"
                  onClick={() => handleFeedback("Não me sinto confortável com a câmara")}
                >
                  <EyeOff className="w-5 h-5 text-red-400"/>
                  Não me sinto confortável com a câmara
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start gap-3 bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white"
                  onClick={() => handleFeedback("Não entendo como os meus dados são usados")}
                >
                  <Heart className="w-5 h-5 text-indigo-400"/>
                  Não entendo como os meus dados são usados
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start gap-3 bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white"
                  onClick={() => handleFeedback("Apenas a navegar")}
                >
                  <Sparkles className="w-5 h-5 text-cyan-400"/>
                  Estou apenas a navegar
                </Button>
              </div>
            </motion.div>
          )}

          {/* VISTA 2: Agradecimento */}
          {view === "thankyou" && (
            <motion.div
              key="thankyou-view"
              variants={viewVariants} // E aqui também
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center text-center relative z-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <CheckCircle className="text-emerald-400 w-12 h-12 drop-shadow-lg" />
              </motion.div>
              
              <h2 className="text-xl sm:text-2xl font-bold mt-3 bg-gradient to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow">
                Obrigado!
              </h2>
              <p className="text-sm text-zinc-400 max-w-[90%] mt-2 font-medium leading-relaxed">
                A sua opinião foi registada. O seu feedback ajuda-nos a construir uma plataforma mais transparente e segura para todos.
              </p>

              <div className="h-[156px]"></div> 
            </motion.div>
          )}

        </AnimatePresence>

        {/* Gatilho Mental / Botão de Voltar (SEMPRE VISÍVEL) */}
        <div className="w-full border-t border-white/10 mt-6 pt-6 relative z-10">
          <motion.p 
            className="text-sm font-medium text-indigo-300 mb-3 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {view === 'feedback' ? "Mudou de ideias?" : "Ainda quer experimentar?"}
          </motion.p>
          
          <Button
            asChild
            size="lg"
            className="w-full bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30
                       hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300
                       hover:scale-[1.03] active:scale-[0.98] group flex items-center gap-2"
          >
            <Link href="/">
              <RotateCcw className="h-5 w-5 transition-transform group-hover:-rotate-90" />
              Voltar e ativar a análise
            </Link>
          </Button>
        </div>
        
      </motion.div>
    </main>
  );
}
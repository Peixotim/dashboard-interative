"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Camera,
  Mic,
  Fingerprint,
  Database,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Sparkles,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const defaultPrefs = {
  camera: true,
  mic: true,
  bio: false,
  storage: false,
};

// --- FUNÇÃO DE VALIDAÇÃO (HELPER) ---
function validateStoredPrefs(stored: string | null): typeof defaultPrefs | null {
  if (!stored) return null;
  
  try { // Adicionado try/catch para a validação
    const parsed = JSON.parse(stored) as typeof defaultPrefs;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "camera" in parsed &&
      "mic" in parsed
    ) {
      return parsed;
    }
  } catch (e) {
    console.warn("Failed to parse stored consent", e);
    return null;
  }
  
  console.warn("Stored consent has unexpected shape, ignoring");
  return null;
}
// --- FIM DO HELPER ---


export function ConsentGate({ onAccept }: { onAccept: (prefs: typeof defaultPrefs) => void }) {
  
  // --- INÍCIO DA CORREÇÃO ---
  // 1. O estado inicial do modal é sempre 'false'.
  // O servidor renderiza 'false' e o cliente *também* renderiza 'false' na primeira passagem.
  const [showModal, setShowModal] = useState(false);
  // --- FIM DA CORREÇÃO ---

  const [prefs, setPrefs] = useState(defaultPrefs);
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  // --- useEffect AGORA CONTROLA TUDO ---
  useEffect(() => {
    // Este efeito só corre no CLIENTE, após a hidratação
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem("emotion_consent");
      const parsed = validateStoredPrefs(stored);
      
      if (parsed) {
        // Consentimento encontrado: notifica o 'pai' (page.tsx)
        onAccept(parsed);
        // Garante que o modal permanece escondido
        setShowModal(false); 
      } else {
        // Consentimento NÃO encontrado: agora podemos mostrar o modal
        setShowModal(true);
      }
    } catch (err) {
      console.warn("Failed to read/parse stored consent", err);
      setShowModal(true); // Mostra o modal em caso de erro
    }
  }, [onAccept]); // A dependência [onAccept] está correta
  // --- FIM DA ALTERAÇÃO do useEffect ---

  function handleAccept() {
    localStorage.setItem("emotion_consent", JSON.stringify(prefs));
    setShowModal(false);
    onAccept(prefs);
  }

  function handleRefuse() {
    localStorage.removeItem("emotion_consent");
    router.push("/feedback");
  }

  function handleToggle(k: keyof typeof defaultPrefs) {
    setPrefs((p) => ({ ...p, [k]: !p[k] }));
  }

  function acceptAll() {
    const allPrefs = { camera: true, mic: true, bio: true, storage: true };
    setPrefs(allPrefs);
    localStorage.setItem("emotion_consent", JSON.stringify(allPrefs));
    setShowModal(false);
    onAccept(allPrefs);
  }

  // --- O JSX (VISUAL) NÃO MUDOU NADA ---
  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 14, stiffness: 120 }}
            className="relative w-[90%] max-w-lg p-6 bg-white/10 dark:bg-zinc-900/50 border border-white/20 dark:border-zinc-700/60 rounded-3xl shadow-[0_0_50px_rgba(99,102,241,0.3)] backdrop-blur-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient from-indigo-500/10 via-transparent to-purple-600/10 pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex flex-col items-center text-center relative z-10">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1.05, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ShieldCheck className="text-indigo-400 w-12 h-12 drop-shadow-lg" />
                </motion.div>

                <h2
                  className="text-xl sm:text-2xl font-bold mt-3 bg-gradient to-br from-indigo-400 to-cyan-400 bg-clip-text text-transparent drop-shadow"
                >
                  Consentimento de Privacidade
                </h2>

                <p className="text-sm text-zinc-400 max-w-[90%] mt-2 font-medium leading-relaxed">
                  Precisamos do seu consentimento para aceder à câmara e, opcionalmente, armazenar dados
                  para a nossa análise emocional.
                </p>
              </div>

              <div
                className="mt-5 flex flex-col gap-3 bg-white/5 rounded-xl border border-white/10 px-4 py-4 shadow-inner relative z-10"
              >
                {[
                  { key: "camera", label: "Permitir uso da câmera", icon: <Camera className="h-5 w-5 text-indigo-400" /> },
                  { key: "mic", label: "Permitir uso do microfone", icon: <Mic className="h-5 w-5 text-cyan-400" /> },
                ].map(({ key, label, icon }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer select-none group">
                    <span>{icon}</span>
                    <input
                      type="checkbox"
                      checked={prefs[key as keyof typeof prefs]}
                      onChange={() => handleToggle(key as keyof typeof prefs)}
                      className="accent-indigo-500 w-4 h-4 transition-all duration-200 group-hover:scale-110"
                    />
                    <span className="text-sm font-medium text-zinc-200">{label}</span>
                  </label>
                ))}

                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="mt-2 flex flex-col gap-2"
                    >
                      <label className="flex items-center gap-3 cursor-pointer select-none group">
                        <Fingerprint className="h-5 w-5 text-emerald-400" />
                        <input
                          type="checkbox"
                          checked={prefs.bio}
                          onChange={() => handleToggle("bio")}
                          className="accent-emerald-400 w-4 h-4 group-hover:scale-110 transition-all"
                        />
                        <span className="text-sm font-medium text-zinc-200">Permitir análise biométrica</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer select-none group">
                        <Database className="h-5 w-5 text-violet-400" />
                        <input
                          type="checkbox"
                          checked={prefs.storage}
                          onChange={() => handleToggle("storage")}
                          className="accent-violet-400 w-4 h-4 group-hover:scale-110 transition-all"
                        />
                        <span className="text-sm font-medium text-zinc-200">
                          Permitir armazenamento seguro
                        </span>
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => setExpanded((e) => !e)}
                  className="flex items-center gap-1 text-xs text-indigo-400 mt-2 hover:text-indigo-300 transition-all"
                >
                  {expanded ? (
                    <>
                      Ocultar opções avançadas <ChevronUp className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      Ajustar preferências <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>

              <motion.div
                className="mt-6 flex flex-col sm:flex-row gap-3 z-10 items-center"
              >
                <Button
                  className="w-full sm:w-auto flex-1 bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30
                             hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300
                             hover:scale-[1.03] active:scale-[0.98] group flex items-center gap-2"
                  size="lg"
                  onClick={handleAccept}
                >
                  <CheckCircle className="h-5 w-5 transition-transform group-hover:rotate-12" />
                  Aceitar e Continuar
                </Button>
                <Button
                  className="w-full sm:w-auto bg-transparent border-2 border-indigo-400 text-indigo-300
                             hover:bg-indigo-500/20 hover:text-white hover:border-indigo-300 transition-all duration-300
                             active:scale-[0.98] group flex items-center gap-2"
                  variant="outline"
                  size="lg"
                  onClick={acceptAll}
                >
                  <Sparkles className="h-5 w-5 transition-transform group-hover:scale-125 group-hover:text-yellow-300" />
                  Aceitar Todos
                </Button>
                <Button
                  className="w-full sm:w-auto text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300
                             active:scale-[0.98] group flex items-center gap-2 px-3"
                  variant="ghost"
                  size="lg"
                  onClick={handleRefuse}
                >
                  <XCircle className="h-5 w-5" />
                  Recusar
                </Button>
              </motion.div>

              <span
                className="text-[11px] text-zinc-500 mt-4 text-center block"
              >
                Para mais detalhes, leia nossa{" "}
                <a href="/privacidade" target="_blank" className="underline text-indigo-400 hover:text-indigo-300">
                  Política de Privacidade
                </a>.
              </span>
            </motion.div>
          
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
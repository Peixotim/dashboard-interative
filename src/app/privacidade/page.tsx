"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Camera,
  Database,
  Share2,
  Lock,
  FileText,
  Mail,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button"; // Importar o seu botão

// Definição das secções para a navegação
const sections = [
  { id: "coleta", label: "1. O que Coletamos", icon: Camera },
  { id: "uso", label: "2. Como Usamos os Dados", icon: Shield },
  { id: "retencao", label: "3. Armazenamento e Retenção", icon: Database },
  { id: "partilha", label: "4. Partilha de Dados", icon: Share2 },
  { id: "seguranca", label: "5. Segurança", icon: Lock },
  { id: "direitos", label: "6. Os Seus Direitos", icon: FileText },
  { id: "contato", label: "7. Contacto", icon: Mail },
];

export default function PrivacyPage() {
  return (
    <main className="w-full min-h-screen bg-zinc-950 text-zinc-300 p-8 sm:p-12 lg:p-20">
      <div className="max-w-6xl mx-auto">
        
        {/* --- Cabeçalho da Página --- */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h1 className="text-3xl sm:text-5xl font-bold bg-linear-to-br from-indigo-400 to-cyan-400 bg-clip-text text-transparent drop-shadow">
              Política de Privacidade
            </h1>
            <p className="text-sm text-zinc-500 mt-2">
              Última atualização: 31 de Outubro de 2025
            </p>
          </div>
          <Button asChild variant="outline" className="hidden sm:flex gap-2 bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white">
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Dashboard
            </Link>
          </Button>
        </motion.div>

        {/* --- Layout de Duas Colunas --- */}
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Coluna Esquerda: Navegação Sticky */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-1/4"
          >
            <div className="sticky top-20">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4">
                Nesta Página
              </h3>
              <nav>
                <ul className="flex flex-col gap-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <Link
                        href={`#${section.id}`}
                        className="flex items-center gap-3 p-2 rounded-lg text-sm text-zinc-400 hover:text-indigo-300 hover:bg-white/5 transition-all group"
                      >
                        <section.icon className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                        {section.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </motion.aside>

          {/* Coluna Direita: Conteúdo da Política */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            // --- O design premium estilo "glass" ---
            className="w-full lg:w-3/4 bg-white/5 dark:bg-zinc-900/50 border border-white/10 dark:border-zinc-700/60 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl"
          >
            {/* --- Introdução --- */}
            <p className="text-lg text-zinc-300 leading-relaxed mb-8">
              Bem-vindo à nossa plataforma de análise emocional. A sua privacidade é a nossa maior prioridade. Esta política explica como coletamos, usamos e protegemos os seus dados pessoais. Ao usar o nosso serviço, você concorda com os termos aqui descritos.
            </p>

            {/* --- Secção 1: Coleta de Dados --- */}
            <section id="coleta" className="mb-10 pt-4">
              <h2 className="text-2xl font-bold text-zinc-100 mb-4 border-b border-zinc-700 pb-2 flex items-center gap-3">
                <Camera className="w-6 h-6 text-indigo-400" />
                1. O que Coletamos
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                Para fornecer a funcionalidade de análise em tempo real, coletamos os seguintes tipos de informação:
              </p>
              <ul className="list-disc list-inside text-zinc-400 space-y-2 pl-2 leading-relaxed">
                <li>
                  <strong className="text-zinc-200">Frames da Webcam:</strong> O seu navegador captura imagens da sua webcam a cada poucos segundos. Essas imagens são enviadas para os nossos servidores <strong className="text-zinc-200">exclusivamente para processamento</strong>.
                </li>
                <li>
                  <strong className="text-zinc-200">Dados de Análise Emocional:</strong> Os dados derivados da imagem (ex: `feliz`: 90%, `triste`: 10%). <strong className="text-red-400">Nós nunca armazenamos as imagens ou frames da sua webcam.</strong> Apenas os dados de emoção resultantes são guardados.
                </li>
                <li>
                  <strong className="text-zinc-200">Informação de Sessão:</strong> Coletamos um ID de sessão anónimo (`session_uuid`) e o seu endereço IP para estabelecer a conexão e prevenir abusos.
                </li>
              </ul>
            </section>

            {/* --- Secção 2: Uso de Dados --- */}
            <section id="uso" className="mb-10 pt-4">
              <h2 className="text-2xl font-bold text-zinc-100 mb-4 border-b border-zinc-700 pb-2 flex items-center gap-3">
                <Shield className="w-6 h-6 text-cyan-400" />
                2. Como Usamos os Dados
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                Utilizamos os dados coletados com os seguintes propósitos:
              </p>
              <ul className="list-disc list-inside text-zinc-400 space-y-2 pl-2 leading-relaxed">
                <li>
                  <strong className="text-zinc-200">Fornecer o Serviço:</strong> Para exibir o seu dashboard emocional em tempo real.
                </li>
                <li>
                  <strong className="text-zinc-200">Histórico de Sessão:</strong> Para lhe mostrar os seus gráficos e o heatmap da sua sessão atual.
                </li>
                <li>
                  <strong className="text-zinc-200">Melhoria Anónima (se consentido):</strong> Se você permitir o `armazenamento seguro` , os dados de emoção (totalmente anónimos, sem ligação ao seu IP ou sessão) podem ser usados para treinar e melhorar a precisão do nosso modelo de IA.
                </li>
              </ul>
            </section>

            {/* --- Secção 3: Armazenamento e Retenção --- */}
            <section id="retencao" className="mb-10 pt-4">
              <h2 className="text-2xl font-bold text-zinc-100 mb-4 border-b border-zinc-700 pb-2 flex items-center gap-3">
                <Database className="w-6 h-6 text-emerald-400" />
                3. Armazenamento e Retenção
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                A sua confiança é fundamental. A nossa política de retenção de dados é rigorosa:
              </p>
              <ul className="list-disc list-inside text-zinc-400 space-y-2 pl-2 leading-relaxed">
                <li>
                  <strong className="text-zinc-200">Frames da Webcam:</strong> <span className="text-red-400 font-bold">NUNCA SÃO ARMAZENADOS.</span> São processados em memória e descartados imediatamente após a análise.
                </li>
                <li>
                  <strong className="text-zinc-200">Dados de Emoção:</strong> Os dados de emoção (`session_uuid`, `dominant_emotion`, `emotions`) são armazenados na nossa base de dados PostgreSQL.
                </li>
                <li>
                  <strong className="text-zinc-200">Exclusão Automática (TTL):</strong> Todos os dados de emoção ligados à sua sessão são <strong className="text-emerald-400">automaticamente e permanentemente excluídos</strong> dos nossos servidores após 30 dias.
                </li>
              </ul>
            </section>
            
            {/* --- Secção 4: Partilha de Dados --- */}
            <section id="partilha" className="mb-10 pt-4">
              <h2 className="text-2xl font-bold text-zinc-100 mb-4 border-b border-zinc-700 pb-2 flex items-center gap-3">
                <Share2 className="w-6 h-6 text-violet-400" />
                4. Partilha de Dados
              </h2>
              <p className="text-zinc-400 leading-relaxed">
                Nós não vendemos, alugamos ou partilhamos os seus dados pessoais com terceiros para fins de marketing. A partilha só ocorre em casos muito específicos, como para cumprir uma obrigação legal.
              </p>
            </section>

            {/* --- Secção 5: Segurança --- */}
            <section id="seguranca" className="mb-10 pt-4">
              <h2 className="text-2xl font-bold text-zinc-100 mb-4 border-b border-zinc-700 pb-2 flex items-center gap-3">
                <Lock className="w-6 h-6 text-yellow-400" />
                5. Segurança
              </h2>
              <p className="text-zinc-400 leading-relaxed">
                Levamos a segurança a sério. Toda a comunicação entre o seu navegador e os nossos servidores é encriptada usando SSL (HTTPS). O acesso à base de dados é restrito e protegido.
              </p>
            </section>

            {/* --- Secção 6: Os Seus Direitos (LGPD) --- */}
            <section id="direitos" className="mb-10 pt-4">
              <h2 className="text-2xl font-bold text-zinc-100 mb-4 border-b border-zinc-700 pb-2 flex items-center gap-3">
                <FileText className="w-6 h-6 text-orange-400" />
                6. Os Seus Direitos
              </h2>
              <p className="text-zinc-400 leading-relaxed">
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem o direito de aceder, corrigir ou solicitar a exclusão dos seus dados. Visto que os dados são anónimos e excluídos automaticamente após 30 dias, o direito de exclusão é cumprido por defeito.
              </p>
            </section>

            {/* --- Secção 7: Contacto --- */}
            <section id="contato" className="pt-4">
              <h2 className="text-2xl font-bold text-zinc-100 mb-4 border-b border-zinc-700 pb-2 flex items-center gap-3">
                <Mail className="w-6 h-6 text-rose-400" />
                7. Contacto
              </h2>
              <p className="text-zinc-400 leading-relaxed">
                Se tiver alguma dúvida sobre esta Política de Privacidade, por favor, entre em contacto connosco através do email: <strong className="text-indigo-300">marceloneves@gmail.com</strong>.
              </p>
            </section>

          </motion.article>
        </div>
      </div>
    </main>
  );
}
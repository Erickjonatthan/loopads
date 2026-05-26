/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Tv, 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  FileSpreadsheet, 
  Clock, 
  Layers, 
  Upload, 
  Smartphone, 
  Users, 
  X,
  Sparkles,
  AlertCircle,
  Zap,
  MessageSquare,
  Play
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

interface LandingPageProps {
}

export default function LandingPage({}: LandingPageProps) {
  const [demoActiveIndex, setDemoActiveIndex] = useState(0);
  const [demoProgress, setDemoProgress] = useState(45);
  const [simulatedFormOpen, setSimulatedFormOpen] = useState(false);
  const [simulatedFormSuccess, setSimulatedFormSuccess] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  // Form states
  const [formEmpresa, setFormEmpresa] = useState('');
  const [formAnuncio, setFormAnuncio] = useState('');
  const [formMedia, setFormMedia] = useState('image');
  const [formDuration, setFormDuration] = useState(10);

  const demoAds = [
    {
      company: 'Academia FitLife',
      title: 'Projeto Verão 2026',
      desc: 'Matricule-se já e tenha 15% de desconto.',
      img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
      color: 'from-emerald-500/20 to-teal-500/20'
    },
    {
      company: 'Burger Supreme',
      title: 'Combo Supreme Bacon',
      desc: 'Hambúrguer 150g, muito bacon e fritas - R$34,90',
      img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop',
      color: 'from-amber-500/20 to-orange-500/20'
    },
    {
      company: 'Café Aroma Co.',
      title: 'Espresso Arábica Gourmet',
      desc: 'Grãos selecionados com torra média artesanal.',
      img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600&auto=format&fit=crop',
      color: 'from-amber-700/20 to-slate-800/20'
    }
  ];
  
  // Auto-cycle ads dynamically (LIVE SYNC mockup) for the TV Player
  useEffect(() => {
    let startTime = Date.now();
    const duration = 5000; // 5 seconds per ad
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      
      if (progress >= 100) {
        setDemoActiveIndex((prev) => (prev + 1) % demoAds.length);
        setDemoProgress(0);
        startTime = Date.now();
      } else {
        setDemoProgress(progress);
      }
    }, 50); // High smooth frequency update

    return () => clearInterval(interval);
  }, [demoActiveIndex, demoAds.length]);

  const handleSimulatedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmpresa || !formAnuncio) return;
    setSimulatedFormSuccess(true);
    setTimeout(() => {
      setSimulatedFormSuccess(false);
      setSimulatedFormOpen(false);
      // Reset
      setFormEmpresa('');
      setFormAnuncio('');
    }, 2500);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* 1. Header (Navigation & Premium branding) */}
      <header className="border-b border-slate-900/80 sticky top-0 bg-slate-950/80 backdrop-blur-md z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-2 w-[240px] shrink-0">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-white text-lg block leading-none">Loop<span className="text-emerald-400">Ads</span></span>
              <span className="text-[9px] text-slate-500 font-mono block tracking-wider leading-none uppercase whitespace-nowrap mt-1">Mídia Indoor Inteligente</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm mx-auto">
            <a href="#problema" className="text-slate-400 hover:text-white transition">Problema</a>
            <a href="#como-funciona" className="text-slate-400 hover:text-white transition">Como Funciona</a>
            <a href="#funcionalidades" className="text-slate-400 hover:text-white transition">Funcionalidades</a>
            <a href="#faq" className="text-slate-400 hover:text-white transition">FAQ</a>
          </nav>

          <div className="hidden md:block w-[240px] shrink-0">
          </div>
        </div>
      </header>

      {/* 2. Hero Section (Primeira Dobra) with Interactive Aurora Reativa */}
      <section 
        onMouseMove={handleMouseMove}
        className="relative overflow-hidden pt-12 md:pt-24 pb-20 border-b border-slate-900/60 group/hero isolate"
      >
        {/* Aurora Reativa (Reactive Mesh Gradient Background) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-10 bg-slate-950">
          <div 
            className="absolute -inset-[10px] opacity-60 transition-all duration-300 ease-out blur-[110px]"
            style={{
              background: `
                radial-gradient(circle 480px at ${mousePos.x}% ${mousePos.y}%, rgba(16, 185, 129, 0.28) 0%, rgba(52, 211, 153, 0.12) 30%, rgba(6, 95, 70, 0.03) 65%, transparent 100%),
                radial-gradient(circle 400px at ${100 - mousePos.x}% ${80 - mousePos.y}%, rgba(20, 184, 166, 0.22) 0%, rgba(13, 148, 136, 0.06) 40%, transparent 100%),
                radial-gradient(circle 550px at ${mousePos.x * 0.6 + 20}% ${mousePos.y * 0.6 + 20}%, rgba(16, 185, 129, 0.12) 0%, rgba(4, 120, 87, 0.02) 50%, transparent 100%)
              `
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="lg:col-span-7 space-y-6 text-left"
            >
              <motion.div 
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium tracking-wide"
              >
                Gestão Inteligente de Mídia Indoor
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
              >
                <span className="gradient-text">Controle Total</span> dos Anúncios nas <span className="gradient-text">Suas Telas</span>, Sem Complicação.
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-slate-400 text-base sm:text-lg max-w-xl"
              >
                Receba campanhas de anunciantes, aprove mídias com um único clique e crie filas de exibição inteligentes. Tudo em um painel administrativo seguro, feito para TVs de comércio, academias, clínicas e painéis digitais.
              </motion.p>

              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-3 pt-2"
              >
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://wa.me/5581989979429?text=Olá! Gostaria de solicitar uma demonstração do LoopAds."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-500 text-slate-950 font-bold rounded-xl text-sm hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
                  id="cta_central_demonstracao"
                >
                  Solicitar Demonstração <ArrowRight className="w-4 h-4" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="#como-funciona"
                  className="px-6 py-3 bg-slate-900/80 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 shrink-0 fill-current" /> Ver Como Funciona
                </motion.a>
              </motion.div>

              {/* Multi-metrics summary block */}
              <motion.div 
                variants={fadeInUp}
                className="grid grid-cols-3 gap-4 md:gap-6 pt-8 border-t border-slate-900/80"
              >
                <div className="flex flex-col sm:flex-row items-start gap-2.5">
                  <div className="p-1 px-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0 mt-0.5">
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-extrabold text-white">Sistema Ativo 24/7</div>
                    <div className="text-[9px] text-slate-500 font-mono tracking-wider uppercase mt-1">Disponibilidade</div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start gap-2.5">
                  <div className="p-1 px-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-extrabold text-white">Setup em Minutos</div>
                    <div className="text-[9px] text-slate-500 font-mono tracking-wider uppercase mt-1">Sintonização</div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start gap-2.5">
                  <div className="p-1 px-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0 mt-0.5">
                    <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-extrabold text-emerald-450">Multi-tela</div>
                    <div className="text-[9px] text-zinc-500 font-mono tracking-wider uppercase mt-1">Escalabilidade</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Interactive Mockup Container */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="border-flow-card p-5 rounded-2xl relative z-10 shadow-2xl shadow-black/80 bg-slate-900/40 backdrop-blur-sm border border-slate-800">
                
                {/* Simulated Screen header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">PLAYER_TV_RECEPCAO.MP4</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold font-mono">
                    LIVE SYNC
                  </span>
                </div>

                {/* Simulated Player Display Area */}
                <div className="aspect-[16/10] w-full rounded-xl overflow-hidden relative border border-slate-850 bg-slate-950 group">
                  <motion.img
                    key={demoActiveIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    src={demoAds[demoActiveIndex].img}
                    alt={demoAds[demoActiveIndex].title}
                    className="w-full h-full object-cover select-none"
                  />
                  
                  {/* Color overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

                  {/* Top Ad Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-slate-950/90 border border-slate-800 backdrop-blur-sm flex items-center gap-1.5">
                    <Tv className="w-3 h-3 text-emerald-400" />
                    <span className="text-[9px] font-bold text-white tracking-wide uppercase font-mono">
                      {demoAds[demoActiveIndex].company}
                    </span>
                  </div>

                  {/* Time indicator pill */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-slate-950/95 text-[9px] text-slate-400 font-mono flex items-center gap-1 border border-slate-800">
                    <Clock className="w-2.5 h-2.5 text-slate-500" />
                    Tempo: 15s
                  </div>

                  {/* Bottom Text */}
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {demoAds[demoActiveIndex].title}
                    </h3>
                    <p className="text-[11px] text-slate-300 mt-1 line-clamp-1">
                      {demoAds[demoActiveIndex].desc}
                    </p>
                  </div>

                  {/* Simulation progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/80">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-75 linear"
                      style={{ width: `${demoProgress}%` }}
                    />
                  </div>
                </div>

                {/* Simulated Queue Control Switches */}
                <div className="mt-4 space-y-2">
                  <span className="text-[10px] text-slate-500 font-mono block uppercase">Ordem da Fila Comercial</span>
                  
                  <div className="space-y-1.5">
                    {demoAds.map((ad, idx) => (
                      <motion.div 
                        key={idx}
                        onClick={() => {
                          setDemoActiveIndex(idx);
                          setDemoProgress(0);
                        }}
                        whileHover={{ scale: 1.015, x: 2 }}
                        whileTap={{ scale: 0.995 }}
                        className={`flex items-center gap-3 p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                          demoActiveIndex === idx 
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-white' 
                            : 'bg-slate-950/55 border-slate-800/50 hover:border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="text-xs font-mono font-bold text-slate-500">#{idx + 1}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold truncate leading-none">{ad.title}</h4>
                          <span className="text-[10px] text-slate-500 truncate block mt-0.5">{ad.company}</span>
                        </div>
                        <span className={`w-2.5 h-2.5 rounded-full ${demoActiveIndex === idx ? 'bg-emerald-400 animate-pulse' : 'bg-slate-800'}`} />
                      </motion.div>
                    ))}
                  </div>

                  {/* Demo status note */}
                  <div className="pt-2 text-[10px] text-slate-500 flex items-center gap-1 justify-center">
                    <AlertCircle className="w-3 h-3 text-slate-600" />
                    Dica: Clique em qualquer item da fila para testar a troca dinâmica de exibição da TV.
                  </div>
                </div>

              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl z-0" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. Problems and Solution Section (Segunda Dobra) */}
      <section id="problema" className="py-20 border-b border-slate-900/60 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto space-y-3 mb-16"
          >
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Desafios Reais vs Engenharia Inteligente</span>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Chega de gerenciar mídias perdidas em e-mails e pendrives.
            </h2>
            <p className="text-slate-400 text-sm">
              Esqueça a bagunça de arquivos em formatos incompatíveis, anúncios fora do prazo e telas travadas. O LoopAds automatiza o recebimento e a triagem, garantindo que apenas o conteúdo aprovado vá para o seu player.
            </p>
          </motion.div>

          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            
            {/* Box 1 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.015 }}
              className="border-flow-card p-6 rounded-2xl space-y-4 bg-slate-900/20 border border-slate-900 hover:border-emerald-500/20 hover:bg-slate-900/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 text-emerald-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Adeus retrabalho</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Importe dados de campanhas e arquivos de mídia diretamente de planilhas sincronizadas ou formulários inteligentes do Google Forms sem precisar reenviar nenhum e-mail.
              </p>
            </motion.div>

            {/* Box 2 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.015 }}
              className="border-flow-card p-6 rounded-2xl space-y-4 bg-slate-900/20 border border-slate-900 hover:border-emerald-500/20 hover:bg-slate-900/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Zero dor de cabeça</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Nossa ferramenta valida automaticamente as dimensões, codecs e tamanhos de imagens ou vídeos assim que o anunciante anexa no formulário, recusando arquivos corrompidos instantaneamente.
              </p>
            </motion.div>

            {/* Box 3 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.015 }}
              className="border-flow-card p-6 rounded-2xl space-y-4 bg-slate-900/20 border border-slate-900 hover:border-emerald-500/20 hover:bg-slate-900/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 text-emerald-400">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Exibição sem falhas</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                O Player inteligente sincroniza em milissegundos o estado com a nuvem, obedecendo à risca a fila programática, datas de vigência inicial e final e tempo exato definido em segundos.
              </p>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* 4. Steps Section (Terceira Dobra) */}
      <section id="como-funciona" className="py-20 border-b border-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto space-y-3 mb-16"
          >
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Como funciona</span>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Do envio à exibição em apenas 3 passos
            </h2>
          </motion.div>

          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 relative"
          >
            
            {/* Step 1 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -4 }}
              className="space-y-4 relative p-4 rounded-xl border border-transparent hover:border-slate-800/50 hover:bg-slate-900/10 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold font-mono text-xs">
                  01
                </span>
                <span className="h-0.5 bg-slate-800 flex-1 hidden md:block"></span>
              </div>
              <h3 className="text-lg font-extrabold text-white text-left">Recebimento de Dados</h3>
              <p className="text-slate-400 text-xs text-left leading-relaxed">
                Anunciantes usam canais integrados como formulários ou o próprio painel para sugerir títulos, tempo, vigência e arquivos de anúncio. O sistema gera uma solicitação pendente instantaneamente.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -4 }}
              className="space-y-4 relative p-4 rounded-xl border border-transparent hover:border-slate-800/50 hover:bg-slate-900/10 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold font-mono text-xs">
                  02
                </span>
                <span className="h-0.5 bg-slate-800 flex-1 hidden md:block"></span>
              </div>
              <h3 className="text-lg font-extrabold text-white text-left">Aprovação & Moderação</h3>
              <p className="text-slate-400 text-xs text-left leading-relaxed">
                O administrador avalia as campanhas no Command Center, revisando formatos e dimensões de mídias. Com um clique, aprova ou rejeita a veiculação.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -4 }}
              className="space-y-4 relative p-4 rounded-xl border border-transparent hover:border-slate-800/50 hover:bg-slate-900/10 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold font-mono text-xs">
                  03
                </span>
                <span className="w-8 hidden md:block"></span>
              </div>
              <h3 className="text-lg font-extrabold text-white text-left">Fila e Sinalização Auto</h3>
              <p className="text-slate-400 text-xs text-left leading-relaxed">
                Aprovou? O anúncio entra na fila de reprodução respeitando prioridade e ordem. Os players de TV sincronizam as mídias salvas via cache inteligente e renderizam o cronograma programado.
              </p>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* 5. Features Grid Section (Quarta Dobra) */}
      <section id="funcionalidades" className="py-20 border-b border-slate-900/60 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto space-y-3 mb-16"
          >
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Detalhamento Técnico</span>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Orquestração de Ponta a Ponta para Produtividade
            </h2>
          </motion.div>

          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            
            {/* Feat 1 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-slate-900/40 border border-slate-900 p-6 rounded-xl space-y-3 text-left hover:border-emerald-500/20 hover:bg-slate-900/60 transition-colors"
            >
              <div className="text-emerald-400">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Fila Drag & Drop Inteligente</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Reordene toda a sequência de exibição dos anúncios ativos apenas arrastando e soltando cartões estruturados. O player sincroniza a nova ordem instantaneamente.
              </p>
            </motion.div>

            {/* Feat 2 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-slate-900/40 border border-slate-900 p-6 rounded-xl space-y-3 text-left hover:border-emerald-500/20 hover:bg-slate-900/60 transition-colors"
            >
              <div className="text-emerald-400">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Integração Forms-to-Planilha</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Seu inventário se alimenta diretamente da tabela sincronizada. Carregue novas campanhas usando o botão 'Sincronizar' em segundos.
              </p>
            </motion.div>

            {/* Feat 3 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-slate-900/40 border border-slate-900 p-6 rounded-xl space-y-3 text-left hover:border-emerald-500/20 hover:bg-slate-900/60 transition-colors"
            >
              <div className="text-emerald-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Moderação com Logs Claros</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Adicione anotações na aprovação ou descreva erros na rejeição. Todos os eventos de orquestração constam no histórico de auditoria do sistema em tempo real.
              </p>
            </motion.div>

            {/* Feat 4 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-slate-900/40 border border-slate-900 p-6 rounded-xl space-y-3 text-left hover:border-emerald-500/20 hover:bg-slate-900/60 transition-colors"
            >
              <div className="text-emerald-400">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Cronometragem Precisa</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Determine a vigência exata e a duração individual de cada anúncio em segundos. O renderizador alterna as mídias perfeitamente sem congelar.
              </p>
            </motion.div>

            {/* Feat 5 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-slate-900/40 border border-slate-900 p-6 rounded-xl space-y-3 text-left hover:border-emerald-500/20 hover:bg-slate-900/60 transition-colors"
            >
              <div className="text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Segurança por Tokens e Cookies</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                O acesso do Player é protegido por token exclusivo e mídias administrativas utilizam bloqueios CSRF e cookies HttpOnly, garantindo conformidade com a LGPD.
              </p>
            </motion.div>

            {/* Feat 6 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-slate-900/40 border border-slate-900 p-6 rounded-xl space-y-3 text-left hover:border-emerald-500/20 hover:bg-slate-900/60 transition-colors"
            >
              <div className="text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Associação de Anunciantes</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Mantenha um cadastro dos responsáveis pelas empresas parceiras. Vincule múltiplos anúncios com dados cadastrais e observações administrativas.
              </p>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* 6. FAQ Section (Quinta Dobra) */}
      <section id="faq" className="py-20 border-b border-slate-900/60 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left column info with User-specified attributes */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-4 space-y-6 text-left"
            >
              <div className="space-y-2">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block">FAQ</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Perguntas Frequentes</h2>
                <h3 className="text-xl font-bold text-slate-200 mt-1">Tire suas dúvidas técnicas</h3>
                <p className="text-slate-400 text-sm leading-relaxed mt-2">
                  Especificações e respostas objetivas para os mais analíticos.
                </p>
              </div>

              {/* Formats and Sizes Badges requested by user */}
              <div className="pt-4 border-t border-slate-900/80 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {['JPG', 'PNG', 'WebP', 'MP4', 'MOV', 'WebM', 'Até 200MB'].map((pill, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold hover:bg-emerald-500/20 transition-colors"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right column - Interactive Accordion horizontally split in 3 each column */}
            <motion.div 
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="lg:col-span-8 grid md:grid-cols-2 gap-4 w-full items-start"
            >
              {/* Column 1 (First 3 questions) */}
              <div className="space-y-3">
                {[
                  {
                    idx: 0,
                    q: "Quais formatos de arquivo são suportados?",
                    a: "Suportamos de forma nativa imagens de alta qualidade como JPG, PNG e WebP, além de mídias dinâmicas em MP4, MOV e WebM para garantir transições fluidas e compatibilidade absoluta com seus players de TV."
                  },
                  {
                    idx: 1,
                    q: "Qual é o limite de tamanho de upload?",
                    a: "O limite de upload configurado por arquivo é de até 200MB. Esse tamanho otimizado garante resoluções cristalinas (até 4K) mantendo um carregamento rápido e cache inteligente na memória da TV."
                  },
                  {
                    idx: 2,
                    q: "Como funciona a integração com Google Forms?",
                    a: "A integração conecta as planilhas de respostas do formulário diretamente ao nosso dashboard. Quando o anunciante envia um arquivo ou submete informações, uma solicitação é criada automaticamente no painel."
                  }
                ].map((item) => {
                  const isOpen = openFaq === item.idx;
                  return (
                    <div 
                      key={item.idx}
                      className="border border-slate-850/80 bg-slate-900/10 hover:bg-slate-900/20 rounded-xl overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : item.idx)}
                        className="w-full py-4 px-5 flex items-center justify-between gap-4 text-left font-bold text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                      >
                        <span className="hover:text-emerald-400 transition-colors">{item.q}</span>
                        <span className={`text-xl font-light shrink-0 transition-transform duration-300 text-emerald-400 block ${isOpen ? 'rotate-45' : ''}`}>
                          +
                        </span>
                      </button>
                      
                      {isOpen && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.2 }}
                          className="px-5 pb-5 pt-1 text-slate-400 text-xs sm:text-sm border-t border-slate-900/60 leading-relaxed bg-slate-950/20"
                        >
                          {item.a}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Column 2 (Remaining 3 questions) */}
              <div className="space-y-3">
                {[
                  {
                    idx: 3,
                    q: "Posso ter múltiplos players/telas?",
                    a: "Com certeza! É possível gerenciar e orquestrar dezenas de telas remotas de forma centralizada. Você pode atribuir diferentes grades de programação ou campanhas para cada TV cadastrada."
                  },
                  {
                    idx: 4,
                    q: "É possível agendar campanhas por data e horário?",
                    a: "Sim, o controle é total. Você define as datas exatas de início e encerramento da veiculação, e o nosso renderizador cuidará de colocar ou retirar as mídias da fila automaticamente."
                  },
                  {
                    idx: 5,
                    q: "Precisa de suporte técnico para configurar?",
                    a: "Não é necessário. Qualquer Smart TV convencional, TV Box Android ou computador básico pode rodar o player. Basta carregar a URL dedicada e o sistema entra em sincronia imediata."
                  }
                ].map((item) => {
                  const isOpen = openFaq === item.idx;
                  return (
                    <div 
                      key={item.idx}
                      className="border border-slate-850/80 bg-slate-900/10 hover:bg-slate-900/20 rounded-xl overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : item.idx)}
                        className="w-full py-4 px-5 flex items-center justify-between gap-4 text-left font-bold text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                      >
                        <span className="hover:text-emerald-400 transition-colors">{item.q}</span>
                        <span className={`text-xl font-light shrink-0 transition-transform duration-300 text-emerald-400 block ${isOpen ? 'rotate-45' : ''}`}>
                          +
                        </span>
                      </button>
                      
                      {isOpen && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.2 }}
                          className="px-5 pb-5 pt-1 text-slate-400 text-xs sm:text-sm border-t border-slate-900/60 leading-relaxed bg-slate-950/20"
                        >
                          {item.a}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 7. Lower CTA Section (Sexta Dobra) */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 text-center relative overflow-hidden">
        
        {/* Decorative backdrop blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 space-y-6 relative z-10"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Pronto para revolucionar a forma como você gerencia anúncios?
          </h2>
          
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Junte-se a gestores que já estão economizando horas de trabalho com o LoopAds. Configure o player inteligente e organize sua programação de mídias agora mesmo.
          </p>

          <div className="pt-4 flex flex-col items-center gap-4">
            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              href="https://wa.me/5581989979429?text=Olá! Gostaria de falar com um especialista sobre o LoopAds."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all inline-flex items-center gap-2 shadow-lg shadow-emerald-500/15 cursor-pointer"
              id="cta_final_conversao"
            >
              <MessageSquare className="w-4 h-4 shrink-0" /> Falar com um Especialista
            </motion.a>

            <div className="flex flex-col sm:flex-row gap-x-6 gap-y-2 justify-center items-center text-xs text-slate-400 pt-2 font-medium">
              <span className="flex items-center gap-1">✓ Sem contrato de fidelidade</span>
              <span className="flex items-center gap-1">✓ Suporte dedicado</span>
              <span className="flex items-center gap-1">✓ Dados 100% seguros</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 8. Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4 text-emerald-400" />
            <span>&copy; {new Date().getFullYear()} LoopAds Inc. Todos os direitos reservados.</span>
          </div>
          
          <div className="flex gap-6 font-mono text-[10px]">
            <a href="#" className="hover:text-slate-300">Termos de Uso</a>
            <a href="#" className="hover:text-slate-300">Privacidade</a>
            <a href="#" className="hover:text-slate-400 uppercase">Ambiente Seguro</a>
          </div>
        </div>
      </footer>

      {/* Simulated Google Forms Upload/Submit Modal */}
      {simulatedFormOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between text-left">
              <div>
                <span className="text-[9px] font-mono p-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest font-semibold">
                  Google Forms Símulo
                </span>
                <h3 className="text-white text-sm font-bold mt-1.5">Enviar Nova Campanha</h3>
              </div>
              <button 
                onClick={() => setSimulatedFormOpen(false)}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            {simulatedFormSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-white font-bold text-sm">Formulário Recebido!</h4>
                <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
                  A campanha de <strong className="text-white">"{formEmpresa}"</strong> foi inserida na fila temporária da base de dados (`temp/`). 
                  Vá para o **Painel Administrativo** e clique em **"Sincronizar"** para carregar esta nova solicitação.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSimulatedSubmit} className="p-5 space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-medium">Nome da Empresa Anunciante *</label>
                  <input
                    type="text"
                    required
                    value={formEmpresa}
                    onChange={(e) => setFormEmpresa(e.target.value)}
                    placeholder="Ex: Donuts Palace, Supermercado XYZ"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-medium">Título do Anúncio / Campanha *</label>
                  <input
                    type="text"
                    required
                    value={formAnuncio}
                    onChange={(e) => setFormAnuncio(e.target.value)}
                    placeholder="Ex: Promoção de Chope, Desconto de Inverno"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-medium">Tipo de Mídia</label>
                    <select
                      value={formMedia}
                      onChange={(e) => setFormMedia(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="image">Imagem (JPG, PNG)</option>
                      <option value="video">Vídeo (MP4)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-medium">Duração (segundos)</label>
                    <input
                      type="number"
                      min="5"
                      max="60"
                      value={formDuration}
                      onChange={(e) => setFormDuration(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <span className="font-semibold text-slate-300 block">Simulação de Upload:</span>
                  <p>
                    O sistema simulará o upload seguro do arquivo <code className="text-emerald-400 font-mono">anuncio_recebido_{Math.floor(Math.random() * 900) + 100}.jpg</code> (3.2 MB) na pasta <code className="text-white">temp/</code> de forma síncrona.
                  </p>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSimulatedFormOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 rounded-lg flex items-center gap-1"
                    id="forms_modal_submit"
                  >
                    Enviar para temp <Upload className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

          </motion.div>
        </div>
      )}

    </div>
  );
}

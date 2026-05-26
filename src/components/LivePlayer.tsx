/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tv, Key, ShieldAlert, Clock, AlertTriangle, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { Ad, PlayerConfig } from '../types';

interface LivePlayerProps {
  ads: Ad[];
  playerConfig: PlayerConfig;
  onExitPlayer: () => void;
}

export default function LivePlayer({ ads, playerConfig, onExitPlayer }: LivePlayerProps) {
  
  // States
  const [enteredToken, setEnteredToken] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [tokenError, setTokenError] = useState('');
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [serverTime, setServerTime] = useState(new Date());
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  // Filter only active ads
  const activeAds = ads.filter(ad => ad.status === 'APROVADO' && ad.ativo);
  const currentAd = activeAds[currentIdx];

  // Ref to hold the current index for timers
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Server clock ticking
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setServerTime(new Date());
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Check the initial configuration/token
  useEffect(() => {
    // If the player starts, reset states
    setCurrentIdx(0);
    setProgress(0);
  }, [ads]);

  // Main ad cycle logic
  useEffect(() => {
    if (!isUnlocked || activeAds.length === 0) return;

    // Clear any previous loaders
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    setProgress(0);
    const duration = currentAd?.duracaoSegundos || playerConfig.defaultDuration;
    const intervalTickMs = 50;
    const step = (intervalTickMs / (duration * 1000)) * 1000; // Multiplied to get percentage

    let currentProgress = 0;

    intervalRef.current = setInterval(() => {
      currentProgress += (100 / (duration * (1000 / intervalTickMs)));
      setProgress(Math.min(100, currentProgress));
    }, intervalTickMs);

    timerRef.current = setTimeout(() => {
      // Advance Index
      if (playerConfig.mode === 'aleatorio') {
        const randIdx = Math.floor(Math.random() * activeAds.length);
        setCurrentIdx(randIdx);
      } else {
        setCurrentIdx(prev => (prev + 1) >= activeAds.length ? 0 : prev + 1);
      }
    }, duration * 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

  }, [currentIdx, isUnlocked, ads, playerConfig.mode]);

  const handleValidateTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTokenError('');
    if (enteredToken.trim() === playerConfig.token) {
      setIsUnlocked(true);
    } else {
      setTokenError('Assinatura do Token expirada ou inválida!');
    }
  };

  // Skip manually
  const handleSkipAd = () => {
    if (playerConfig.mode === 'aleatorio') {
      const randIdx = Math.floor(Math.random() * activeAds.length);
      setCurrentIdx(randIdx);
    } else {
      setCurrentIdx(prev => (prev + 1) >= activeAds.length ? 0 : prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-white z-50 flex flex-col font-sans select-none overflow-hidden">
      
      {!isUnlocked ? (
        
        /* Token Access gate section */
        <div className="flex-1 flex items-center justify-center p-4 bg-slate-950 relative">
          
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] text-zinc-500 font-mono tracking-widest leading-none">PLAYER_SECURE_AUTH_GATEWAY_V1</span>
          </div>

          <div className="max-w-md w-full bg-slate-900 border border-slate-850 p-6 md:p-8 rounded-2xl space-y-6 text-center shadow-2xl relative">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20">
              <Tv className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-white">Sinal de TV Protegido</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Este terminal é autenticado por chave dinâmica. Digite o código de emparelhamento configurado no Command Center para validar a sintonia comercial.
              </p>
            </div>

            <form onSubmit={handleValidateTokenSubmit} className="space-y-3.5 text-left">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-mono block">Chave de Sintonia do Player</label>
                <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-lg">
                  <Key className="absolute left-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={enteredToken}
                    onChange={(e) => { setEnteredToken(e.target.value); setTokenError(''); }}
                    placeholder="Cole o token de segurança..."
                    className="w-full bg-transparent pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none font-mono placeholder:text-slate-650"
                  />
                </div>
              </div>

              {tokenError && (
                <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] rounded leading-relaxed text-center font-semibold">
                  {tokenError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold rounded-lg text-xs transition uppercase tracking-wider"
              >
                Conectar Sintonia
              </button>
            </form>

            <div className="bg-slate-950 p-3.5 rounded border border-slate-850 text-left text-[11px] text-slate-500 leading-normal">
              <span className="font-semibold text-slate-400 block pb-1 border-b border-slate-850/60 mb-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-emerald-500" /> Dica de Sandbox:
              </span>
              O token atual cadastrado no sistema é:<br />
              <code className="text-emerald-400 font-mono block mt-1 select-all select-none p-1 bg-slate-900 border border-slate-850/60 rounded text-center">
                {playerConfig.token}
              </code>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={onExitPlayer}
                className="text-[11px] text-slate-500 hover:text-white underline"
              >
                Sair do Modo Player
              </button>
            </div>

          </div>
        </div>

      ) : activeAds.length === 0 ? (
        
        /* Empty Play signal section */
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 p-6 space-y-4 text-center">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800 text-slate-650 animate-pulse">
            <Tv className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-sm">
            <h3 className="text-lg font-bold text-white leading-tight">Canal de Transmissão Vazio</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Não existem anúncios aprovados e ativos cadastrados neste player para reprodução imediata. 
              Vá ao Command Center e aprove solicitações ou ative anúncios mutados.
            </p>
          </div>
          <button
            onClick={onExitPlayer}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 rounded-lg text-xs transition font-semibold"
          >
            Voltar ao Command Center
          </button>
        </div>

      ) : (
        
        /* Interactive Signage Slideshow layout */
        <div className="flex-1 flex flex-col bg-black relative select-none">
          
          {/* Main graphic container */}
          <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-slate-950">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentAd.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full"
              >
                {currentAd.midiaType === 'video' ? (
                  <div className="w-full h-full bg-black relative flex items-center justify-center">
                    {/* Simulated premium video player placeholder layout with streaming loop */}
                    <img 
                      src={currentAd.midiaUrl} 
                      alt="" 
                      className="w-full h-full object-cover filter brightness-95" 
                    />
                    {/* Glowing active overlays */}
                    <div className="absolute inset-0 bg-emerald-500/1 mix-blend-color-dodge pointer-events-none" />
                  </div>
                ) : (
                  <img
                    src={currentAd.midiaUrl}
                    alt={currentAd.titulo}
                    className="w-full h-full object-cover filter brightness-95"
                  />
                )}

                {/* Ambient vignette background gradienet */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />

                {/* Brand watermark badge top left */}
                <div className="absolute top-6 left-6 flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-950/90 border border-slate-800 backdrop-blur-md">
                  <div className="flex items-center justify-center w-6 h-6 rounded bg-emerald-500 text-slate-950 font-bold">
                    <Tv className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-white block font-extrabold tracking-wider leading-none">LOOP<span className="text-emerald-400">ADS</span></span>
                    <span className="text-[8px] text-zinc-500 font-mono tracking-wider leading-none block uppercase mt-0.5">{playerConfig.playerName}</span>
                  </div>
                </div>

                {/* Server synchronous Clock top right */}
                <div className="absolute top-6 right-6 flex items-center gap-4 text-right">
                  <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 backdrop-blur-md flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono uppercase leading-none block">Sinal de Rede UTC</span>
                      <span className="text-xs text-white font-mono font-bold leading-none block mt-0.5">
                        {serverTime.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Campaign information Card */}
                <div className="absolute bottom-8 left-8 right-8 max-w-2xl bg-slate-950/90 border border-slate-800 rounded-2xl p-5 md:p-6 backdrop-blur-md text-left space-y-2 shadow-2xl">
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold uppercase tracking-wider">
                      CAMPANHA ATIVA
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 bg-slate-900 text-slate-400 border border-slate-850 rounded">
                      Transmissão: {currentIdx + 1}/{activeAds.length}
                    </span>
                  </div>

                  <h2 className="text-lg md:text-xl font-extrabold text-white tracking-tight leading-tight">
                    {currentAd.titulo}
                  </h2>
                  
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed line-clamp-2">
                    {currentAd.descricao}
                  </p>

                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Vigência: {currentAd.dataInicio ? `${currentAd.dataInicio} a ${currentAd.dataFim}` : 'Contínua'}</span>
                    <span>Timing: {currentAd.duracaoSegundos}s</span>
                  </div>

                </div>

              </motion.div>
            </AnimatePresence>

            {/* Quick action controls on hovering or double-clicking screen */}
            <div className="absolute top-1/2 left-3 -translate-y-1/2 opacity-0 hover:opacity-100 focus-within:opacity-100 duration-300 flex flex-col gap-2">
              <button
                onClick={handleSkipAd}
                className="p-3 bg-slate-950/90 hover:bg-slate-900 text-white rounded-full border border-slate-800"
                title="Pular Anúncio"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Exit Player trigger on top center hover */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-60 hover:opacity-100 duration-200">
              <button
                onClick={onExitPlayer}
                className="px-3 py-1 bg-slate-900 border border-slate-800 hover:bg-black text-slate-400 hover:text-white rounded text-[10px] font-bold font-mono uppercase tracking-widest"
              >
                Sair da TV (Esc)
              </button>
            </div>

          </div>

          {/* Slices loader progress line */}
          <div className="h-1.5 bg-slate-900 relative">
            <div 
              className="h-full bg-emerald-500 transition-all duration-100 ease-linear shadow-[0_0_12px_rgba(16,185,129,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>

        </div>
      )}

    </div>
  );
}

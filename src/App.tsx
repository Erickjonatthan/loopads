/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Advertiser, Ad, PendingRequest, SpreadsheetRow, SystemLog, PlayerConfig } from './types';
import { 
  INITIAL_ADVERTISERS,
  INITIAL_ADS,
  INITIAL_PENDING_REQUESTS,
  INITIAL_SPREADSHEET_ROWS,
  INITIAL_LOGS
} from './mockData';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import LivePlayer from './components/LivePlayer';
import { Lock, Tv, ArrowLeft, Key, HelpCircle } from 'lucide-react';

export default function App() {

  // Global Context State Store
  const [advertisers, setAdvertisers] = useState<Advertiser[]>(INITIAL_ADVERTISERS);
  const [ads, setAds] = useState<Ad[]>(INITIAL_ADS);
  const [requests, setRequests] = useState<PendingRequest[]>(INITIAL_PENDING_REQUESTS);
  const [spreadsheetRows, setSpreadsheetRows] = useState<SpreadsheetRow[]>(INITIAL_SPREADSHEET_ROWS);
  const [logs, setLogs] = useState<SystemLog[]>(INITIAL_LOGS);
  const [playerConfig, setPlayerConfig] = useState<PlayerConfig>({
    defaultDuration: 15,
    mode: 'fila',
    playerName: 'TV Academia Principal',
    token: 'token_tv_principal_2026'
  });

  // App routing state
  const [activeView, setActiveView] = useState<'LANDING' | 'DASHBOARD' | 'PLAYER'>('LANDING');
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('loopads_auth') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Handle URL detection for 'admin-demo' to unlock control panel access
  useEffect(() => {
    const checkUrlForAdmin = () => {
      const url = window.location.href;
      if (url.includes('admin-demo')) {
        setActiveView('DASHBOARD');
      }
    };

    // Check immediately on mount
    checkUrlForAdmin();

    // Listen to URL change signals
    window.addEventListener('hashchange', checkUrlForAdmin);
    window.addEventListener('popstate', checkUrlForAdmin);
    return () => {
      window.removeEventListener('hashchange', checkUrlForAdmin);
      window.removeEventListener('popstate', checkUrlForAdmin);
    };
  }, []);

  // Handle escape globally to exit Player mode comfortably
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeView === 'PLAYER') {
        setActiveView('DASHBOARD');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeView]);

  // Login action handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (username === 'admin@loopads.com' && password === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('loopads_auth', 'true');
      
      // Register custom audit log
      const loginLog: SystemLog = {
        id: `log-login-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'LOGIN',
        description: 'Administrador geral conectou-se com sucesso via painel administrativo.',
        user: 'admin@loopads.com'
      };
      setLogs(prev => [loginLog, ...prev]);
    } else {
      setLoginError('Credenciais incorretas! Use o email admin@loopads.com e a senha admin.');
      
      // Register warning log
      const errorLog: SystemLog = {
        id: `log-fail-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'LOGIN_FAIL',
        description: `Tentativa falha de login com usuário: "${username || 'vazio'}".`,
        user: 'Conexão'
      };
      setLogs(prev => [errorLog, ...prev]);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('loopads_auth');
    
    const logoutLog: SystemLog = {
      id: `log-logout-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'LOGOUT',
      description: 'Sessão administrativa encerrada pelo usuário.',
      user: 'admin@loopads.com'
    };
    setLogs(prev => [logoutLog, ...prev]);
  };

  const autofillCredentials = () => {
    setUsername('admin@loopads.com');
    setPassword('admin');
    setLoginError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Main views router switches */}
      {activeView === 'LANDING' ? (
        <LandingPage />
      ) : activeView === 'DASHBOARD' ? (
        
        !isAuthenticated ? (
          
          /* Admin Login Gateway protected page (Step 1) */
          <div className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-950 relative">
            
            {/* Ambient glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-md w-full bg-slate-900 border border-slate-850 p-6 md:p-8 rounded-2xl space-y-6 shadow-2xl relative z-10 text-left">
              
              <button 
                onClick={() => {
                  setActiveView('LANDING');
                  // Clear 'admin-demo' from the URL to avoid getting locked into the dashboard
                  if (window.location.href.includes('admin-demo')) {
                    const cleanUrl = window.location.href
                      .replace(/[?&]admin-demo/g, '')
                      .replace(/admin-demo/g, '')
                      .replace(/\?$/, '');
                    window.history.replaceState({}, '', cleanUrl);
                  }
                }}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-white transition leading-none pb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar para o Site Comercial
              </button>

              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2 text-white">
                  <div className="w-8 h-8 rounded bg-emerald-500 text-slate-950 flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold">Acesso Restrito Adminis</h3>
                </div>
                <p className="text-slate-400 text-xs">
                  Acesse o painel do LoopAds para moderar mídias, sincronizar planilhas e configurar a playlist.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-mono block">E-mail Administrativo</label>
                  <input
                    type="email"
                    required
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setLoginError(''); }}
                    placeholder="admin@loopads.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    id="admin_username"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-mono block">Senha de Acesso</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                    placeholder="Sua senha secreta"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    id="admin_password"
                  />
                </div>

                {loginError && (
                  <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] rounded leading-relaxed text-center">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold rounded-lg text-xs transition uppercase tracking-wider shadow-md shadow-emerald-500/15"
                  id="admin_login_submit"
                >
                  Entrar no Centro Operacional
                </button>
              </form>

              {/* Preset credentials auto filler wrapper button */}
              <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-850/60 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sandbox Auto-Acesso:</span>
                </div>
                
                <p className="text-[10px] text-slate-500 leading-normal">
                  Como este é um ambiente de testes interativo, preparamos uma conta administrativa automática. Clique no botão abaixo para preencher as credenciais pré-configuradas.
                </p>

                <button
                  onClick={autofillCredentials}
                  className="w-full py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-[11px] text-emerald-400 hover:text-emerald-350 font-bold rounded transition"
                  id="admin_autofill_btn"
                >
                   Preencher Credenciais Padrão
                </button>
              </div>

            </div>

          </div>

        ) : (
          
          /* Loaded Dashboard administrative page */
          <AdminDashboard
            advertisers={advertisers}
            setAdvertisers={setAdvertisers}
            ads={ads}
            setAds={setAds}
            requests={requests}
            setRequests={setRequests}
            spreadsheetRows={spreadsheetRows}
            setSpreadsheetRows={setSpreadsheetRows}
            logs={logs}
            setLogs={setLogs}
            playerConfig={playerConfig}
            setPlayerConfig={setPlayerConfig}
            onLogout={handleLogout}
            onOpenPlayer={() => setActiveView('PLAYER')}
          />

        )

      ) : (
        
        /* Dedicated Signage TV Player view */
        <LivePlayer
          ads={ads}
          playerConfig={playerConfig}
          onExitPlayer={() => setActiveView('DASHBOARD')}
        />

      )}

    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Tv, 
  FileCheck, 
  ArrowUpDown, 
  Trash2, 
  FileSpreadsheet, 
  PlusCircle, 
  Check, 
  X, 
  ShieldAlert, 
  Database, 
  LogOut, 
  Lock, 
  FileText, 
  Search, 
  Sliders, 
  FolderSync, 
  Key, 
  Grid,
  Info,
  Calendar,
  AlertCircle,
  Eye,
  Settings,
  Clock,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Advertiser, Ad, PendingRequest, SystemLog, SpreadsheetRow, PlayerConfig } from '../types';
import CronScheduler from './CronScheduler';

interface AdminDashboardProps {
  advertisers: Advertiser[];
  setAdvertisers: React.Dispatch<React.SetStateAction<Advertiser[]>>;
  ads: Ad[];
  setAds: React.Dispatch<React.SetStateAction<Ad[]>>;
  requests: PendingRequest[];
  setRequests: React.Dispatch<React.SetStateAction<PendingRequest[]>>;
  spreadsheetRows: SpreadsheetRow[];
  setSpreadsheetRows: React.Dispatch<React.SetStateAction<SpreadsheetRow[]>>;
  logs: SystemLog[];
  setLogs: React.Dispatch<React.SetStateAction<SystemLog[]>>;
  playerConfig: PlayerConfig;
  setPlayerConfig: React.Dispatch<React.SetStateAction<PlayerConfig>>;
  onLogout: () => void;
  onOpenPlayer: () => void;
}

export default function AdminDashboard({
  advertisers,
  setAdvertisers,
  ads,
  setAds,
  requests,
  setRequests,
  spreadsheetRows,
  setSpreadsheetRows,
  logs,
  setLogs,
  playerConfig,
  setPlayerConfig,
  onLogout,
  onOpenPlayer
}: AdminDashboardProps) {

  // Section States
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'ads' | 'advertisers' | 'queue' | 'sheets' | 'logs' | 'settings'>('overview');

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [logFilter, setLogFilter] = useState<string>('ALL');

  // Ad Creator Form States
  const [showAdForm, setShowAdForm] = useState(false);
  const [newAdTitle, setNewAdTitle] = useState('');
  const [newAdDesc, setNewAdDesc] = useState('');
  const [newAdAdvId, setNewAdAdvId] = useState('');
  const [newAdDuration, setNewAdDuration] = useState(15);
  const [newAdCron, setNewAdCron] = useState('*/15 * * * *');
  const [newAdHumanCron, setNewAdHumanCron] = useState('A cada 15 minutos');
  const [newAdDateInicio, setNewAdDateInicio] = useState('');
  const [newAdDateFim, setNewAdDateFim] = useState('');

  // Media Validator Simulated States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFileType, setSelectedFileType] = useState<'image' | 'video'>('image');
  const [selectedFileSize, setSelectedFileSize] = useState(0); // in MB
  const [simulatedResolution, setSimulatedResolution] = useState('1920x1080');
  const [fileError, setFileError] = useState('');
  const [mediaUploadedUrl, setMediaUploadedUrl] = useState('');

  // Advertiser Form States
  const [showAdvForm, setShowAdvForm] = useState(false);
  const [newAdvEmpresa, setNewAdvEmpresa] = useState('');
  const [newAdvResponsavel, setNewAdvResponsavel] = useState('');
  const [newAdvTelefone, setNewAdvTelefone] = useState('');
  const [newAdvEmail, setNewAdvEmail] = useState('');
  const [newAdvObs, setNewAdvObs] = useState('');

  // Moderation modal / state
  const [moderationNotes, setModerationNotes] = useState<{ [key: string]: string }>({});

  // Sheet Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);

  // Logs helper trigger
  const addSystemLog = (type: SystemLog['type'], description: string) => {
    const newLog: SystemLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type,
      description,
      user: 'admin@loopads.com'
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Google Forms spreadsheet sync flow
  const handleUpdateBase = () => {
    setIsSyncing(true);
    setSyncLogs(['Iniciando importação de anúncios.xlsx...', 'Escaneando linhas sem processar...']);
    
    setTimeout(() => {
      let importedCount = 0;
      let newAdvCount = 0;

      const uncalculatedRows = spreadsheetRows.filter(r => r.processado === 'NAO');
      
      if (uncalculatedRows.length === 0) {
        setSyncLogs(prev => [...prev, 'Nenhuma linha nova encontrada na planilha.', 'Sincronização concluída com sucesso.']);
        setIsSyncing(false);
        addSystemLog('IMPORT_XLSX', 'Sincronização de anúncios realizada de anúncios.xlsx. 0 novas linhas importadas.');
        return;
      }

      // Process uncalculated rows
      const updatedRows = spreadsheetRows.map(row => {
        if (row.processado === 'NAO') {
          importedCount++;
          
          // 1. Check if Advertiser exists, if not create
          let existingAdv = advertisers.find(a => a.empresa.toLowerCase() === row.nome_empresa.toLowerCase());
          let advId = existingAdv?.id;

          if (!existingAdv) {
            newAdvCount++;
            advId = `adv-imported-${Date.now()}-${row.rowId}`;
            const newAdv: Advertiser = {
              id: advId,
              empresa: row.nome_empresa,
              responsavel: row.responsavel || 'Responsável Forms',
              telefone: row.telefone || '(11) 99999-9999',
              email: row.email || 'contato@forms.com',
              observacao: 'Importado automaticamente via Google Forms'
            };
            setAdvertisers(prev => [...prev, newAdv]);
            setSyncLogs(prev => [...prev, `Criado perfil de anunciante para "${row.nome_empresa}"`]);
          }

          // 2. Add as mock Pending Request
          const mockRequest: PendingRequest = {
            id: `req-imported-${Date.now()}-${row.rowId}`,
            anuncioTitulo: row.titulo_anuncio,
            empresa: row.nome_empresa,
            responsavel: row.responsavel || 'Forms',
            telefone: row.telefone || '',
            email: row.email || '',
            descricao: row.descricao || 'Enviado por planilha',
            duracaoSegundos: row.duracao_segundos || 15,
            origem: 'FORMS',
            nomeArquivo: row.nome_arquivo,
            status: 'PENDENTE',
            tipoMidia: row.nome_arquivo.toLowerCase().endsWith('.mp4') ? 'video' : 'image',
            midiaUrl: row.nome_arquivo.toLowerCase().endsWith('.mp4') ? 
              'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop' : 
              'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
            tamanhoArquivo: 2.5,
            resolucao: '1920x1080',
            dataCriacao: new Date().toISOString(),
            dataFormInicio: row.data_inicio,
            dataFormFim: row.data_fim
          };

          setRequests(prev => [mockRequest, ...prev]);

          return { ...row, processado: 'SIM' as const };
        }
        return row;
      });

      setSpreadsheetRows(updatedRows);
      setSyncLogs(prev => [
        ...prev, 
        `Sucesso: ${importedCount} linha(s) importada(s) de anúncios.xlsx.`,
        `${newAdvCount} novo(s) anunciante(s) criado(s).`,
        `Fila de solicitações pendentes atualizada com mídias provisórias de temp/.`
      ]);
      setIsSyncing(false);
      addSystemLog('IMPORT_XLSX', `Sincronização de planilha anúncios.xlsx realizada. ${importedCount} novas solicitações criadas.`);
    }, 1800);
  };

  // Simulated Media Upload Validator
  const handleMediaSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError('');
    if (!file) return;

    const fileType = file.type;
    const isImage = fileType.startsWith('image/');
    const isVideo = fileType.startsWith('video/');

    // Format validation
    if (!isImage && !isVideo) {
      setFileError('Formato inválido! Aceita apenas imagens (JPG, PNG, GIF, WebP) ou vídeos (MP4, MOV, WebM)');
      addSystemLog('ERROR', `Tentativa frustrada de upload de arquivo incompatível: ${file.name}`);
      return;
    }

    // Size check (Max 200MB)
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > 200) {
      setFileError(`Tamanho máximo excedido! Arquivo possui ${fileSizeInMB.toFixed(1)}MB (Limite: 200MB).`);
      addSystemLog('ERROR', `Tamanho de arquivo excedido para o arquivo: ${file.name} (${fileSizeInMB.toFixed(1)}MB)`);
      return;
    }

    // Simulated resolution calculations (random safe numbers or boundaries for test cases)
    const randRes = Math.random() < 0.15 ? '200x150' : '1920x1080'; // Demo 15% chance of warning-sized images
    setSimulatedResolution(randRes);

    const [wStr, hStr] = randRes.split('x');
    const w = parseInt(wStr, 10);
    const h = parseInt(hStr, 10);

    if (isImage && (w < 320 || h < 240 || w > 4096 || h > 4096)) {
      setFileError(`Dimensão não suportada: ${randRes}. Mínimo: 320x240, Máximo: 4096x4096px.`);
      return;
    }

    setSelectedFile(file);
    setSelectedFileName(file.name);
    setSelectedFileType(isImage ? 'image' : 'video');
    setSelectedFileSize(Number(fileSizeInMB.toFixed(2)));
    
    // Create local object URL for instant graphic previewing in browser
    const url = URL.createObjectURL(file);
    setMediaUploadedUrl(url);
  };

  // Submit Ad / Add to requests
  const handleCreateAdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdTitle || !newAdAdvId) {
      alert('Selecione uma empresa de anunciante e escreva o título da campanha.');
      return;
    }

    const linkedAdv = advertisers.find(a => a.id === newAdAdvId);
    if (!linkedAdv) return;

    // Create ad pending request
    const newRequest: PendingRequest = {
      id: `req-created-${Date.now()}`,
      anuncioTitulo: newAdTitle,
      empresa: linkedAdv.empresa,
      responsavel: linkedAdv.responsavel,
      telefone: linkedAdv.telefone,
      email: linkedAdv.email,
      descricao: newAdDesc,
      duracaoSegundos: newAdDuration,
      origem: 'PAINEL',
      nomeArquivo: selectedFileName || 'placeholder_midia.jpg',
      status: 'PENDENTE',
      tipoMidia: selectedFileType,
      midiaUrl: mediaUploadedUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
      tamanhoArquivo: selectedFileSize || 1.8,
      resolucao: simulatedResolution,
      dataCriacao: new Date().toISOString(),
      dataFormInicio: newAdDateInicio || undefined,
      dataFormFim: newAdDateFim || undefined
    };

    setRequests(prev => [newRequest, ...prev]);
    addSystemLog('CREATE_AD', `Nova solicitação de anúncio criada: "${newAdTitle}" para o anunciante "${linkedAdv.empresa}".`);
    
    // Reset Form
    setShowAdForm(false);
    setNewAdTitle('');
    setNewAdDesc('');
    setSelectedFile(null);
    setSelectedFileName('');
    setMediaUploadedUrl('');
    setFileError('');
  };

  // Submit Advertiser
  const handleCreateAdvSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdvEmpresa || !newAdvResponsavel || !newAdvEmail) return;

    const newAdv: Advertiser = {
      id: `adv-${Date.now()}`,
      empresa: newAdvEmpresa,
      responsavel: newAdvResponsavel,
      telefone: newAdvTelefone,
      email: newAdvEmail,
      observacao: newAdvObs
    };

    setAdvertisers(prev => [...prev, newAdv]);
    addSystemLog('SYSTEM', `Novo anunciante cadastrado via painel: "${newAdvEmpresa}".`);
    
    // Reset
    setShowAdvForm(false);
    setNewAdvEmpresa('');
    setNewAdvResponsavel('');
    setNewAdvTelefone('');
    setNewAdvEmail('');
    setNewAdvObs('');
  };

  // Approve a request
  const handleApproveRequest = (id: string) => {
    const req = requests.find(r => r.id === id);
    if (!req) return;

    // 1. Find or create advertiser
    let advertiser = advertisers.find(a => a.empresa.toLowerCase() === req.empresa.toLowerCase());
    let advertiserId = advertiser?.id;

    if (!advertiser) {
      advertiserId = `adv-${Date.now()}`;
      const newAdv: Advertiser = {
        id: advertiserId,
        empresa: req.empresa,
        responsavel: req.responsavel,
        telefone: req.telefone,
        email: req.email,
        observacao: 'Criado na aprovação de formulário/forms'
      };
      setAdvertisers(prev => [...prev, newAdv]);
      advertiser = newAdv;
    }

    // 2. Generate secure name and hashing key for files (Step 5)
    const fileExtension = req.nomeArquivo.split('.').pop() || 'jpg';
    const secureName = `loopads_${Date.now()}_secured.${fileExtension}`;
    const generatedHash = `sha256_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    // 3. Create or update the active Ad
    const newAd: Ad = {
      id: req.adId || `ad-${Date.now()}`,
      advertiserId: advertiserId!,
      titulo: req.anuncioTitulo,
      descricao: req.descricao,
      duracaoSegundos: req.duracaoSegundos,
      ordem: ads.length + 1,
      status: 'APROVADO',
      ativo: true,
      midiaUrl: req.midiaUrl,
      midiaType: req.tipoMidia,
      midiaName: secureName,
      midiaSize: req.tamanhoArquivo,
      midiaResolution: req.resolucao,
      midiaHash: generatedHash,
      dataInicio: req.dataFormInicio,
      dataFim: req.dataFormFim,
      cronSchedule: newAdCron,
      humanSchedule: newAdHumanCron
    };

    setAds(prev => [...prev, newAd]);

    // 4. Set Request status
    setRequests(prev => prev.map(r => r.id === id ? { 
      ...r, 
      status: 'APROVADO', 
      responsavelAprovacao: 'admin@loopads.com', 
      motivo: moderationNotes[id] || 'Satisfeito com as especificações da mídia.'
    } : r));

    addSystemLog('APPROVE', `Anúncio "${req.anuncioTitulo}" de "${req.empresa}" APROVADO. Mídia salva em uploads/ como: ${secureName}.`);
  };

  // Reject a request
  const handleRejectRequest = (id: string, reason: string) => {
    if (!reason) {
      alert('Favor detalhar o motivo da rejeição da mídia comercial.');
      return;
    }

    const req = requests.find(r => r.id === id);
    if (!req) return;

    setRequests(prev => prev.map(r => r.id === id ? { 
      ...r, 
      status: 'REJEITADO', 
      responsavelAprovacao: 'admin@loopads.com', 
      motivo: reason
    } : r));

    addSystemLog('REJECT', `Anúncio "${req.anuncioTitulo}" rejeitado de veiculação. Motivo: ${reason}.`);
  };

  // Fila navigation manual (Moving items Up and Down - Step 10)
  const handleMoveAd = (index: number, direction: 'UP' | 'DOWN') => {
    const updatedAds = [...ads];
    if (direction === 'UP' && index > 0) {
      const temp = updatedAds[index];
      updatedAds[index] = updatedAds[index - 1];
      updatedAds[index - 1] = temp;
    } else if (direction === 'DOWN' && index < ads.length - 1) {
      const temp = updatedAds[index];
      updatedAds[index] = updatedAds[index + 1];
      updatedAds[index + 1] = temp;
    }

    // Refresh order index
    const reordered = updatedAds.map((ad, idx) => ({ ...ad, ordem: idx + 1 }));
    setAds(reordered);
  };

  const handleSaveQueueOrder = () => {
    addSystemLog('REORDER', 'Salvo novo ordenamento lógico do player para a fila comercial.');
    alert('Ordem da fila de exibição salva com sucesso! Os players de TV foram notificados comercialmente.');
  };

  // Toggle activation of an ad
  const handleToggleAdActive = (adId: string) => {
    setAds(prev => prev.map(ad => ad.id === adId ? { ...ad, ativo: !ad.ativo } : ad));
    const targetAd = ads.find(a => a.id === adId);
    if (targetAd) {
      addSystemLog('SYSTEM', `Campanha "${targetAd.titulo}" foi ${targetAd.ativo ? 'DESATIVADA' : 'ATIVADA'} da rede pelo administrador.`);
    }
  };

  // Filters calculation
  const filteredAds = useMemo(() => {
    return ads.filter(ad => {
      const adv = advertisers.find(a => a.id === ad.advertiserId);
      return ad.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || 
             adv?.empresa.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [ads, advertisers, searchQuery]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = logFilter === 'ALL' || log.type === logFilter;
      return matchesSearch && matchesFilter;
    });
  }, [logs, searchQuery, logFilter]);

  // Derived aggregates (Stats Cards)
  const pendingRequestsCount = requests.filter(r => r.status === 'PENDENTE').length;
  const activeAdsCount = ads.filter(a => a.status === 'APROVADO' && a.ativo).length;

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Dashboard Top bar navigation */}
      <div className="bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-slate-950">
              <Tv className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-white text-sm font-extrabold tracking-tight leading-none"><span className="gradient-text">LoopAds Central de Comando</span></h2>
              <span className="text-[10px] text-zinc-500 font-mono tracking-wide uppercase leading-none block mt-0.5">Mídia Indoor Inteligente</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs bg-slate-950/60 px-2.5 py-1 rounded-md border border-slate-800/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400 font-medium text-[10px] font-mono">USUÁRIO: admin@loopads.com</span>
            </span>

            <button
              onClick={onOpenPlayer}
              className="text-xs font-semibold px-3 py-1.5 bg-emerald-500 text-slate-950 rounded-lg shrink-0 flex items-center gap-1.5 hover:bg-emerald-400 transition"
              id="dash_abrir_player"
            >
              <Tv className="w-3.5 h-3.5" /> Abrir Player de TV
            </button>

            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-950 hover:bg-slate-800 border border-slate-800/60 rounded-lg transition"
              title="Sair do Terminal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Main layout container */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-6 flex-1 flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Nav links */}
        <aside className="md:w-56 shrink-0 flex flex-row md:flex-col gap-1.5 bg-slate-900/40 p-1.5 md:p-2.5 border border-slate-900 rounded-xl overflow-x-auto select-none no-scrollbar">
          <div className="hidden md:block pb-2 px-2 text-[10px] font-mono text-slate-500 font-bold tracking-wider uppercase">
            Menu Operacional
          </div>

          <button
            onClick={() => { setActiveTab('overview'); setSearchQuery(''); }}
            className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 shrink-0 transition ${
              activeTab === 'overview' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" /> Visão Geral
          </button>

          <button
            onClick={() => { setActiveTab('requests'); setSearchQuery(''); }}
            className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-between shrink-0 transition ${
              activeTab === 'requests' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <FileCheck className="w-4 h-4" /> Solicitações
            </span>
            {pendingRequestsCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 bg-red-500 text-white rounded-full font-bold">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('ads'); setSearchQuery(''); }}
            className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 shrink-0 transition ${
              activeTab === 'ads' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4" /> Anúncios e Campanhas
          </button>

          <button
            onClick={() => { setActiveTab('advertisers'); setSearchQuery(''); }}
            className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 shrink-0 transition ${
              activeTab === 'advertisers' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> Anunciantes cadastrados
          </button>

          <button
            onClick={() => { setActiveTab('queue'); setSearchQuery(''); }}
            className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 shrink-0 transition ${
              activeTab === 'queue' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <ArrowUpDown className="w-4 h-4" /> Organizar Fila TV
          </button>



          <button
            onClick={() => { setActiveTab('logs'); setSearchQuery(''); }}
            className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 shrink-0 transition ${
              activeTab === 'logs' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" /> Histórico de logs
          </button>

          <button
            onClick={() => { setActiveTab('settings'); setSearchQuery(''); }}
            className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 shrink-0 transition ${
              activeTab === 'settings' ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" /> Ajustes do Player
          </button>
        </aside>

        {/* Dynamic Display Area */}
        <main className="flex-1 space-y-6 overflow-hidden min-w-0">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 text-left">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Centro de Linha Comercial</h3>
                  <p className="text-slate-400 text-xs">Visão geral do tráfego programático e integridade do player ativo.</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block">Anunciantes ativos</span>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-2xl font-bold text-white">{advertisers.length}</span>
                    <Users className="w-5 h-5 text-slate-600" />
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block">Anúncios no Player</span>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-2xl font-bold text-white">{activeAdsCount}</span>
                    <Tv className="w-5 h-5 text-emerald-500" />
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-xl space-y-1 cursor-pointer" onClick={() => setActiveTab('requests')}>
                  <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block">Solicitações Pendentes</span>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-2xl font-bold text-coral-400 text-amber-400">{pendingRequestsCount}</span>
                    <FileCheck className="w-5 h-5 text-amber-500" />
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block">Fila de Transmissão</span>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-2xl font-bold text-white">{ads.filter(a => a.ativo).length}</span>
                    <Sliders className="w-5 h-5 text-slate-600" />
                  </div>
                </div>

              </div>

              {/* Central panels split */}
              <div className="grid lg:grid-cols-12 gap-6 pt-2">
                
                {/* Visualizer queue representation */}
                <div className="lg:col-span-7 bg-slate-900/40 border border-slate-900/80 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">Prévias da Fila do Player ({playerConfig.playerName})</h4>
                    <span className="text-[10px] text-slate-400 font-mono bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                      Ciclo: {playerConfig.mode === 'fila' ? 'Seqüencial' : 'Aleatório'}
                    </span>
                  </div>

                  {ads.filter(a => a.ativo).length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                      Fila vazia ou nenhum anúncio ativo publicado no momento.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {ads.filter(a => a.ativo).map((ad, idx) => {
                        const adv = advertisers.find(at => at.id === ad.advertiserId);
                        return (
                          <div key={ad.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-2 relative group overflow-hidden">
                            <div className="aspect-video w-full rounded bg-slate-900 overflow-hidden relative">
                              <img src={ad.midiaUrl} alt="" className="w-full h-full object-cover" />
                              <span className="absolute bottom-1 right-1 text-[9px] font-mono tracking-wider px-1 py-0.2 rounded bg-slate-950/80 text-emerald-400">
                                {ad.duracaoSegundos}s
                              </span>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-mono p-1 rounded bg-slate-900 text-slate-500 block w-fit">
                                #{idx + 1} - ORDER
                              </span>
                              <h5 className="text-xs font-bold text-white truncate">{ad.titulo}</h5>
                              <p className="text-[10px] text-slate-400 truncate">{adv?.empresa || 'Anunciante'}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Audit trail preview */}
                <div className="lg:col-span-5 bg-slate-900/40 border border-slate-900/80 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800pb-3">
                    <h4 className="text-sm font-bold text-white">Logs Recentes</h4>
                    <button onClick={() => setActiveTab('logs')} className="text-[11px] text-emerald-400 hover:underline">Ver todos</button>
                  </div>

                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1 no-scrollbar">
                    {logs.slice(0, 5).map(log => (
                      <div key={log.id} className="text-xs space-y-0.5 border-b border-slate-800/40 pb-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-mono px-1 border rounded uppercase font-bold ${
                            log.type === 'APPROVE' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                            log.type === 'REJECT' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                            log.type === 'IMPORT_XLSX' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                            'bg-slate-800 border-slate-700 text-slate-350'
                          }`}>
                            {log.type}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-slate-300 leading-normal text-[11px]">{log.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: REQUESTS */}
          {activeTab === 'requests' && (
            <div className="space-y-6 text-left">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Solicitações Pendentes de Revisão</h3>
                  <p className="text-slate-400 text-xs">Aprove anúncios e formate suas mídias comerciais com segurança antes da transmissão pública.</p>
                </div>

                <button
                  onClick={handleUpdateBase}
                  disabled={isSyncing}
                  className={`px-5 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md uppercase tracking-wide shrink-0 disabled:cursor-not-allowed cursor-pointer ${
                    isSyncing
                      ? 'bg-slate-900 border border-slate-800 text-slate-500 opacity-80'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/15 hover:scale-[1.01]'
                  }`}
                  id="dash_sync_button_requests"
                >
                  <FolderSync className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
                </button>
              </div>

              {requests.filter(r => r.status === 'PENDENTE').length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs border border-dashed border-slate-800 rounded-xl space-y-3">
                  <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="font-semibold text-white">Nenhum anúncio pendente para revisar!</p>
                  <p className="text-[11px] text-slate-500">
                    O funil está limpo. Novos envios gerados no celular pelo "Google Forms" ou carregamentos de planilha aparecerão aqui automaticamente.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.filter(r => r.status === 'PENDENTE').map(req => {
                    const isResolutionSafe = req.resolucao !== '200x150'; // Simulated unsafe resolution
                    
                    return (
                      <div key={req.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col lg:flex-row gap-6">
                        
                        {/* Image Preview container */}
                        <div className="lg:w-44 shrink-0 space-y-2">
                          <div className="aspect-square bg-slate-950 rounded-lg overflow-hidden border border-slate-800 relative group">
                            <img src={req.midiaUrl} alt="" className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-950/80 text-[8px] font-mono text-slate-400 uppercase">
                              {req.tipoMidia === 'video' ? 'VIDEO (MP4)' : 'IMAGEM'}
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono block truncate" title={req.nomeArquivo}>
                            Arq: {req.nomeArquivo}
                          </span>
                        </div>

                        {/* Mid Section Info details */}
                        <div className="flex-1 space-y-3 min-w-0">
                          
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white truncate">{req.anuncioTitulo}</h4>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-850 border border-slate-800 text-slate-400 font-mono uppercase font-bold">
                              VIAS: {req.origem}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs border-b border-slate-800 pb-3">
                            <div>
                              <span className="text-[10px] text-slate-500 block">Anunciante proposto:</span>
                              <strong className="text-white truncate block">{req.empresa}</strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block">Contato / Resp:</span>
                              <span className="text-slate-300 truncate block">{req.responsavel} | {req.telefone}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block">Duração pretendida:</span>
                              <span className="text-slate-300 block">{req.duracaoSegundos} segundos</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block">Cadastrado em:</span>
                              <span className="text-slate-300 block font-mono text-[10px]">{new Date(req.dataCriacao).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Technical Upload verification box */}
                          <div className="bg-slate-950 p-2.5 rounded border border-slate-850/80 grid grid-cols-2 gap-2 text-center text-[11px]">
                            <div>
                              <span className="text-[9px] text-slate-500 uppercase font-mono block">Resolução</span>
                              <strong className={`${isResolutionSafe ? 'text-emerald-400' : 'text-amber-400'} font-mono`}>{req.resolucao}</strong>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-500 uppercase font-mono block">Tamanho</span>
                              <strong className="text-white font-mono">{req.tamanhoArquivo.toFixed(1)} MB</strong>
                            </div>
                          </div>

                          {/* Warnings feedback */}
                          {!isResolutionSafe && (
                            <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] rounded flex items-center gap-1.5 leading-snug">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              Alerta de Produção: A imagem anexada possui resolução muito baixa {req.resolucao}. Sugere-se pedir reenvio ou rejeitar o anúncio.
                            </div>
                          )}

                          {/* Vigência forms dates */}
                          {req.dataFormInicio && (
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-950/40 p-1 px-2.5 rounded w-fit border border-slate-850">
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              <span>Vigência Pretendida: <strong>{req.dataFormInicio}</strong> até <strong>{req.dataFormFim}</strong></span>
                            </div>
                          )}

                        </div>

                        {/* Moderations Action Side */}
                        <div className="lg:w-56 shrink-0 flex flex-col justify-between gap-3 bg-slate-950/40 p-3 rounded-lg border border-slate-850/50">
                          
                          <div className="space-y-1.5 text-left">
                            <label className="text-[10px] text-zinc-500 block font-mono uppercase">Notas administrativas</label>
                            <textarea
                              value={moderationNotes[req.id] || ''}
                              onChange={(e) => setModerationNotes({ ...moderationNotes, [req.id]: e.target.value })}
                              placeholder="Adicione observações para aprovar, ou relate o erro para rejeição..."
                              className="w-full h-18 bg-slate-900 border border-slate-800 rounded p-1.5 text-[11px] text-slate-300 focus:outline-none focus:border-emerald-500 resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => {
                                const reason = moderationNotes[req.id] || '';
                                if (!reason) {
                                  alert('Favor preencher o motivo da recusa nas Notas Administrativas.');
                                } else {
                                  handleRejectRequest(req.id, reason);
                                }
                              }}
                              className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-slate-950 border border-red-500/30 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 uppercase tracking-wider"
                              title="Rejeitar Ad"
                            >
                              <X className="w-3.5 h-3.5" /> Rejeitar
                            </button>
                            <button
                              onClick={() => handleApproveRequest(req.id)}
                              className="px-2.5 py-1.5 bg-emerald-500 text-slate-950 hover:bg-emerald-400 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 uppercase tracking-wider shadow-md shadow-emerald-500/10"
                            >
                              <Check className="w-3.5 h-3.5" /> Aprovar
                            </button>
                          </div>

                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* TAB 3: ADS & CAMPAIGNS */}
          {activeTab === 'ads' && (
            <div className="space-y-6 text-left">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Anúncios & Campanhas Ativas</h3>
                  <p className="text-slate-400 text-xs">Acompanhamento de anúncios homologados na esteira de transmissão.</p>
                </div>

                <button
                  onClick={() => setShowAdForm(!showAdForm)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 text-emerald-400 hover:bg-slate-800 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" /> Novo Lançamento Manual
                </button>
              </div>

              {/* Form toggle */}
              <AnimatePresence>
                {showAdForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-5 overflow-hidden"
                  >
                    <form onSubmit={handleCreateAdSubmit} className="space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <h4 className="text-white font-bold text-sm">Preencher Novos Parâmetros de Campanha</h4>
                        <button type="button" onClick={() => setShowAdForm(false)} className="text-slate-400 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-slate-400 font-semibold">Selecione o Anunciante *</label>
                          <select
                            required
                            value={newAdAdvId}
                            onChange={(e) => setNewAdAdvId(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                          >
                            <option value="">-- Selecionar Empresa Cadastrada --</option>
                            {advertisers.map(adv => (
                              <option key={adv.id} value={adv.id}>{adv.empresa} (Resp: {adv.responsavel})</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-slate-400 font-semibold">Título Comercial da Campanha *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: Treino de Kettlebell Sem Limites"
                            value={newAdTitle}
                            onChange={(e) => setNewAdTitle(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-semibold">Descrição de Apoio Cortês</label>
                        <textarea
                          placeholder="Texto curto complementar que pode aparecer na legenda das TVs..."
                          value={newAdDesc}
                          onChange={(e) => setNewAdDesc(e.target.value)}
                          className="w-full h-16 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* Google Cron scheduling input */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* We use our specialized scheduler! (Step 7 requirement) */}
                        <CronScheduler 
                          initialCron={newAdCron} 
                          onChange={(cron, human) => {
                            setNewAdCron(cron);
                            setNewAdHumanCron(human);
                          }} 
                        />

                        {/* File Upload zone with automated security hashing and dimensions verification */}
                        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
                          <div className="flex items-center gap-1.5">
                            <PlusCircle className="w-5 h-5 text-emerald-400" />
                            <h4 className="text-white text-xs font-semibold">Saneamento de Arquivos Locais</h4>
                          </div>

                          <div className="border border-dashed border-slate-800 hover:border-emerald-500/50 rounded-lg p-4 text-center cursor-pointer relative bg-slate-950 transition">
                            <input
                              type="file"
                              accept="image/*,video/*"
                              onChange={handleMediaSelection}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            {selectedFileName ? (
                              <div className="text-xs space-y-1">
                                <span className="text-emerald-400 font-mono block truncate font-semibold">✓ {selectedFileName}</span>
                                <span className="text-[10px] text-slate-500 block">Tipo: {selectedFileType === 'video' ? 'Vídeo (MP4)' : 'Imagem'} • {selectedFileSize} MB</span>
                              </div>
                            ) : (
                              <div className="space-y-1 text-slate-400">
                                <PlusCircle className="w-6 h-6 text-slate-500 mx-auto" />
                                <span className="text-xs font-bold text-slate-350 block">Anexar Mídia do Anúncio</span>
                                <span className="text-[10px] text-slate-500 block">Suporta JPG, PNG, WebP ou MP4 de até 200MB</span>
                              </div>
                            )}
                          </div>

                          {fileError && (
                            <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] rounded leading-relaxed text-left">
                              <strong>Arquivo Rejeitado:</strong> {fileError}
                            </div>
                          )}

                          {!fileError && selectedFileName && (
                            <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-500 text-left font-mono">
                              <div>Dimensão Prevista: <strong className="text-white text-[10px]">{simulatedResolution}</strong></div>
                              <div>Hash Gerado: <strong className="text-white block truncate">SHA256-{Math.random().toString(36).substring(3,9)}</strong></div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-slate-400 font-semibold block mb-1">Duração na tela (Segundos)</label>
                          <input
                            type="number"
                            min="5"
                            max="60"
                            value={newAdDuration}
                            onChange={(e) => setNewAdDuration(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 font-semibold block mb-1">Vigência Inicial (Opcional)</label>
                          <input
                            type="date"
                            value={newAdDateInicio}
                            onChange={(e) => setNewAdDateInicio(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 font-semibold block mb-1">Vigência Final (Opcional)</label>
                          <input
                            type="date"
                            value={newAdDateFim}
                            onChange={(e) => setNewAdDateFim(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setShowAdForm(false)}
                          className="px-4 py-2 text-xs font-semibold text-slate-400"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold rounded-lg text-xs transition"
                        >
                          Salvar e Criar Solicitação
                        </button>
                      </div>

                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Table rendering of approved active campaigns */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex flex-col sm:flex-row justify-between gap-3">
                  <div className="flex items-center gap-2 max-w-xs w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
                    <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <input
                      type="text"
                      placeholder="Pesquisar por título ou empresa..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent w-full text-white focus:outline-none text-xs"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                    Modo: Fila Ordenada de Veiculação
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/40 text-slate-400 font-light font-mono uppercase text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="px-5 py-3 font-semibold">Anúncio / Mídia</th>
                        <th className="px-5 py-3 font-semibold">Anunciante</th>
                        <th className="px-5 py-3 font-semibold">Timing / Duração</th>
                        <th className="px-5 py-3 font-semibold">Datas de Vigência</th>
                        <th className="px-5 py-3 font-semibold text-center">Início/Fim</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredAds.map(ad => {
                        const adv = advertisers.find(a => a.id === ad.advertiserId);
                        return (
                          <tr key={ad.id} className="hover:bg-slate-800/20">
                            <td className="px-5 py-3.5 flex items-center gap-3">
                              <div className="w-12 h-8 rounded bg-slate-950 overflow-hidden shrink-0 border border-slate-850">
                                <img src={ad.midiaUrl} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <strong className="text-white block font-medium text-xs leading-none">{ad.titulo}</strong>
                                <span className="text-[10px] text-slate-500 font-mono block mt-1">Ref: {ad.midiaName}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="text-slate-300 font-medium block">{adv?.empresa || 'Empresa'}</span>
                              <span className="text-[10px] text-slate-500 block">{adv?.responsavel}</span>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="text-white font-bold">{ad.duracaoSegundos}s</span>
                              <span className="text-[10px] text-slate-500 block">Tempo Tela</span>
                            </td>
                            <td className="px-5 py-3.5">
                              {ad.dataInicio ? (
                                <span className="text-slate-300 font-mono text-[11px] block">{ad.dataInicio} <span className="text-zinc-650">até</span> {ad.dataFim}</span>
                              ) : (
                                <span className="text-slate-500 font-mono block">Indeterminado (Contínuo)</span>
                              )}
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <button
                                onClick={() => handleToggleAdActive(ad.id)}
                                className={`status-badge transition ${
                                  ad.ativo ? 'approved' : 'bg-slate-800 text-slate-500 border border-slate-750'
                                }`}
                              >
                                {ad.ativo ? 'ATIVO' : 'MUTADO'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: ADVERTISERS */}
          {activeTab === 'advertisers' && (
            <div className="space-y-6 text-left">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Cadastro de Anunciantes Industriais</h3>
                  <p className="text-slate-400 text-xs">Administre as empresas parceiras que emitem mídias indoor.</p>
                </div>

                <button
                  onClick={() => setShowAdvForm(!showAdvForm)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 text-emerald-400 hover:bg-slate-800 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" /> Cadastrar Novo Anunciante
                </button>
              </div>

              {/* Add Advertiser Form */}
              <AnimatePresence>
                {showAdvForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-5 overflow-hidden text-left"
                  >
                    <form onSubmit={handleCreateAdvSubmit} className="space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <h4 className="text-white font-bold text-sm">Registrar Nova Conta Anunciante</h4>
                        <button type="button" onClick={() => setShowAdvForm(false)} className="text-slate-400 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-slate-400 font-semibold">Nome da Empresa / Razão Social *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: Farmácia Popular"
                            value={newAdvEmpresa}
                            onChange={(e) => setNewAdvEmpresa(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-slate-400 font-semibold">Nome do Responsável de Contato *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: Lucas Mendes"
                            value={newAdvResponsavel}
                            onChange={(e) => setNewAdvResponsavel(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-slate-400 font-semibold">Telefone de Contato</label>
                          <input
                            type="text"
                            placeholder="Ex: (11) 98111-2233"
                            value={newAdvTelefone}
                            onChange={(e) => setNewAdvTelefone(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-slate-400 font-semibold">E-mail Comercial *</label>
                          <input
                            type="email"
                            required
                            placeholder="Ex: financeiro@empresa.com"
                            value={newAdvEmail}
                            onChange={(e) => setNewAdvEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-semibold">Observações Internas (Opcional)</label>
                        <input
                          type="text"
                          placeholder="Ex: Contrato de 12 meses, faturamento todo dia 05..."
                          value={newAdvObs}
                          onChange={(e) => setNewAdvObs(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setShowAdvForm(false)}
                          className="px-4 py-2 text-xs font-semibold text-slate-400"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs transition animate-pulse"
                        >
                          Salvar Contratante
                        </button>
                      </div>

                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Grid listings */}
              <div className="grid sm:grid-cols-2 gap-4">
                {advertisers.map(adv => {
                  const linkedCount = ads.filter(a => a.advertiserId === adv.id).length;
                  return (
                    <div key={adv.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                      
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white uppercase tracking-tight">{adv.empresa}</h4>
                          <span className="text-[10px] text-slate-400 block mt-1">Contato: {adv.responsavel}</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800">
                          {linkedCount} Anúncio(s)
                        </span>
                      </div>

                      <div className="text-xs space-y-1 text-slate-400 border-t border-slate-800/60 pt-3">
                        <div>Email: <strong className="text-slate-350 select-all font-mono">{adv.email}</strong></div>
                        <div>Telefone: <strong className="text-slate-350 font-mono">{adv.telefone}</strong></div>
                        
                        {adv.observacao && (
                          <div className="mt-2 text-[10px] italic p-1.5 rounded bg-slate-950/80 text-zinc-500 border border-slate-850">
                            Obs: {adv.observacao}
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 5: QUEUE REORDER (Step 10 Drag n drop or manually sort) */}
          {activeTab === 'queue' && (
            <div className="space-y-6 text-left">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Fila de Exibição de TVs</h3>
                  <p className="text-slate-400 text-xs">Arraste e ordene a playlist comercial para os players ativos. (Sincronização instantânea).</p>
                </div>

                <button
                  onClick={handleSaveQueueOrder}
                  className="px-5 py-2 bg-emerald-500 text-slate-950 hover:bg-emerald-400 text-xs font-bold rounded-lg transition shadow-md shadow-emerald-500/15 uppercase tracking-wide"
                >
                  Salvar Nova Ordem
                </button>
              </div>

              {ads.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                  Nenhum anúncio cadastrado para organizar na fila comercial.
                </div>
              ) : (
                <div className="space-y-2">
                  {ads.map((ad, idx) => {
                    const adv = advertisers.find(a => a.id === ad.advertiserId);
                    return (
                      <div 
                        key={ad.id} 
                        className={`flex items-center gap-4 bg-slate-900 border p-3 rounded-xl transition-all ${
                          ad.ativo ? 'border-slate-800' : 'border-slate-850 opacity-60'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center shrink-0 pr-2 border-r border-slate-800/65">
                          <button
                            disabled={idx === 0}
                            onClick={() => handleMoveAd(idx, 'UP')}
                            className="p-1 text-slate-400 hover:text-emerald-400 disabled:opacity-20 cursor-pointer"
                            title="Mover para cima"
                          >
                            <ChevronUp className="w-5 h-5" />
                          </button>
                          <span className="text-xs font-mono font-bold text-slate-500">#{idx + 1}</span>
                          <button
                            disabled={idx === ads.length - 1}
                            onClick={() => handleMoveAd(idx, 'DOWN')}
                            className="p-1 text-slate-400 hover:text-emerald-400 disabled:opacity-20 cursor-pointer"
                            title="Mover para baixo"
                          >
                            <ChevronDown className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="w-16 h-10 rounded bg-slate-950 border border-slate-850 overflow-hidden shrink-0">
                          <img src={ad.midiaUrl} alt="" className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 min-w-0 text-left">
                          <h4 className="text-xs font-semibold text-white leading-tight truncate">{ad.titulo}</h4>
                          <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
                            Anunciante: <strong>{adv?.empresa}</strong> • Duração: <strong>{ad.duracaoSegundos}s</strong> • Sched: {ad.humanSchedule}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className={`px-2 py-0.5 text-[9px] font-mono rounded ${
                            ad.ativo ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-850 text-slate-500'
                          }`}>
                            {ad.ativo ? 'VEICULANDO' : 'MUTADO'}
                          </span>
                          <input
                            type="checkbox"
                            checked={ad.ativo}
                            onChange={() => handleToggleAdActive(ad.id)}
                            className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                          />
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* TAB 6: GOOGLE SHEETS / FORMS */}
          {activeTab === 'sheets' && (
            <div className="space-y-6 text-left">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Fluxo Google Forms para aprovação</h3>
                  <p className="text-slate-400 text-xs">Acompanhe as linhas sincronizadas da tabela e integre mídias acumuladas na pasta temporária `temp/`.</p>
                </div>
              </div>

              {/* Sync outputs console */}
              {syncLogs.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1 flex flex-col items-stretch text-left font-mono text-[11px]">
                  <span className="text-slate-500 font-bold uppercase tracking-wider block text-[9px] mb-1">Terminal de Importação Síncrona</span>
                  <div className="space-y-1 text-zinc-300 max-h-32 overflow-y-auto no-scrollbar">
                    {syncLogs.map((log, lIdx) => (
                      <div key={lIdx} className="flex gap-1">
                        <span className="text-slate-650">&gt;</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Spreadsheets listings */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 text-left">
                  <span className="text-xs text-slate-300 font-bold block">Tabela Ativa: anuncios.xlsx</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/40 text-slate-400 font-light font-mono text-[9px] border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-2">id_externo</th>
                        <th className="px-4 py-2">nome_empresa</th>
                        <th className="px-4 py-2">titulo_anuncio</th>
                        <th className="px-4 py-2">nome_arquivo</th>
                        <th className="px-4 py-2 text-center">processado</th>
                        <th className="px-4 py-2 md:table-cell hidden">Vigência</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40 font-mono text-[11px]">
                      {spreadsheetRows.map(row => (
                        <tr key={row.rowId} className="hover:bg-slate-800/10">
                          <td className="px-4 py-2.5 text-slate-500">{row.id_externo}</td>
                          <td className="px-4 py-2.5 text-white font-sans font-semibold">{row.nome_empresa}</td>
                          <td className="px-4 py-2.5 text-slate-350">{row.titulo_anuncio}</td>
                          <td className="px-4 py-2.5 text-emerald-400 text-xs">{row.nome_arquivo}</td>
                          <td className="px-4 py-2.5 text-center">
                            <span className={`status-badge ${
                              row.processado === 'SIM' ? 'approved' : 'pending font-bold animate-pulse'
                            }`}>
                              {row.processado}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-slate-400 hidden md:table-cell text-[10px]">{row.data_inicio} a {row.data_fim}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 7: SYSTEM AUDIT LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-6 text-left">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Histórico de Auditoria Industrial</h3>
                  <p className="text-slate-400 text-xs">Logs imutáveis de orquestração recente para auditoria de mídia e sessões.</p>
                </div>

                <div className="flex gap-2">
                  <select
                    value={logFilter}
                    onChange={(e) => setLogFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="ALL">-- Ver todos --</option>
                    <option value="LOGIN">Logins</option>
                    <option value="CREATE_AD">Criação ads</option>
                    <option value="IMPORT_XLSX">Importações xlsx</option>
                    <option value="APPROVE">Aprovações</option>
                    <option value="REJECT">Rejeições</option>
                    <option value="ERROR">Erros</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 font-mono text-[9px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">Timestamp / Horário</th>
                        <th className="px-4 py-3">Evento</th>
                        <th className="px-4 py-3">Usuário</th>
                        <th className="px-4 py-3">Descrição da Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 font-mono text-[11px]">
                      {filteredLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-800/10">
                          <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="px-4 py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                              log.type === 'APPROVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' :
                              log.type === 'REJECT' ? 'bg-red-500/10 text-red-500 border border-red-500/10' :
                              log.type === 'ERROR' ? 'bg-red-650/20 text-red-400 font-bold' :
                              'bg-slate-850 text-slate-400'
                            }`}>
                              {log.type}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-slate-350">{log.user}</td>
                          <td className="px-4 py-2.5 text-zinc-300 font-sans">{log.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 8: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 text-left">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Configurações Gerais de Transmissão</h3>
                  <p className="text-slate-400 text-xs">Gerencie timings de repetição padrão, nomes e tokens de sinal para o player.</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 space-y-6 max-w-2xl">
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold uppercase font-mono text-[10px]">Nome lógico do Player</label>
                    <input
                      type="text"
                      value={playerConfig.playerName}
                      onChange={(e) => setPlayerConfig({ ...playerConfig, playerName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold uppercase font-mono text-[10px] block mb-1">Duração padrão da Transição</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="5"
                        max="120"
                        value={playerConfig.defaultDuration}
                        onChange={(e) => setPlayerConfig({ ...playerConfig, defaultDuration: Math.max(5, Number(e.target.value)) })}
                        className="w-24 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                      <span className="text-xs text-slate-400">segundos</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase font-mono text-[10px]">Modo de Ciclagem</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="player_mode"
                        checked={playerConfig.mode === 'fila'}
                        onChange={() => setPlayerConfig({ ...playerConfig, mode: 'fila' })}
                        className="accent-emerald-400 w-4 h-4"
                      />
                      Sequência da Fila Programada
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="player_mode"
                        checked={playerConfig.mode === 'aleatorio'}
                        onChange={() => setPlayerConfig({ ...playerConfig, mode: 'aleatorio' })}
                        className="accent-emerald-400 w-4 h-4"
                      />
                      Embaralhamento Aleatório (Random)
                    </label>
                  </div>
                </div>

                {/* Token protection parameters (Step 12) */}
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-3">
                  <div className="flex items-center gap-1.5 text-white text-xs font-bold leading-none">
                    <Key className="w-4 h-4 text-emerald-400" />
                    <span>Token de Segurança do Player</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    O player de TV requere uma autorização restrita via URL para carregar os vídeos e imagens, prevenindo acessos estáticos não-autorizados.
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={playerConfig.token}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-400 font-mono select-all focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        const newToken = `tok_signage_${Math.random().toString(36).substring(2, 12)}`;
                        setPlayerConfig({ ...playerConfig, token: newToken });
                        addSystemLog('SYSTEM', 'Renovada assinatura do Token do Player de TV.');
                      }}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded text-xs transition font-semibold"
                    >
                      Renovar Token
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      addSystemLog('SYSTEM', 'Salvas configurações gerais do orquestrador de mídia.');
                      alert('Ajustes salvos com sucesso!');
                    }}
                    className="px-6 py-2.5 bg-emerald-500 text-slate-950 hover:bg-emerald-400 rounded-lg text-xs font-bold transition shadow-md shadow-emerald-400/10"
                  >
                    Salvar Mudanças
                  </button>
                </div>

              </div>

            </div>
          )}

        </main>

      </div>

    </div>
  );
}

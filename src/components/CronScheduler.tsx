/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Clock, HelpCircle, Code } from 'lucide-react';

interface CronSchedulerProps {
  initialCron?: string;
  onChange: (cron: string, humanReadable: string) => void;
}

export default function CronScheduler({ initialCron = '*/15 * * * *', onChange }: CronSchedulerProps) {
  const [cronType, setCronType] = useState<'minutes' | 'hours' | 'daily' | 'custom'>(() => {
    if (initialCron.startsWith('*/')) return 'minutes';
    if (initialCron === '0 * * * *') return 'hours';
    if (initialCron.match(/^\d+ \d+ \* \* \*$/)) return 'daily';
    return 'custom';
  });

  const [intervalMinutes, setIntervalMinutes] = useState<number>(() => {
    if (initialCron.startsWith('*/')) {
      const mins = parseInt(initialCron.replace('*/', '').split(' ')[0], 10);
      return isNaN(mins) ? 15 : mins;
    }
    return 15;
  });

  const [dailyHour, setDailyHour] = useState<number>(8);
  const [dailyMinute, setDailyMinute] = useState<number>(0);
  const [customCron, setCustomCron] = useState<string>(initialCron);

  // Parse cron syntax to generate human readable explanation
  const parseCronToHuman = (cronStr: string): string => {
    const trimmed = cronStr.trim();
    const parts = trimmed.split(/\s+/);
    if (parts.length !== 5) {
      return 'Cron customizado inválido';
    }

    const [min, hour, dom, mon, dow] = parts;

    if (min.startsWith('*/') && hour === '*' && dom === '*' && mon === '*' && dow === '*') {
      const step = min.replace('*/', '');
      return `A cada ${step} minuto(s) continuadamente`;
    }

    if (min === '0' && hour === '*' && dom === '*' && mon === '*' && dow === '*') {
      return 'A cada hora, no minuto zero';
    }

    if (!isNaN(Number(min)) && !isNaN(Number(hour)) && dom === '*' && mon === '*' && dow === '*') {
      const formatHour = hour.padStart(2, '0');
      const formatMin = min.padStart(2, '0');
      return `Todos os dias pontualmente às ${formatHour}:${formatMin}`;
    }

    return `Customizado (min: ${min}, hora: ${hour}, dia: ${dom}, mês: ${mon}, ds: ${dow})`;
  };

  useEffect(() => {
    let cronStr = '*/15 * * * *';
    let humanStr = 'A cada 15 minutos';

    if (cronType === 'minutes') {
      cronStr = `*/${intervalMinutes} * * * *`;
      humanStr = `A cada ${intervalMinutes} minutos`;
    } else if (cronType === 'hours') {
      cronStr = '0 * * * *';
      humanStr = 'A cada hora';
    } else if (cronType === 'daily') {
      cronStr = `${dailyMinute} ${dailyHour} * * *`;
      const formatHour = dailyHour.toString().padStart(2, '0');
      const formatMin = dailyMinute.toString().padStart(2, '0');
      humanStr = `Todos os dias às ${formatHour}:${formatMin}`;
    } else {
      cronStr = customCron;
      humanStr = parseCronToHuman(customCron);
    }

    onChange(cronStr, humanStr);
  }, [cronType, intervalMinutes, dailyHour, dailyMinute, customCron]);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-400" />
          <h4 className="text-white font-medium text-sm">Cronograma de Exibição</h4>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Orquestrador Inteligente
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => setCronType('minutes')}
          className={`px-3 py-2 text-xs rounded-lg font-medium transition ${
            cronType === 'minutes'
              ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/10'
              : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          Minutos
        </button>
        <button
          type="button"
          onClick={() => setCronType('hours')}
          className={`px-3 py-2 text-xs rounded-lg font-medium transition ${
            cronType === 'hours'
              ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/10'
              : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          Hora em Hora
        </button>
        <button
          type="button"
          onClick={() => setCronType('daily')}
          className={`px-3 py-2 text-xs rounded-lg font-medium transition ${
            cronType === 'daily'
              ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/10'
              : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          Diário Fixo
        </button>
        <button
          type="button"
          onClick={() => setCronType('custom')}
          className={`px-3 py-2 text-xs rounded-lg font-medium transition ${
            cronType === 'custom'
              ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/10'
              : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          Cron Customizado
        </button>
      </div>

      {/* Conditional settings panels */}
      <div className="bg-slate-950/40 p-3.5 rounded-lg border border-slate-800/40">
        {cronType === 'minutes' && (
          <div className="space-y-2">
            <span className="text-xs text-slate-400 block font-medium">Intervalo de repetição:</span>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="59"
                value={intervalMinutes}
                onChange={(e) => setIntervalMinutes(Number(e.target.value))}
                className="flex-1 accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-white text-xs font-mono font-semibold min-w-16 text-right">
                {intervalMinutes} min
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              O player reiniciará ou priorizará o anúncio a cada {intervalMinutes} minutos.
            </p>
          </div>
        )}

        {cronType === 'hours' && (
          <div className="space-y-1">
            <span className="text-xs text-slate-300 block font-medium">Toda hora (:00)</span>
            <p className="text-[11px] text-slate-500">
              O anúncio será sincronizado para exibição principal em ciclos de 60 minutos pontuais.
            </p>
          </div>
        )}

        {cronType === 'daily' && (
          <div className="space-y-3">
            <span className="text-xs text-slate-400 block font-medium">Selecione o horário fixo:</span>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-[10px] text-slate-500 block uppercase font-mono">Hora (0-23)</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={dailyHour}
                  onChange={(e) => setDailyHour(Math.min(23, Math.max(0, Number(e.target.value))))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-slate-500 block uppercase font-mono">Minuto (0-59)</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={dailyMinute}
                  onChange={(e) => setDailyMinute(Math.min(59, Math.max(0, Number(e.target.value))))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {cronType === 'custom' && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-slate-500" />
              <label className="text-xs text-slate-400 font-mono">Expressão Linux Cron (5 campos)</label>
            </div>
            <input
              type="text"
              value={customCron}
              onChange={(e) => setCustomCron(e.target.value)}
              placeholder="e.g. 0 12 * * 1-5"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
            />
            <div className="flex gap-2 text-[10px] text-slate-500 font-mono">
              <span className="text-slate-400">Min</span>
              <span>Hora</span>
              <span>Dia</span>
              <span>Mês</span>
              <span>Semana</span>
            </div>
          </div>
        )}
      </div>

      {/* Output translation box */}
      <div className="bg-slate-950/80 rounded-lg p-3 border border-slate-800/60 flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase font-mono leading-none">Resultado</span>
          <div className="text-xs text-white font-medium">
            {cronType === 'minutes' && `A cada ${intervalMinutes} minutos (\`*/${intervalMinutes} * * * *\`)`}
            {cronType === 'hours' && 'De hora em hora, às :00 (`0 * * * *`)'}
            {cronType === 'daily' && `Todos os dias pontualmente às ${dailyHour.toString().padStart(2, '0')}:${dailyMinute.toString().padStart(2, '0')} (\`${dailyMinute} ${dailyHour} * * *\`)`}
            {cronType === 'custom' && `Traduzido: ${parseCronToHuman(customCron)} (\`${customCron}\`)`}
          </div>
          <span className="text-[10px] text-slate-500 block">
            Esse cronograma é interpretado pelo player para sincronizar a fila em tempo real.
          </span>
        </div>
      </div>
    </div>
  );
}

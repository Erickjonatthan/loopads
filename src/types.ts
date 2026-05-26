/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Advertiser {
  id: string;
  empresa: string;
  responsavel: string;
  telefone: string;
  email: string;
  observacao?: string;
}

export type AdStatus = 'PENDENTE' | 'APROVADO' | 'REJEITADO';

export interface Ad {
  id: string;
  advertiserId: string;
  titulo: string;
  descricao: string;
  duracaoSegundos: number;
  ordem: number;
  status: AdStatus;
  ativo: boolean;
  midiaUrl?: string;
  midiaType?: 'image' | 'video';
  midiaName?: string;
  midiaSize?: number; // in MB
  midiaResolution?: string;
  midiaHash?: string;
  dataInicio?: string;
  dataFim?: string;
  cronSchedule?: string; // e.g. "*/10 * * * *"
  humanSchedule?: string; // e.g. "A cada 10 minutos"
}

export interface PendingRequest {
  id: string;
  adId?: string;
  anuncioTitulo: string;
  empresa: string;
  responsavel: string;
  telefone: string;
  email: string;
  descricao: string;
  duracaoSegundos: number;
  origem: 'FORMS' | 'PAINEL';
  nomeArquivo: string;
  status: AdStatus;
  tipoMidia: 'image' | 'video';
  midiaUrl: string; // Object URL or static mock URl
  tamanhoArquivo: number; // in MB
  resolucao: string;
  motivo?: string;
  responsavelAprovacao?: string;
  dataCriacao: string;
  dataFormInicio?: string;
  dataFormFim?: string;
}

export interface PlayerConfig {
  defaultDuration: number;
  mode: 'fila' | 'aleatorio';
  playerName: string;
  token: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  type: 'LOGIN' | 'LOGOUT' | 'LOGIN_FAIL' | 'CREATE_AD' | 'UPLOAD_MEDIA' | 'IMPORT_XLSX' | 'APPROVE' | 'REJECT' | 'REORDER' | 'SYSTEM' | 'ERROR';
  description: string;
  user: string;
}

export interface SpreadsheetRow {
  rowId: number;
  id_externo: string;
  nome_empresa: string;
  titulo_anuncio: string;
  nome_arquivo: string;
  processado: 'SIM' | 'NAO';
  responsavel?: string;
  telefone?: string;
  email?: string;
  descricao?: string;
  duracao_segundos?: number;
  data_inicio?: string;
  data_fim?: string;
  erro?: string;
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Advertiser, Ad, PendingRequest, SystemLog, SpreadsheetRow } from './types';

export const INITIAL_ADVERTISERS: Advertiser[] = [
  {
    id: 'adv-1',
    empresa: 'Academia FitLife',
    responsavel: 'Carlos Silva',
    telefone: '(11) 98765-4321',
    email: 'contato@fitlife.com',
    observacao: 'Cliente VIP - Tv principal na recepção'
  },
  {
    id: 'adv-2',
    empresa: 'Burger Supreme',
    responsavel: 'Marina Costa',
    telefone: '(11) 91234-5678',
    email: 'marina@burgersupreme.com.br',
    observacao: 'Anúncios de combos promocionais'
  },
  {
    id: 'adv-3',
    empresa: 'Café Aroma Co.',
    responsavel: 'Ricardo Santos',
    telefone: '(21) 99887-7665',
    email: 'cafe.aroma@gourmet.com',
    observacao: 'Foco no período da manhã'
  },
  {
    id: 'adv-4',
    empresa: 'Clínica Sorriso Clean',
    responsavel: 'Dra. Ana Paula',
    telefone: '(31) 97100-2030',
    email: 'adm@sorrisoclean.com.br'
  }
];

export const INITIAL_ADS: Ad[] = [
  {
    id: 'ad-1',
    advertiserId: 'adv-1',
    titulo: 'Projeto Verão 2026 - Mensalidades',
    descricao: 'Matricule-se já e ganhe 15% de desconto nos primeiros 3 meses de treino.',
    duracaoSegundos: 15,
    ordem: 1,
    status: 'APROVADO',
    ativo: true,
    midiaUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    midiaType: 'image',
    midiaName: 'fitlife_verao_320x240.jpg',
    midiaSize: 2.1,
    midiaResolution: '1920x1080',
    midiaHash: 'ad4b8ef2098dca0c91ee015',
    dataInicio: '2026-06-01',
    dataFim: '2026-08-31',
    cronSchedule: '*/10 * * * *',
    humanSchedule: 'A cada 10 minutos'
  },
  {
    id: 'ad-2',
    advertiserId: 'adv-2',
    titulo: 'Combo Supreme Bacon',
    descricao: 'Hambúrguer de costela 150g, muito bacon, queijo cheddar e fritas por apenas R$34,90.',
    duracaoSegundos: 10,
    ordem: 2,
    status: 'APROVADO',
    ativo: true,
    midiaUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
    midiaType: 'image',
    midiaName: 'combo_supreme_final.jpg',
    midiaSize: 1.8,
    midiaResolution: '1920x1080',
    midiaHash: '7f9da8d120a1bcef22d718b',
    dataInicio: '2026-05-20',
    dataFim: '2026-06-20',
    cronSchedule: '0 * * * *',
    humanSchedule: 'Toda hora'
  },
  {
    id: 'ad-3',
    advertiserId: 'adv-3',
    titulo: 'Café Espresso Gourmet',
    descricao: 'Grãos selecionados 100% arábica. O combustível perfeito para o seu dia.',
    duracaoSegundos: 12,
    ordem: 3,
    status: 'APROVADO',
    ativo: true,
    midiaUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop',
    midiaType: 'image',
    midiaName: 'espresso_premium.jpg',
    midiaSize: 1.5,
    midiaResolution: '1920x1080',
    midiaHash: 'b5e28cdf0134a8debc347dc',
    dataInicio: '2026-05-01',
    dataFim: '2026-12-31',
    cronSchedule: '*/30 * * * *',
    humanSchedule: 'A cada 30 minutos'
  }
];

export const INITIAL_PENDING_REQUESTS: PendingRequest[] = [
  {
    id: 'req-1',
    anuncioTitulo: 'Promoção Implante Sem Dor',
    empresa: 'Clínica Sorriso Clean',
    responsavel: 'Dra. Ana Paula',
    telefone: '(31) 97100-2030',
    email: 'adm@sorrisoclean.com.br',
    descricao: 'Implante dentário rápido com sedação consciente. Agende uma avaliação gratuita.',
    duracaoSegundos: 15,
    origem: 'FORMS',
    nomeArquivo: 'implante_sorrisoclean_v2.jpg',
    status: 'PENDENTE',
    tipoMidia: 'image',
    midiaUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop',
    tamanhoArquivo: 2.8,
    resolucao: '1920x1080',
    dataCriacao: '2026-05-26T10:15:00Z',
    dataFormInicio: '2026-06-01',
    dataFormFim: '2026-06-30'
  },
  {
    id: 'req-2',
    anuncioTitulo: 'Inauguração Novo Estúdio de Pilates',
    empresa: 'Academia FitLife',
    responsavel: 'Carlos Silva',
    telefone: '(11) 98765-4321',
    email: 'contato@fitlife.com',
    descricao: 'Novo Studio Pilates com equipamentos modernos e professores especializados. Ganhe uma aula experimental.',
    duracaoSegundos: 20,
    origem: 'PAINEL',
    nomeArquivo: 'pilates_fitlife.jpg',
    status: 'PENDENTE',
    tipoMidia: 'image',
    midiaUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
    tamanhoArquivo: 3.4,
    resolucao: '1920x1080',
    dataCriacao: '2026-05-26T14:30:00Z'
  }
];

export const INITIAL_SPREADSHEET_ROWS: SpreadsheetRow[] = [
  {
    rowId: 1,
    id_externo: 'forms-101',
    nome_empresa: 'Donuts Palace',
    responsavel: 'Felipe Dias',
    telefone: '(11) 98822-1100',
    email: 'felipe@donuts.com',
    titulo_anuncio: 'Sexta-feira do donuts grátis',
    descricao: 'Na compra de qualquer caixa de donuts gourmet, a segunda caixa é grátis. Somente nesta sexta!',
    nome_arquivo: 'donuts_sexta_gratis.jpg',
    processado: 'NAO',
    duracao_segundos: 15,
    data_inicio: '2026-05-28',
    data_fim: '2026-05-30'
  },
  {
    rowId: 2,
    id_externo: 'forms-102',
    nome_empresa: 'Burger Supreme',
    responsavel: 'Marina Costa',
    telefone: '(11) 91234-5678',
    email: 'marina@burgersupreme.com.br',
    titulo_anuncio: 'Happy Hour - Chope em Dobro',
    descricao: 'De terça a quinta-feira, das 17h às 20h. Peça um chope Heineken e ganhe outro.',
    nome_arquivo: 'happy_hour_supreme.jpg',
    processado: 'NAO',
    duracao_segundos: 10,
    data_inicio: '2026-06-01',
    data_fim: '2026-07-31'
  },
  {
    rowId: 3,
    id_externo: 'forms-103',
    nome_empresa: 'Posto Modelo Gas',
    responsavel: 'Gilberto Lima',
    telefone: '(19) 99345-1212',
    email: 'contato@postomodelo.com',
    titulo_anuncio: 'Gasolina Aditivada com Desconto',
    descricao: 'Abasteça 30 litros de gasolina aditivada modelo e ganhe R$0,20 por litro de desconto no app.',
    nome_arquivo: 'modelo_gas_promo.jpg',
    processado: 'NAO',
    duracao_segundos: 12,
    data_inicio: '2026-05-25',
    data_fim: '2026-06-15'
  }
];

export const INITIAL_LOGS: SystemLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-05-26T08:00:00Z',
    type: 'SYSTEM',
    description: 'Sistema inicializado. Parâmetro padrão do player definido para 15 segundos.',
    user: 'Sistema'
  },
  {
    id: 'log-2',
    timestamp: '2026-05-26T08:05:12Z',
    type: 'LOGIN',
    description: 'Administrador geral conectou-se com sucesso.',
    user: 'admin@loopads.com'
  },
  {
    id: 'log-3',
    timestamp: '2026-05-26T09:12:44Z',
    type: 'CREATE_AD',
    description: 'Novo anúncio "Projeto Verão 2026" cadastrado sob o anunciante "Academia FitLife".',
    user: 'admin@loopads.com'
  },
  {
    id: 'log-4',
    timestamp: '2026-05-26T09:15:30Z',
    type: 'APPROVE',
    description: 'Solicitação do anúncio "Projeto Verão" aprovada. Inserido na fila de exibição ativa.',
    user: 'admin@loopads.com'
  },
  {
    id: 'log-5',
    timestamp: '2026-05-26T11:42:00Z',
    type: 'IMPORT_XLSX',
    description: 'Atualização eletrônica de base de dados realizada. 0 novas linhas importadas.',
    user: 'admin@loopads.com'
  }
];

// URLs for mock media to match standard resolution and visual flair
export const STREAMING_BACKGROUND_ADS = [
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop', // Gaming
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop', // Burger/snack
  'https://images.unsplash.com/photo-1555681981-56273c3673c5?q=80&w=800&auto=format&fit=crop', // Pets/Vet shop
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop', // Event/Show
];

/**
 * Serviços da API - Mortalidade
 * Funções específicas para cada endpoint da API Flask
 */

import { api, type FilterParams } from './api';

/**
 * Interface para resposta paginada da API
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

/**
 * Tipos de dados - Ajustados para o backend Flask
 */
export interface TabuaMortalidade {
  id: number;
  ano: number;
  faixa_etaria: string;
  nMx: number;
  nqx: number;
  nAx: number;
  lx: number;
  ndx: number;
  nLx: number;
  Tx: number;
  ex: number;
  local: string;
  sexo: string;
}

// Previsão ARIMA/ETS
export interface PrevisaoArimaEts {
  id: number;
  ano: number;
  faixa_etaria: string;
  Previsao: number;
  limite_inferior: number;
  limite_superior: number;
  local: string;
  sexo: string;
}

// Previsão Lee-Carter / Lee-Miller
export interface PrevisaoLC {
  id: number;
  ano: number;
  faixa_etaria: string;
  previsto: number;
  lmt_inf: number;
  lmt_max: number;
  local: string;
  sexo: string;
}

// Previsão Combinada
export interface PrevisaoCombinada {
  id: number;
  ano: number;
  faixa_etaria: string;
  Previsao: number;
  Lower_95: number;
  Upper_95: number;
  local: string;
  sexo: string;
}

// Tipo genérico para previsões (retrocompatibilidade)
export interface PrevisaoMortalidade {
  id: number;
  ano: number;
  faixa_etaria: string;
  previsao?: number;
  previsto?: number;
  Previsao?: number;
  lower_95?: number;
  upper_95?: number;
  lmt_inf?: number;
  lmt_max?: number;
  Lower_95?: number;
  Upper_95?: number;
  limite_inferior?: number;
  limite_superior?: number;
  local: string;
  sexo: string;
}

export interface MortalidadeInfantil {
  id: number;
  ano: number;
  Taxa: number;        // Campo com T maiúsculo conforme API
  local: string;
  cod_IBGE?: string;
  codigo_DataSUS?: string;
}

export interface DatabaseStatus {
  database: string;
  database_file: string;
  tables: Record<string, number>;
  total_records: number;
  has_data: boolean;
}

/**
 * Serviço: Tábua de Mortalidade
 */
export const tabuaMortalidadeService = {
  /**
   * Buscar dados da tábua de mortalidade (retorna resposta paginada)
   */
  async getAll(params?: FilterParams): Promise<TabuaMortalidade[]> {
    const response = await api.get<PaginatedResponse<TabuaMortalidade>>('tabua-mortalidade', {
      ...params,
      per_page: params?.limit || 1000,  // Buscar mais registros por padrão
    });
    return response.data || [];
  },

  /**
   * Buscar resposta paginada completa
   */
  async getPaginated(params?: FilterParams): Promise<PaginatedResponse<TabuaMortalidade>> {
    return api.get<PaginatedResponse<TabuaMortalidade>>('tabua-mortalidade', params);
  },

  /**
   * Buscar por ano específico
   */
  async getByYear(ano: number): Promise<TabuaMortalidade[]> {
    const response = await api.get<PaginatedResponse<TabuaMortalidade>>('tabua-mortalidade', { 
      ano_inicio: ano, 
      ano_fim: ano,
      per_page: 1000,
    });
    return response.data || [];
  },

  /**
   * Buscar por faixa de anos
   */
  async getByYearRange(anoInicio: number, anoFim: number): Promise<TabuaMortalidade[]> {
    const response = await api.get<PaginatedResponse<TabuaMortalidade>>('tabua-mortalidade', { 
      ano_inicio: anoInicio, 
      ano_fim: anoFim,
      per_page: 1000,
    });
    return response.data || [];
  },

  /**
   * Buscar anos disponíveis
   */
  async getAnos(): Promise<number[]> {
    return api.get<number[]>('tabua-mortalidade/anos');
  },

  /**
   * Buscar locais disponíveis
   */
  async getLocais(): Promise<string[]> {
    return api.get<string[]>('tabua-mortalidade/locais');
  },
};

/**
 * Serviço: Previsões
 */
export const previsoesService = {
  /**
   * Previsões ARIMA/ETS
   */
  async getArimaEts(params?: FilterParams): Promise<PrevisaoMortalidade[]> {
    const response = await api.get<PaginatedResponse<PrevisaoMortalidade>>('previsoes/arima-ets', {
      ...params,
      per_page: params?.limit || 1000,
    });
    return response.data || [];
  },

  /**
   * Previsões Lee-Carter
   */
  async getLeeCarter(params?: FilterParams): Promise<PrevisaoMortalidade[]> {
    const response = await api.get<PaginatedResponse<PrevisaoMortalidade>>('previsoes/lc', {
      ...params,
      per_page: params?.limit || 1000,
    });
    return response.data || [];
  },

  /**
   * Previsões Lee-Miller
   */
  async getLeeMiller(params?: FilterParams): Promise<PrevisaoMortalidade[]> {
    const response = await api.get<PaginatedResponse<PrevisaoMortalidade>>('previsoes/lm', {
      ...params,
      per_page: params?.limit || 1000,
    });
    return response.data || [];
  },

  /**
   * Previsões Combinadas
   */
  async getCombinadas(params?: FilterParams): Promise<PrevisaoMortalidade[]> {
    const response = await api.get<PaginatedResponse<PrevisaoMortalidade>>('previsoes/combinada', {
      ...params,
      per_page: params?.limit || 1000,
    });
    return response.data || [];
  },

  /**
   * Anos disponíveis nas previsões
   */
  async getAnos(): Promise<number[]> {
    return api.get<number[]>('previsoes/anos');
  },
};

/**
 * Serviço: Mortalidade Infantil
 */
export const mortalidadeInfantilService = {
  /**
   * Buscar dados de mortalidade infantil
   */
  async getAll(params?: FilterParams): Promise<MortalidadeInfantil[]> {
    const response = await api.get<PaginatedResponse<MortalidadeInfantil>>('mortalidade-infantil', {
      ...params,
      per_page: params?.limit || 1000,
    });
    return response.data || [];
  },

  /**
   * Buscar por ano específico
   */
  async getByYear(ano: number): Promise<MortalidadeInfantil[]> {
    const response = await api.get<PaginatedResponse<MortalidadeInfantil>>('mortalidade-infantil', { 
      ano_inicio: ano, 
      ano_fim: ano,
      per_page: 1000,
    });
    return response.data || [];
  },
};

/**
 * Serviço: Sistema
 */
export const sistemaService = {
  /**
   * Health check
   */
  async healthCheck() {
    return api.healthCheck();
  },

  /**
   * Status do banco de dados
   */
  async getDatabaseStatus(): Promise<DatabaseStatus> {
    return api.get('/database/status');
  },

  /**
   * Listar rotas disponíveis
   */
  async getRoutes() {
    return api.get('/routes');
  },
};

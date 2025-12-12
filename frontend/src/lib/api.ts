/**
 * Configuração da API
 * Centraliza todas as chamadas ao backend Flask
 */

// Configuração base da API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/sigerip';
const BASE_URL = `${API_URL}${API_PREFIX}`;

/**
 * Tipos para filtros de busca
 */
export interface FilterParams {
  ano_inicio?: number;
  ano_fim?: number;
  local?: string;
  sexo?: string;
  faixa_etaria?: string;
  skip?: number;
  limit?: number;
  page?: number;
  per_page?: number;
}

/**
 * Classe para gerenciar requisições à API
 */
class ApiClient {
  private baseURL: string;
  private apiURL: string;

  constructor() {
    this.baseURL = BASE_URL;
    this.apiURL = API_URL;
  }

  /**
   * Faz uma requisição HTTP
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = endpoint.startsWith('/') 
      ? `${this.apiURL}${endpoint}` 
      : `${this.baseURL}/${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      console.log(`[API] Fetching: ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({
          detail: 'Erro desconhecido'
        }));
        throw new Error(error.detail || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log(`[API] Response:`, data?.length ? `${data.length} items` : data);
      return data;
    } catch (error) {
      console.error('[API] Erro na requisição:', error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: FilterParams): Promise<T> {
    const queryString = params 
      ? '?' + new URLSearchParams(
          Object.entries(params).reduce((acc, [key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
              acc[key] = String(value);
            }
            return acc;
          }, {} as Record<string, string>)
        ).toString()
      : '';

    return this.request<T>(`${endpoint}${queryString}`, {
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * Health check
   */
  async healthCheck() {
    return this.request('/health', { method: 'GET' });
  }
}

// Exportar instância única
export const api = new ApiClient();

// Export default para compatibilidade
export default api;

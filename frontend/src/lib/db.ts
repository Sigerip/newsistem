/**
 * Arquivo de compatibilidade
 * Re-exporta os serviços da API para manter compatibilidade com código antigo
 */

// Re-exportar tudo do services
export * from './services';

// Export default do api
export { api as default } from './api';
'use client'; // <-- Isso é OBRIGATÓRIO para usar hooks

import { useState, useEffect } from 'react';

// 1. Interface CORRETA (o que a API /tabua-mortalidade envia)
//    (Ajuste os campos conforme a sua API)
interface TabuaMortalidadeData {
  id: number; // Ou qualquer que seja sua chave primária (id, ou uma combinação)
  local: string;
  ano: number;
  sexo: string;
  faixa_etaria: string;
  nMx: number;
  // Adicione outros campos que sua API retorna (ex: qx, lx)
  [key: string]: any; // Permite outros campos
}

export default function DashboardPage() {
  // 2. O estado agora é um ARRAY desta interface, iniciando como array vazio
  const [data, setData] = useState<TabuaMortalidadeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // A requisição é feita do NAVEGADOR do usuário para a API Python
    fetch('http://localhost:8000/sigerip/tabua-mortalidade')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Falha na rede ou API: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((apiData: TabuaMortalidadeData[]) => { // Diga ao TypeScript que é um array
        
        // ===========================================
        // ===== TESTE DE CONSOLE DE SUCESSO =====
        console.log('DADOS RECEBIDOS DA API:', apiData);
        // ===========================================

        setData(apiData);
        setLoading(false);
      })
      .catch((err) => {

        // ===========================================
        // ===== TESTE DE CONSOLE DE ERRO =====
        console.error('ERRO NO FETCH:', err);
        // ===========================================

        setError(err.message);
        setLoading(false);
      });
  }, []); // O array vazio [] faz o fetch ser executado apenas uma vez

  if (loading) return <p>Carregando dados...</p>;
  if (error) return <p>Erro ao carregar: {error}</p>;

  // 3. Uma boa prática é verificar se o array está vazio
  if (data.length === 0) {
    return <p>Nenhum dado encontrado.</p>
  }

  // 4. Renderização CORRETA (usando .map() para iterar sobre o array)
  return (
    <div>
      <h1>Dashboard (Cliente) - Tábua de Mortalidade</h1>
      <table border={1}>
        <thead>
          <tr>
            <th>Ano</th>
            <th>Local</th>
            <th>Sexo</th>
            <th>Faixa Etária</th>
            <th>nMx</th>
            {/* Adicione mais cabeçalhos conforme sua API */}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            // Use um 'key' único do seu banco de dados, ou combine campos
            <tr key={item.id || `${item.ano}-${item.local}-${item.sexo}-${item.faixa_etaria}`}>
              <td>{item.ano}</td>
              <td>{item.local}</td>
              <td>{item.sexo}</td>
              <td>{item.faixa_etaria}</td>
              <td>{item.nMx}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
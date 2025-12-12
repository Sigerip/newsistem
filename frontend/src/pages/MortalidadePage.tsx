import { useEffect, useState } from 'react';
import { tabuaMortalidadeService, type TabuaMortalidade } from '@/lib/services';

function MeuComponente() {
  const [dados, setDados] = useState<TabuaMortalidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const resultado = await tabuaMortalidadeService.getAll({
          ano_inicio: 2020,
          ano_fim: 2020,
          local: 'Brasil',
          sexo: 'Ambos',
          limit: 100
        });
        setDados(resultado);
      } catch (err) {
        setError('Erro ao carregar dados');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>Faixa Etária</th>
          <th>Expectativa de Vida (ex)</th>
          <th>nqx</th>
        </tr>
      </thead>
      <tbody>
        {dados.map((item) => (
          <tr key={item.id}>
            <td>{item.faixa_etaria}</td>
            <td>{item.ex?.toFixed(2)}</td>
            <td>{item.nqx?.toFixed(6)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default MeuComponente;
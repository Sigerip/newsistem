import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Loader2 } from "lucide-react";
import { tabuaMortalidadeService, type TabuaMortalidade } from "@/lib/services";
import MortalidadeD3Chart from "@/components/charts/MortalidadeD3Chart";
import Mortalidade2 from "@/components/charts/Mortalidade2";
import DownloadButton from "@/components/DownloadButton";

const DadosMortalidade = () => {
  const [dados, setDados] = useState<TabuaMortalidade[]>([]);
  const [dadosgrafico2, setDadosgrafico2] = useState<TabuaMortalidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); // Loading sutil para atualizações
  const [error, setError] = useState<string | null>(null);
  const [ano, setAno] = useState(2000);
  //const [anoFim, setAnoFim] = useState(2023);
  const [local, setLocal] = useState<string>("Brasil");
  const [local2, setLocal2] = useState<string>("Brasil");
  const [faixa, setFaixa] = useState<string>("0");
  const [locaisDisponiveis, setLocaisDisponiveis] = useState<string[]>([]);
  const [faixasDisponiveis, setFaixasDisponiveis] = useState<string[]>([]);

  // Função para buscar todos os dados (sem filtros, para download completo)
  const fetchAllData = useCallback(async (): Promise<TabuaMortalidade[]> => {
    const resultado = await tabuaMortalidadeService.getAll({
      limit: 10000, // Limite alto para pegar todos os dados
    });
    return resultado;
  }, []);

  const carregarDados = useCallback(async () => {
    // Se já tem dados, usa loading sutil; senão, loading completo
    if (dados.length > 0) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const resultado = await tabuaMortalidadeService.getAll({
        ano_inicio: ano,
        ano_fim: ano,
        local: local,
        limit: 1000,
      });
      setDados(resultado);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar dados";
      setError(message);
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [local, ano, dados.length]);//anoInicio, anoFim,

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);


  const carregarDados2 = useCallback(async () => {
    console.log("Enviando faixa:", faixa);
    // Se já tem dados, usa loading sutil; senão, loading completo
    if (dadosgrafico2.length > 0) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const resultado = await tabuaMortalidadeService.getAll({
        faixa_etaria: faixa,
        local: local2,
        limit: 1000,
      });
      setDadosgrafico2(resultado);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar dados";
      setError(message);
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [local2, faixa, dadosgrafico2.length]);

  useEffect(() => {
    carregarDados2();
  }, [carregarDados2]);

  useEffect(() => {
    const carregarListaDeLocais = async () => {
      try {
        // Buscamos dados sem filtro de local para descobrir quais existem
        // Nota: Idealmente sua API teria um endpoint /locais, mas usaremos o getAll
        const resultado = await tabuaMortalidadeService.getAll({
          limit: 2000, // Um limite maior para garantir que pegamos todos os locais
          // Não passamos 'local' aqui propositalmente
        });
        
        const locaisUnicos = [...new Set(resultado.map((item) => item.local))].sort();
        setLocaisDisponiveis(locaisUnicos);
      } catch (err) {
        console.error("Erro ao carregar lista de locais", err);
      }
    };

    carregarListaDeLocais();
  }, []);

  useEffect(() => {
    const carregarfaixas = async () => {
      try {
        // Buscamos dados sem filtro de local para descobrir quais existem
        // Nota: Idealmente sua API teria um endpoint /locais, mas usaremos o getAll
        const resultado = await tabuaMortalidadeService.getAll({
          limit: 2000, // Um limite maior para garantir que pegamos todos os locais
          // Não passamos 'local' aqui propositalmente
        });
        
        const faixasUnicas = [...new Set(resultado.map((item) => item.faixa_etaria))].sort();
        setFaixasDisponiveis(faixasUnicas);
      } catch (err) {
        console.error("Erro ao carregar lista de faixas", err);
      }
    };

    carregarfaixas();
  }, []);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary mb-4">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Dados de Mortalidade</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Análise das taxas centrais de mortalidade por faixa etária
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Filtros
                {isRefreshing && (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                )}
              </CardTitle>
              <CardDescription>Personalize a visualização dos dados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium mb-2">Ano</label>
                  <select
                    value={ano}
                    onChange={(e) => setAno(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-md"
                    disabled={isRefreshing}
                  >
                    {/* Gera opções de 2000 a 2023 */}
                    {Array.from({ length: 24 }, (_, i) => 2000 + i).map((anoOpcao) => (
                      <option key={anoOpcao} value={anoOpcao}>
                        {anoOpcao}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Local</label>
                  <select
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    disabled={isRefreshing}
                  >
                    

                    {/* 3. Mapeia o array de opções únicas para criar as tags <option> */}
                    {locaisDisponiveis.map((opcao) => (
                      <option key={opcao} value={opcao}>
                        {opcao}
                      </option>
                    ))}
                  </select>
                </div>                
              </div>
            </CardContent>
          </Card>

          {loading && dados.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                <span className="text-muted-foreground">Carregando dados...</span>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="py-8">
                <div className="text-center">
                  <p className="text-red-600 font-semibold mb-2">Erro ao carregar dados</p>
                  <p className="text-red-500 text-sm">{error}</p>
                  <button
                    onClick={carregarDados}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Tentar novamente
                  </button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="grafico" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="grafico">Gráfico</TabsTrigger>
                <TabsTrigger value="tabela">Tabela</TabsTrigger>
              </TabsList>

              <TabsContent value="tabela" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                      <CardTitle>Tabua de Mortalidade</CardTitle>
                      <CardDescription>{dados.length} registros filtrados</CardDescription>
                    </div>
                    <DownloadButton 
                      dados={dados}
                      filename={`tabua_mortalidade_${ano}_${local}`}
                      fetchAllData={fetchAllData}
                      disabled={isRefreshing}
                    />
                  </CardHeader>
                  <CardContent className={`transition-opacity duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}>
                    {dados.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y">
                          <thead>
                            <tr className="bg-muted/50">
                              <th className="px-4 py-3 text-left text-sm font-medium">Ano</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Faixa</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Local</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Sexo</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">nMx</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">ex</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {dados.slice(0, 100).map((item) => (
                              <tr key={item.id} className="hover:bg-muted/50">
                                <td className="px-4 py-2 text-sm">{item.ano}</td>
                                <td className="px-4 py-2 text-sm">{item.faixa_etaria}</td>
                                <td className="px-4 py-2 text-sm">{item.local}</td>
                                <td className="px-4 py-2 text-sm">{item.sexo}</td>
                                <td className="px-4 py-2 text-sm font-mono">{item.nMx?.toFixed(6)}</td>
                                <td className="px-4 py-2 text-sm font-mono">{item.ex?.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {dados.length > 100 && (
                          <p className="text-sm text-muted-foreground mt-4 text-center">
                            Mostrando 100 de {dados.length} registros
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center bg-muted/30 rounded-lg">
                        <p className="text-muted-foreground">Nenhum dado disponivel</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="grafico" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Curva de Mortalidade</CardTitle>
                    <CardDescription>
                      Visualização da taxa central de mortalidade (nMx) em escala logarítmica por faixa etária
                      {dados.length > 0 && ` - ${dados[0]?.ano} | ${dados[0]?.local}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className={`transition-opacity duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}>
                    <MortalidadeD3Chart dados={dados} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
        {/* outro gráfico */}
        <div className="max-w-6xl mx-auto mt-12">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Filtros
                {isRefreshing && (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                )}
              </CardTitle>
              <CardDescription>Personalize a visualização dos dados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium mb-2">Local</label>
                  <select
                    value={local2}
                    onChange={(e) => setLocal2(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    disabled={isRefreshing}
                  >
                    

                    {/* 3. Mapeia o array de opções únicas para criar as tags <option> */}
                    {locaisDisponiveis.map((opcao) => (
                      <option key={opcao} value={opcao}>
                        {opcao}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Faixa</label>
                  <select
                    value={faixa}
                    onChange={(e) => setFaixa(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    disabled={isRefreshing}
                  >
                    {/* Placeholder para futura implementação de filtro por faixa etária */}
                    {faixasDisponiveis.map((faixa) => (
                      <option key={faixa} value={faixa}>
                        {faixa}
                      </option>
                    ))}
                  </select>
                </div>
                
              </div>
            </CardContent>
          </Card>

          {loading && dados.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                <span className="text-muted-foreground">Carregando dados...</span>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="py-8">
                <div className="text-center">
                  <p className="text-red-600 font-semibold mb-2">Erro ao carregar dados</p>
                  <p className="text-red-500 text-sm">{error}</p>
                  <button
                    onClick={carregarDados}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Tentar novamente
                  </button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="grafico" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="grafico">Gráfico</TabsTrigger>
                <TabsTrigger value="tabela">Tabela</TabsTrigger>
              </TabsList>

              <TabsContent value="tabela" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                      <CardTitle>Tabua de Mortalidade</CardTitle>
                      <CardDescription>{dadosgrafico2.length} registros filtrados</CardDescription>
                    </div>
                    <DownloadButton 
                      dados={dadosgrafico2}
                      filename={`tabua_mortalidade_${ano}_${local}`}
                      fetchAllData={fetchAllData}
                      disabled={isRefreshing}
                    />
                  </CardHeader>
                  <CardContent className={`transition-opacity duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}>
                    {dadosgrafico2.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y">
                          <thead>
                            <tr className="bg-muted/50">
                              <th className="px-4 py-3 text-left text-sm font-medium">Ano</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Faixa</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Local</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Sexo</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">nMx</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">ex</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {dadosgrafico2.slice(0, 100).map((item) => (
                              <tr key={item.id} className="hover:bg-muted/50">
                                <td className="px-4 py-2 text-sm">{item.ano}</td>
                                <td className="px-4 py-2 text-sm">{item.faixa_etaria}</td>
                                <td className="px-4 py-2 text-sm">{item.local}</td>
                                <td className="px-4 py-2 text-sm">{item.sexo}</td>
                                <td className="px-4 py-2 text-sm font-mono">{item.nMx?.toFixed(6)}</td>
                                <td className="px-4 py-2 text-sm font-mono">{item.ex?.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {dadosgrafico2.length > 100 && (
                          <p className="text-sm text-muted-foreground mt-4 text-center">
                            Mostrando 100 de {dadosgrafico2.length} registros
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center bg-muted/30 rounded-lg">
                        <p className="text-muted-foreground">Nenhum dado disponivel</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="grafico" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Taxa Central de Mortalidade</CardTitle>
                    <CardDescription>
                      Visualização da taxa central de mortalidade (nMx) em escala logarítmica por ano
                      {dadosgrafico2.length > 0 && ` - ${dadosgrafico2[0]?.faixa_etaria} | ${dadosgrafico2[0]?.local}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className={`transition-opacity duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}>
                    <Mortalidade2 dados={dadosgrafico2}/>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default DadosMortalidade;

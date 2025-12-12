"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { csv } from 'd3-fetch'; // Usamos d3-fetch apenas para carregar o CSV, é leve.
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { columns, TabuaData } from './tabua-columns'; // Importando o tipo também
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// Definição dos tipos de dados
interface ITaxasData {
  Ano: number;
  local: string;
  faixa_etaria: string;
  ambos: number;
  masculino: number;
  feminino: number;
}

interface TaxaMortalidadeChartProps {
  initialData?: ITaxasData[];
}

export function TaxaMortalidadeChart({ initialData = [] }: TaxaMortalidadeChartProps) {
  const [taxasData, setTaxasData] = useState<ITaxasData[]>(initialData);
  const [tabuaCompleta, setTabuaCompleta] = useState<TabuaData[]>([]);
  
  const [regioes, setRegioes] = useState<string[]>([]);
  const [faixasEtarias, setFaixasEtarias] = useState<string[]>([]);
  const [selectedRegiao, setSelectedRegiao] = useState('Brasil');
  const [selectedFaixa, setSelectedFaixa] = useState('0');

  // Atualiza quando initialData mudar
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setTaxasData(initialData);
      
      const uniqueRegioes = Array.from(new Set(initialData.map(d => d.local))).sort();
      const uniqueFaixas = Array.from(new Set(initialData.map(d => d.faixa_etaria))).sort();
      
      setRegioes(uniqueRegioes);
      setFaixasEtarias(uniqueFaixas);
      
      if (uniqueRegioes.length > 0 && !uniqueRegioes.includes(selectedRegiao)) {
        setSelectedRegiao(uniqueRegioes[0]);
      }
      if (uniqueFaixas.length > 0 && !uniqueFaixas.includes(selectedFaixa)) {
        setSelectedFaixa(uniqueFaixas[0]);
      }
    }
  }, [initialData]);

  // Carrega os dados na montagem do componente (fallback para CSV)
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      // Se já tem dados da API, não carrega do CSV
      return;
    }
    
    const fetchData = async () => {
      const [taxasResponse, tabuaResponse] = await Promise.all([
        csv('/dados/taxa_mortalidade.csv'),
        csv('/dados/tabua_concatenada.csv')
      ]);

      const parsedTaxas = taxasResponse.map(d => ({
        ...d,
        Ano: +d.Ano!,
        ambos: +d.ambos!,
        masculino: +d.masculino!,
        feminino: +d.feminino!,
      })) as ITaxasData[];
      
      setTaxasData(parsedTaxas);
      setTabuaCompleta(tabuaResponse as TabuaData[]);

      const uniqueRegioes = Array.from(new Set(parsedTaxas.map(d => d.local))).sort();
      const uniqueFaixas = Array.from(new Set(parsedTaxas.map(d => d.faixa_etaria))).sort((a,b) => parseInt(a) - parseInt(b)); // Ordenar numericamente
      
      setRegioes(uniqueRegioes);
      setFaixasEtarias(uniqueFaixas);
    };
    fetchData();
  }, [initialData]);

  // Processa os dados para o gráfico usando useMemo para performance
  const chartData = useMemo(() => {
    return taxasData
      .filter(d => d.local === selectedRegiao && d.faixa_etaria === selectedFaixa)
      .map(d => ({
        Ano: d.Ano,
        Ambos: Math.log(d.ambos),
        Feminino: Math.log(d.feminino),
        Masculino: Math.log(d.masculino),
      }))
      .sort((a, b) => a.Ano - b.Ano);
  }, [taxasData, selectedRegiao, selectedFaixa]);

  const handleDownload = () => { /* ... sua função de download ... */ };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Taxa Central de Mortalidade por Faixa Etária</CardTitle>
        <CardDescription>Período: 2000-2023. Fonte: Nossos Dados.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="grafico" className="w-full">
          <TabsList>
            <TabsTrigger value="grafico">Gráfico</TabsTrigger>
            <TabsTrigger value="tabela">Tabela</TabsTrigger>
          </TabsList>
          <TabsContent value="grafico" className="pt-4">
            <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 border rounded-lg justify-center items-center">
              <div className="flex flex-col items-center">
                <label className="text-sm font-medium mb-1">Local</label>
                <Select value={selectedRegiao} onValueChange={setSelectedRegiao}>
                  <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {regioes.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-center">
                <label className="text-sm font-medium mb-1">Faixa Etária</label>
                <Select value={selectedFaixa} onValueChange={setSelectedFaixa}>
                  <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {faixasEtarias.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="w-full h-[500px]">
              <ChartContainer config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis 
                      dataKey="Ano" 
                      tickLine={false} 
                      axisLine={false} 
                      tickMargin={8} 
                      padding={{ left: 20, right: 20 }}
                      label={{ value: 'Ano', position: 'insideBottom', offset: -25 }}
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tickMargin={8}
                      label={{ value: 'log(Mx)', angle: -90, position: 'insideLeft', offset: -5 }}
                      tickFormatter={(value) => value.toFixed(2)}
                    />
                    <ChartTooltip 
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Legend verticalAlign="top" height={50} />
                    <Line type="monotone" dataKey="Ambos" stroke="var(--color-ambos, steelblue)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Masculino" stroke="var(--color-masculino, darkorange)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Feminino" stroke="var(--color-feminino, green)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>
          <TabsContent value="tabela">
            {/* ... seu componente DataTable continua aqui ... */}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
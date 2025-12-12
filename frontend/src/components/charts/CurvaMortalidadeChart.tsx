"use client";

import { useState, useMemo } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

interface ITabuaData {
  Ano: number;
  Local: string;
  sexo: "Masculino" | "Feminino" | "Ambos";
  faixa_etaria: string;
  nMx: number;
}

const faixaEtariaOrder = ['0', '1-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80-84', '85-89', '90+'];

interface CurvaMortalidadeChartProps {
  initialData: ITabuaData[];
}

export function CurvaMortalidadeChart({ initialData }: CurvaMortalidadeChartProps) {
  const { regioes, anos } = useMemo(() => {
    if (!initialData || initialData.length === 0) {
      return { regioes: ['Brasil'], anos: [2023] };
    }
    const uniqueRegioes = Array.from(new Set(initialData.map(d => d.Local))).sort();
    const uniqueAnos = Array.from(new Set(initialData.map(d => d.Ano))).sort((a,b) => b-a);
    return { regioes: uniqueRegioes, anos: uniqueAnos };
  }, [initialData]);

  const [selectedRegiao, setSelectedRegiao] = useState(regioes[0] || 'Brasil');
  const [selectedAno, setSelectedAno] = useState(anos[0] || 2023);

  const chartData = useMemo(() => {
    if (!initialData || initialData.length === 0) return [];
    const filtered = initialData.filter(d => d.Local === selectedRegiao && d.Ano === selectedAno);
    const dataByFaixa = new Map();
    filtered.forEach(item => {
      if (!dataByFaixa.has(item.faixa_etaria)) {
        dataByFaixa.set(item.faixa_etaria, { faixa_etaria: item.faixa_etaria, Masculino: null, Feminino: null, Ambos: null });
      }
      const entry = dataByFaixa.get(item.faixa_etaria);
      const logValue = item.nMx > 0 ? Math.log(item.nMx) : null;
      if (item.sexo === 'Masculino') entry.Masculino = logValue;
      if (item.sexo === 'Feminino') entry.Feminino = logValue;
      if (item.sexo === 'Ambos') entry.Ambos = logValue;
    });
    return faixaEtariaOrder.map(faixa => dataByFaixa.get(faixa)).filter(Boolean);
  }, [initialData, selectedRegiao, selectedAno]);
  
  const tableData = useMemo(() => {
    if (!initialData || initialData.length === 0) return [];
    return initialData.filter(d => d.Local === selectedRegiao && d.Ano === selectedAno).sort((a, b) => {
      const indexA = faixaEtariaOrder.indexOf(a.faixa_etaria);
      const indexB = faixaEtariaOrder.indexOf(b.faixa_etaria);
      return indexA - indexB;
    });
  }, [initialData, selectedRegiao, selectedAno]);

  const handleDownload = () => {
    if (!tableData || tableData.length === 0) return;
    const headers = ['Faixa Etária', 'Sexo', 'nMx', 'ln(nMx)'];
    const csvContent = [headers.join(','), ...tableData.map(row => [row.faixa_etaria, row.sexo, row.nMx.toFixed(6), Math.log(row.nMx).toFixed(6)].join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `curva_mortalidade_${selectedRegiao}_${selectedAno}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!initialData || initialData.length === 0) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground"><p>Nenhum dado disponível</p></div>;
  }

  return (
    <div className="space-y-6">
      <Card><CardContent className="pt-6"><div className="flex flex-col md:flex-row gap-4 items-end"><div className="flex items-center gap-2 text-muted-foreground"><Filter className="h-4 w-4" /><span className="text-sm font-medium">Filtros</span></div><div className="flex flex-col gap-1.5 flex-1"><label className="text-sm font-medium">Local</label><Select value={selectedRegiao} onValueChange={setSelectedRegiao}><SelectTrigger className="w-full md:w-[240px]"><SelectValue /></SelectTrigger><SelectContent>{regioes.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></div><div className="flex flex-col gap-1.5 flex-1"><label className="text-sm font-medium">Ano</label><Select value={selectedAno.toString()} onValueChange={(v) => setSelectedAno(parseInt(v))}><SelectTrigger className="w-full md:w-[160px]"><SelectValue /></SelectTrigger><SelectContent>{anos.map(a => <SelectItem key={a} value={a.toString()}>{a}</SelectItem>)}</SelectContent></Select></div><Button onClick={handleDownload} variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Exportar</Button></div></CardContent></Card>
      <Tabs defaultValue="grafico" className="w-full"><TabsList className="grid w-full grid-cols-2 max-w-md"><TabsTrigger value="grafico">Gráfico</TabsTrigger><TabsTrigger value="tabela">Tabela</TabsTrigger></TabsList><TabsContent value="grafico" className="space-y-4 mt-6"><ChartContainer config={{ Masculino: { label: "Masculino", color: "#2563eb" }, Feminino: { label: "Feminino", color: "#db2777" }, Ambos: { label: "Ambos", color: "#16a34a" } }} className="h-[400px] w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}><CartesianGrid strokeDasharray="3 3" className="stroke-muted" /><XAxis dataKey="faixa_etaria" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} label={{ value: 'Faixa Etária', position: 'insideBottom', offset: -10 }} /><YAxis label={{ value: 'ln(nMx)', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 12 }} /><Tooltip content={<ChartTooltipContent />} /><Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" /><Line type="monotone" dataKey="Masculino" stroke="#2563eb" strokeWidth={2} dot={{ fill: '#2563eb', r: 3 }} activeDot={{ r: 5 }} connectNulls /><Line type="monotone" dataKey="Feminino" stroke="#db2777" strokeWidth={2} dot={{ fill: '#db2777', r: 3 }} activeDot={{ r: 5 }} connectNulls /><Line type="monotone" dataKey="Ambos" stroke="#16a34a" strokeWidth={2} dot={{ fill: '#16a34a', r: 3 }} activeDot={{ r: 5 }} connectNulls /></LineChart></ResponsiveContainer></ChartContainer><div className="text-sm text-muted-foreground text-center">Exibindo {chartData.length} faixas etárias para {selectedRegiao} em {selectedAno}</div></TabsContent><TabsContent value="tabela" className="mt-6"><Card><CardContent className="p-0"><div className="rounded-md border max-h-[500px] overflow-auto"><Table><TableHeader className="sticky top-0 bg-background"><TableRow><TableHead className="w-[150px]">Faixa Etária</TableHead><TableHead className="w-[120px]">Sexo</TableHead><TableHead className="text-right">nMx</TableHead><TableHead className="text-right">ln(nMx)</TableHead></TableRow></TableHeader><TableBody>{tableData.length === 0 ? <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Nenhum dado encontrado</TableCell></TableRow> : tableData.map((row, idx) => <TableRow key={idx}><TableCell className="font-medium">{row.faixa_etaria}</TableCell><TableCell>{row.sexo}</TableCell><TableCell className="text-right font-mono text-sm">{row.nMx.toFixed(6)}</TableCell><TableCell className="text-right font-mono text-sm">{Math.log(row.nMx).toFixed(6)}</TableCell></TableRow>)}</TableBody></Table></div><div className="p-4 text-sm text-muted-foreground border-t">Total: {tableData.length} registros</div></CardContent></Card></TabsContent></Tabs>
    </div>
  );
}

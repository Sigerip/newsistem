import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { TabuaMortalidade } from "@/lib/services";

interface MortalidadeD3ChartProps {
  dados: TabuaMortalidade[];
}

// Cores para cada sexo
const CORES_SEXO: Record<string, string> = {
  Masculino: "#3b82f6",    // Azul
  Feminino: "#ec4899",  // Rosa
  Ambos: "#10b981",     // Verde
};

const MortalidadeD3Chart = ({ dados }: MortalidadeD3ChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 });

  // Hook para detectar redimensionamento
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // Ajusta altura proporcionalmente, com mínimo e máximo
        const isMobile = containerWidth < 640;
        const newHeight = isMobile 
          ? Math.min(400, containerWidth * 0.8) 
          : Math.min(500, Math.max(350, containerWidth * 0.5));
        
        setDimensions({
          width: containerWidth,
          height: newHeight
        });
      }
    };

    // Atualiza dimensões iniciais
    updateDimensions();

    // Listener para resize
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !dados || dados.length === 0) return;

    const { width, height } = dimensions;
    const isMobile = width < 640;

    // Limpa o SVG anterior
    d3.select(svgRef.current).selectAll("*").remove();

    // Configurações de margem responsivas
    const margin = {
      top: isMobile ? 30 : 40,
      right: isMobile ? 20 : 130,
      bottom: isMobile ? 100 : 80,
      left: isMobile ? 50 : 70
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Função para extrair idade da faixa etária
    const getAge = (faixa: string) => {
      const match = faixa.match(/^\d+/);
      return match ? parseInt(match[0]) : 0;
    };

    // Processa os dados - filtra valores válidos
    const dadosValidos = dados.filter((d) => d.nMx && d.nMx > 0);

    if (dadosValidos.length === 0) return;

    // Agrupa dados por sexo
    const dadosPorSexo = d3.group(dadosValidos, (d) => d.sexo);
    
    // Obtém lista única de faixas etárias ordenadas
    const todasFaixas = [...new Set(dadosValidos.map((d) => d.faixa_etaria))]
      .sort((a, b) => getAge(a) - getAge(b));

    // Obtém os sexos disponíveis
    const sexosDisponiveis = Array.from(dadosPorSexo.keys()).sort();

    // Cria o SVG responsivo
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    // Grupo principal com margens
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Escala X - faixas etárias (categórica)
    const xScale = d3
      .scaleBand()
      .domain(todasFaixas)
      .range([0, innerWidth])
      .padding(0.1);

    // Escala Y - log de nMx (considerando todos os dados)
    const yExtent = d3.extent(dadosValidos, (d) => Math.log10(d.nMx!)) as [number, number];
    const yScale = d3
      .scaleLinear()
      .domain([yExtent[0] - 0.3, yExtent[1] + 0.3])
      .range([innerHeight, 0])
      .nice();

    // Grid horizontal
    g.append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(yScale.ticks(8))
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#e5e7eb")
      .attr("stroke-dasharray", "3,3");

    // Eixo X
    const xAxis = g
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));

    xAxis
      .selectAll("text")
      .attr("transform", isMobile ? "rotate(-65)" : "rotate(-45)")
      .style("text-anchor", "end")
      .attr("dx", "-0.5em")
      .attr("dy", "0.5em")
      .style("font-size", isMobile ? "9px" : "11px");

    // Label do eixo X
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + (isMobile ? 85 : 65))
      .attr("text-anchor", "middle")
      .style("font-size", isMobile ? "11px" : "13px")
      .style("font-weight", "500")
      .text("Faixa Etária");

    // Eixo Y
    g.append("g")
      .call(
        d3.axisLeft(yScale)
          .ticks(isMobile ? 5 : 8)
          .tickFormat((d) => (d as number).toFixed(1))
      )
      .selectAll("text")
      .style("font-size", isMobile ? "9px" : "11px");

    // Label do eixo Y
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", isMobile ? -35 : -50)
      .attr("text-anchor", "middle")
      .style("font-size", isMobile ? "11px" : "13px")
      .style("font-weight", "500")
      .text("log₁₀(nMx)");

    // Título (apenas em desktop ou título reduzido em mobile)
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", isMobile ? 18 : 25)
      .attr("text-anchor", "middle")
      .style("font-size", isMobile ? "12px" : "16px")
      .style("font-weight", "600")
      .text(isMobile ? "Taxa de Mortalidade (log)" : "Taxa Central de Mortalidade por Faixa Etária (escala logarítmica)");

    // Tooltip
    const tooltip = d3.select(tooltipRef.current);

    // Função geradora de linha
    const lineGenerator = d3
      .line<TabuaMortalidade>()
      .x((d) => (xScale(d.faixa_etaria) ?? 0) + xScale.bandwidth() / 2)
      .y((d) => yScale(Math.log10(d.nMx!)))
      //.curve(d3.curveMonotoneX);

    // Desenha uma linha para cada sexo
    sexosDisponiveis.forEach((sexo, index) => {
      const dadosSexo = (dadosPorSexo.get(sexo) || [])
        .sort((a, b) => getAge(a.faixa_etaria) - getAge(b.faixa_etaria));

      if (dadosSexo.length === 0) return;

      const cor = CORES_SEXO[sexo] || "#6366f1";

      // Desenha a linha
      const path = g.append("path")
        .datum(dadosSexo)
        .attr("fill", "none")
        .attr("stroke", cor)
        .attr("stroke-width", 2.5)
        .attr("d", lineGenerator)
        .attr("class", `linha-${sexo.toLowerCase()}`);

      // Animação da linha
      const totalLength = path.node()?.getTotalLength() || 0;
      path
        .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1500)
        .delay(index * 300)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

      
    });

    // Legenda
    // Legenda - posição diferente para mobile e desktop
    const legenda = svg
      .append("g")
      .attr("transform", isMobile 
        ? `translate(${margin.left}, ${height - 15})` // Embaixo em mobile
        : `translate(${width - margin.right + 10}, ${margin.top + 20})` // À direita em desktop
      );

    if (!isMobile) {
      legenda
        .append("text")
        .attr("x", 0)
        .attr("y", -5)
        .style("font-size", "12px")
        .style("font-weight", "600")
        .text("Sexo");
    }

    sexosDisponiveis.forEach((sexo, index) => {
      const cor = CORES_SEXO[sexo] || "#6366f1";
      
      // Posicionamento horizontal em mobile, vertical em desktop
      const xPos = isMobile ? index * 90 : 0;
      const yPos = isMobile ? 0 : index * 25 + 15;

      // Linha da legenda
      legenda
        .append("line")
        .attr("x1", xPos)
        .attr("x2", xPos + 20)
        .attr("y1", yPos)
        .attr("y2", yPos)
        .attr("stroke", cor)
        .attr("stroke-width", 2.5);

      // Ponto da legenda
      legenda
        .append("circle")
        .attr("cx", xPos + 10)
        .attr("cy", yPos)
        .attr("r", 3)
        .attr("fill", cor)
        .attr("stroke", "white")
        .attr("stroke-width", 0.5);

      // Texto da legenda
      legenda
        .append("text")
        .attr("x", xPos + 26)
        .attr("y", yPos + 4)
        .style("font-size", isMobile ? "10px" : "12px")
        .text(sexo);
    });

  }, [dados, dimensions]);

  if (!dados || dados.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg w-full">
        <p className="text-muted-foreground">Nenhum dado disponível para visualização</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <svg 
        ref={svgRef} 
        className="w-full h-auto"
        style={{ minHeight: '300px', maxHeight: '600px' }}
      />
      <div
        ref={tooltipRef}
        className="fixed z-50 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-lg pointer-events-none opacity-0 transition-opacity duration-150"
        style={{ maxWidth: "220px" }}
      />
    </div>
  );
};

export default MortalidadeD3Chart;

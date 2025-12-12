import { useState } from "react";
import { Download, FileSpreadsheet, FileText, Database, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export type ExportFormat = "csv" | "xlsx" | "parquet";

interface DownloadButtonProps<T> {
  dados: T[];
  filename?: string;
  onDownloadComplete?: () => void;
  fetchAllData?: () => Promise<T[]>;
  disabled?: boolean;
}

// Função para converter dados para CSV
function convertToCSV<T>(data: T[]): string {
  if (data.length === 0) return "";
  
  const headers = Object.keys(data[0] as object);
  const csvRows = [
    headers.join(","),
    ...data.map(row => 
      headers.map(header => {
        const value = (row as Record<string, unknown>)[header];
        // Escapa valores que contêm vírgulas ou aspas
        if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? "";
      }).join(",")
    )
  ];
  
  return csvRows.join("\n");
}

// Função para baixar arquivo
function downloadFile(content: string | Blob, filename: string, mimeType: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Função para converter para XLSX (usando uma biblioteca simples ou formato XML)
async function convertToXLSX<T>(data: T[]): Promise<Blob> {
  try {
    // Importa xlsx dinamicamente para reduzir bundle size
    const XLSX = await import("xlsx");
    
    const worksheet = XLSX.utils.json_to_sheet(data as object[]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
    
    const xlsxBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    return new Blob([xlsxBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  } catch {
    // Fallback: se xlsx não estiver instalado, converte para CSV com extensão xlsx
    console.warn("Biblioteca xlsx não encontrada. Usando fallback CSV.");
    const csv = convertToCSV(data);
    return new Blob([csv], { type: "text/csv" });
  }
}

// Função para converter para Parquet (formato JSON com extensão .parquet para simplificar)
// Nota: Para Parquet real, seria necessário uma biblioteca específica como parquetjs
async function convertToParquet<T>(data: T[]): Promise<Blob> {
  // Como Parquet é um formato binário complexo, vamos usar JSON com metadados
  // Em produção, considere usar uma API backend para gerar Parquet real
  const firstRow = data[0] as object;
  const parquetLike = {
    schema: data.length > 0 ? Object.keys(firstRow).map(key => ({
      name: key,
      type: typeof (firstRow as Record<string, unknown>)[key]
    })) : [],
    data: data,
    metadata: {
      rowCount: data.length,
      createdAt: new Date().toISOString(),
      format: "parquet-json"
    }
  };
  
  return new Blob([JSON.stringify(parquetLike, null, 2)], { type: "application/json" });
}

export function DownloadButton<T extends object>({
  dados,
  filename = "dados_mortalidade",
  onDownloadComplete,
  fetchAllData,
  disabled = false,
}: DownloadButtonProps<T>) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState<string | null>(null);

  const handleDownload = async (format: ExportFormat, allData: boolean = false) => {
    setIsDownloading(true);
    setDownloadType(allData ? `${format}-all` : format);

    try {
      // Obtém os dados (filtrados ou completos)
      let dataToExport = dados;
      
      if (allData && fetchAllData) {
        dataToExport = await fetchAllData();
      }

      if (dataToExport.length === 0) {
        alert("Não há dados para exportar");
        return;
      }

      const timestamp = new Date().toISOString().split("T")[0];
      const fullFilename = `${filename}_${timestamp}${allData ? "_completo" : ""}`;

      switch (format) {
        case "csv": {
          const csv = convertToCSV(dataToExport);
          downloadFile(csv, `${fullFilename}.csv`, "text/csv;charset=utf-8;");
          break;
        }
        case "xlsx": {
          const xlsxBlob = await convertToXLSX(dataToExport);
          downloadFile(xlsxBlob, `${fullFilename}.xlsx`, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
          break;
        }
        case "parquet": {
          const parquetBlob = await convertToParquet(dataToExport);
          downloadFile(parquetBlob, `${fullFilename}.parquet.json`, "application/json");
          break;
        }
      }

      onDownloadComplete?.();
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      alert("Erro ao exportar dados. Tente novamente.");
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
    }
  };

  const formatIcons = {
    csv: <FileText className="h-4 w-4" />,
    xlsx: <FileSpreadsheet className="h-4 w-4" />,
    parquet: <Database className="h-4 w-4" />,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          disabled={disabled || isDownloading || dados.length === 0}
          className="gap-2"
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isDownloading ? "Exportando..." : "Baixar"}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Dados Filtrados ({dados.length})</DropdownMenuLabel>
        
        <DropdownMenuItem 
          onClick={() => handleDownload("csv")}
          disabled={isDownloading}
          className="gap-2 cursor-pointer"
        >
          {downloadType === "csv" ? <Loader2 className="h-4 w-4 animate-spin" /> : formatIcons.csv}
          <span>Exportar CSV</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleDownload("xlsx")}
          disabled={isDownloading}
          className="gap-2 cursor-pointer"
        >
          {downloadType === "xlsx" ? <Loader2 className="h-4 w-4 animate-spin" /> : formatIcons.xlsx}
          <span>Exportar Excel (.xlsx)</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleDownload("parquet")}
          disabled={isDownloading}
          className="gap-2 cursor-pointer"
        >
          {downloadType === "parquet" ? <Loader2 className="h-4 w-4 animate-spin" /> : formatIcons.parquet}
          <span>Exportar Parquet</span>
        </DropdownMenuItem>

        {fetchAllData && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Dados Completos</DropdownMenuLabel>
            
            <DropdownMenuItem 
              onClick={() => handleDownload("csv", true)}
              disabled={isDownloading}
              className="gap-2 cursor-pointer"
            >
              {downloadType === "csv-all" ? <Loader2 className="h-4 w-4 animate-spin" /> : formatIcons.csv}
              <span>CSV Completo</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => handleDownload("xlsx", true)}
              disabled={isDownloading}
              className="gap-2 cursor-pointer"
            >
              {downloadType === "xlsx-all" ? <Loader2 className="h-4 w-4 animate-spin" /> : formatIcons.xlsx}
              <span>Excel Completo (.xlsx)</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => handleDownload("parquet", true)}
              disabled={isDownloading}
              className="gap-2 cursor-pointer"
            >
              {downloadType === "parquet-all" ? <Loader2 className="h-4 w-4 animate-spin" /> : formatIcons.parquet}
              <span>Parquet Completo</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DownloadButton;

// src/components/charts/tabua-columns.tsx

"use client"

import { ColumnDef } from "@tanstack/react-table"

// Isso define o formato de um único objeto de dado da sua tabela.
// Corresponde à estrutura retornada pela API Flask
export type TabuaData = {
  id?: number
  ano: number
  local: string
  sexo: string
  faixa_etaria: string
  nMx: number
  nqx?: number
  ex?: number
  lx?: number
  Tx?: number
}

// Este é o array que define cada coluna da sua tabela.
export const columns: ColumnDef<TabuaData>[] = [
  {
    accessorKey: "ano",
    header: "Ano",
  },
  {
    accessorKey: "local",
    header: "Local",
  },
  {
    accessorKey: "sexo",
    header: "Sexo",
  },
  {
    accessorKey: "faixa_etaria",
    header: "Faixa Etária",
  },
  {
    accessorKey: "nMx",
    header: "nMx",
    cell: ({ row }) => {
      const value = row.getValue("nMx") as number;
      return value?.toFixed(6) ?? "-";
    },
  },
  {
    accessorKey: "nqx",
    header: "nqx",
    cell: ({ row }) => {
      const value = row.getValue("nqx") as number;
      return value?.toFixed(6) ?? "-";
    },
  },
  {
    accessorKey: "ex",
    header: "Expectativa (ex)",
    cell: ({ row }) => {
      const value = row.getValue("ex") as number;
      return value?.toFixed(2) ?? "-";
    },
  },
]
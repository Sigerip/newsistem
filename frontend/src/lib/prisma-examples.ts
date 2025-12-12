// Exemplo de uso do Prisma Client para consultar dados de mortalidade

import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

// =======================
// EXEMPLOS DE CONSULTAS
// =======================

// 1. Buscar tábua de mortalidade para um ano específico
export async function getTabuaMortalidadePorAno(ano: number, local: string = 'Brasil', sexo: string = 'Ambos') {
  return await prisma.tabuaMortalidade.findMany({
    where: {
      ano,
      local,
      sexo
    },
    orderBy: {
      faixaEtaria: 'asc'
    }
  })
}

// 2. Buscar taxa de mortalidade por período
export async function getTaxaMortalidadePorPeriodo(anoInicio: number, anoFim: number, local: string = 'Brasil') {
  return await prisma.taxaMortalidade.findMany({
    where: {
      ano: {
        gte: anoInicio,
        lte: anoFim
      },
      local
    },
    orderBy: [
      { ano: 'asc' },
      { faixaEtaria: 'asc' }
    ]
  })
}

// 3. Buscar projeções IBGE
export async function getProjecoesIBGE(ano: number, regiao: string = 'Brasil', sexo?: string) {
  return await prisma.projecoesIBGE.findMany({
    where: {
      ano,
      regiao,
      ...(sexo && { sexo })
    },
    orderBy: {
      idade: 'asc'
    }
  })
}

// 4. Buscar previsões ARIMA-ETS para um período futuro
export async function getPrevisoesArimaEts(
  anoInicio: number,
  anoFim: number,
  local: string = 'Brasil',
  sexo?: string
) {
  return await prisma.previsoesArimaEts.findMany({
    where: {
      ano: {
        gte: anoInicio,
        lte: anoFim
      },
      local,
      ...(sexo && { sexo })
    },
    orderBy: [
      { ano: 'asc' },
      { idade: 'asc' }
    ]
  })
}

// 5. Buscar métricas de desempenho dos modelos
export async function getMetricasModelos(local: string = 'Brasil', sexo?: string) {
  const arimaEts = await prisma.metricasArimaEts.findMany({
    where: { local, ...(sexo && { sexo }) }
  })

  const combinado = await prisma.metricasCombinado.findMany({
    where: { local, ...(sexo && { sexo }) }
  })

  return {
    arimaEts,
    combinado
  }
}

// 6. Buscar previsões Lee-Carter
export async function getPrevisoesLeeCarter(
  anoInicio: number,
  anoFim: number,
  regiao: string = 'Brasil',
  taxa?: string
) {
  return await prisma.previsoesLeeCarter.findMany({
    where: {
      ano: {
        gte: anoInicio,
        lte: anoFim
      },
      regiao,
      ...(taxa && { taxa })
    },
    orderBy: [
      { ano: 'asc' },
      { faixaEtaria: 'asc' }
    ]
  })
}

// 7. Buscar mortalidade infantil por localidade
export async function getMortalidadeInfantil(localidade?: string) {
  return await prisma.mortalidadeInfantil.findMany({
    where: localidade ? { localidade: { contains: localidade } } : undefined,
    orderBy: {
      localidade: 'asc'
    }
  })
}

// 8. Comparar expectativa de vida entre sexos
export async function compararExpectativaVida(ano: number, local: string = 'Brasil') {
  const masculino = await prisma.tabuaMortalidade.findFirst({
    where: {
      ano,
      local,
      sexo: 'Homens',
      faixaEtaria: '0'
    },
    select: {
      ex: true
    }
  })

  const feminino = await prisma.tabuaMortalidade.findFirst({
    where: {
      ano,
      local,
      sexo: 'Mulheres',
      faixaEtaria: '0'
    },
    select: {
      ex: true
    }
  })

  return {
    masculino: masculino?.ex,
    feminino: feminino?.ex,
    diferenca: feminino && masculino ? feminino.ex - masculino.ex : null
  }
}

// 9. Buscar tendência de mortalidade para uma faixa etária específica
export async function getTendenciaMortalidade(
  faixaEtaria: string,
  anoInicio: number,
  anoFim: number,
  local: string = 'Brasil',
  sexo: string = 'Ambos'
) {
  return await prisma.tabuaMortalidade.findMany({
    where: {
      faixaEtaria,
      ano: {
        gte: anoInicio,
        lte: anoFim
      },
      local,
      sexo
    },
    select: {
      ano: true,
      nMx: true,
      nqx: true,
      ex: true
    },
    orderBy: {
      ano: 'asc'
    }
  })
}

// 10. Buscar dados agregados por região
export async function getDadosAgregadosPorRegiao(ano: number) {
  return await prisma.projecoesIBGE.groupBy({
    by: ['regiao'],
    where: {
      ano,
      idade: 0
    },
    _avg: {
      ex: true,
      nMx: true
    },
    orderBy: {
      regiao: 'asc'
    }
  })
}

// 11. Buscar previsões com intervalos de confiança
export async function getPrevisoesComIntervalo(
  ano: number,
  local: string = 'Brasil',
  sexo?: string
) {
  return await prisma.previsoesArimaEts.findMany({
    where: {
      ano,
      local,
      ...(sexo && { sexo })
    },
    select: {
      idade: true,
      previsao: true,
      lower95: true,
      upper95: true
    },
    orderBy: {
      idade: 'asc'
    }
  })
}

// 12. Buscar evolução da mortalidade infantil
export async function getEvolucaoMortalidadeInfantil(localidade: string) {
  const dados = await prisma.mortalidadeInfantil.findFirst({
    where: {
      localidade: {
        contains: localidade
      }
    }
  })

  if (!dados) return null

  // Converter colunas de anos em array
  const anos = []
  for (let ano = 2000; ano <= 2023; ano++) {
    const campo = `ano${ano}` as keyof typeof dados
    if (dados[campo] !== null && dados[campo] !== undefined) {
      anos.push({
        ano,
        taxa: dados[campo] as number
      })
    }
  }

  return {
    localidade: dados.localidade,
    evolucao: anos
  }
}

// =======================
// EXEMPLOS DE USO
// =======================

async function exemplos() {
  try {
    // Exemplo 1: Tábua de mortalidade de 2020
    console.log('=== Tábua de Mortalidade 2020 ===')
    const tabua2020 = await getTabuaMortalidadePorAno(2020)
    console.log(`${tabua2020.length} registros encontrados`)

    // Exemplo 2: Previsões ARIMA-ETS para 2024-2030
    console.log('\n=== Previsões ARIMA-ETS 2024-2030 ===')
    const previsoes = await getPrevisoesArimaEts(2024, 2030)
    console.log(`${previsoes.length} previsões encontradas`)

    // Exemplo 3: Comparar expectativa de vida entre sexos
    console.log('\n=== Expectativa de Vida 2020 ===')
    const comparacao = await compararExpectativaVida(2020)
    console.log(`Masculino: ${comparacao.masculino?.toFixed(2)} anos`)
    console.log(`Feminino: ${comparacao.feminino?.toFixed(2)} anos`)
    console.log(`Diferença: ${comparacao.diferenca?.toFixed(2)} anos`)

    // Exemplo 4: Mortalidade infantil no Brasil
    console.log('\n=== Mortalidade Infantil - Brasil ===')
    const mortInfantil = await getEvolucaoMortalidadeInfantil('Brasil')
    if (mortInfantil) {
      console.log(`Evolução de ${mortInfantil.evolucao.length} anos`)
      console.log(`Primeiro ano: ${mortInfantil.evolucao[0].ano} - ${mortInfantil.evolucao[0].taxa.toFixed(2)}`)
      const ultimo = mortInfantil.evolucao[mortInfantil.evolucao.length - 1]
      console.log(`Último ano: ${ultimo.ano} - ${ultimo.taxa.toFixed(2)}`)
    }

  } catch (error) {
    console.error('Erro ao executar exemplos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Descomentar para executar os exemplos
// exemplos()

export default prisma

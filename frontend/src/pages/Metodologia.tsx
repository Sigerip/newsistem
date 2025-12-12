import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Metodologia = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Metodologia</h1>
            <p className="text-lg text-muted-foreground">
              Conheça os métodos e técnicas utilizados no SIGERIP
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Banco de dados de mortalidade infantil</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  A base de dados de mortalidade infantil utilizada neste projeto foi construída a partir de fontes oficiais, com rigorosos procedimentos de coleta, tratamento e validação. Os dados foram extraídos do Sistema de Informações sobre Nascidos Vivos (SINASC) e do Sistema de Informações sobre Mortalidade (SIM), ambos via <a href="https://datasus.saude.gov.br/informacoes-de-saude-tabnet/" target="_blank" className="text-primary hover:underline">Tabnet/DATASUS</a>, já consolidados e validados pelo <a href="https://docs.google.com/spreadsheets/d/1mJ4NdolOPlsAykFTHolrnh8odUaZE5WM/edit?gid=1015938775#gid=1015938775" target="_blank" className="text-primary hover:underline">IBGE</a>. O período analisado compreende os anos de 2000 a 2023, abrangendo recortes nacional, regional, estadual e municipal, o que permite análises comparativas e identificação de padrões regionais e locais.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  A principal variável analisada é a taxa de mortalidade infantil (TMI), definida como o número de óbitos de crianças menores de um ano por mil nascidos vivos em determinado ano e localidade.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Para garantir a qualidade dos dados, registros inconsistentes e referentes a "Município Ignorado" foram excluídos, e a análise foi restrita ao período pós-2000 devido à maior confiabilidade dos registros. O processamento e validação dos dados foram realizados com o auxílio de rotinas em Python para automação e checagem.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Banco de dados de mortalidade geral e tábuas de vida</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  A base de mortalidade geral e as tábuas de vida utilizadas seguem rigorosamente a metodologia oficial do IBGE, conforme detalhado nas Notas Metodológicas 01/2024. As tábuas são abreviadas, estruturadas em grupos etários quinquenais (0, 1-4, 5-9, ..., 90+), e cobrem o período de 2000 a 2070, sendo 2000-2023 dados observados e 2024-2070 projeções.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  A construção das tábuas parte dos registros de óbitos (SIM) e das estimativas populacionais dos Censos Demográficos (2000, 2010, 2022), ajustados para cobertura e qualidade. O IBGE aplica técnicas como Busca Ativa, Captura-Recaptura e modelos logísticos para corrigir sub-registros e distorções, especialmente em idades avançadas.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  As principais variáveis das tábuas incluem: probabilidade de morte (nqx), sobreviventes (lx), óbitos (dx), pessoas-ano vividas (nLx), total de pessoas-ano acima da idade x (Tx), expectativa de vida (ex) e a taxa central de mortalidade por grupo etário (nMx).
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projeções oficiais do IBGE até 2070</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  As projeções oficiais do IBGE para mortalidade até 2070 baseiam-se em hipóteses de convergência da esperança de vida ao nascer, com limites superiores de 85 anos para homens e 88 anos para mulheres, alinhados às Tábuas Modelo Oeste da ONU. A metodologia está descrita em <a href="https://biblioteca.ibge.gov.br/index.php/biblioteca-catalogo?view=detalhes&id=2102111" target="_blank" className="text-primary hover:underline">IBGE - Projeções da população: notas metodológicas 01/2024</a>.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modelo Lee-Carter</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  O modelo Lee-Carter (1992) é um dos métodos mais consagrados para projeção de mortalidade, especialmente por sua capacidade de capturar tendências de longo prazo e mudanças estruturais. A estimação dos parâmetros é realizada por decomposição de valores singulares (SVD), e o componente temporal é projetado via modelo ARIMA.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modelo Lee-Miller</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  O modelo Lee-Miller (2001) é uma variante do Lee-Carter que ajusta o índice de mortalidade temporal para refletir o padrão mais recente, sendo mais adequado para projeções de curto e médio prazo em países onde houve mudanças recentes significativas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modelos combinados ARIMA + ETS e MLP-Shallow</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Além dos modelos demográficos clássicos, utilizamos abordagens combinadas que integram modelos de séries temporais (ARIMA e ETS) e redes neurais artificiais (MLP-Shallow) para capturar padrões complexos e não-lineares nas taxas de mortalidade.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de avaliação</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  A performance dos modelos é avaliada por meio de métricas como MAE (Erro Absoluto Médio), RMSE (Raiz do Erro Quadrático Médio), MAPE (Erro Percentual Absoluto Médio) e sMAPE (Erro Percentual Absoluto Médio Simétrico), permitindo uma comparação objetiva entre as diferentes abordagens preditivas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metodologia;

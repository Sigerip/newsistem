const Metodologia = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Metodologia</h1>
            <p className="text-muted-foreground">
              Conheça os métodos e técnicas utilizados no SIGERIP
            </p>
          </div>

          <div className="space-y-10">
            {/* Banco de dados de mortalidade infantil */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Banco de dados de mortalidade infantil</h2>
              <div className="space-y-4 text-justify leading-relaxed">
                <p>
                  A base de dados de mortalidade infantil utilizada neste projeto foi construída a partir de fontes oficiais, com rigorosos procedimentos de coleta, tratamento e validação. Os dados foram extraídos do Sistema de Informações sobre Nascidos Vivos (SINASC) e do Sistema de Informações sobre Mortalidade (SIM), ambos via <a href="https://datasus.saude.gov.br/informacoes-de-saude-tabnet/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Tabnet/DATASUS</a>, já consolidados e validados pelo <a href="https://docs.google.com/spreadsheets/d/1mJ4NdolOPlsAykFTHolrnh8odUaZE5WM/edit?gid=1015938775#gid=1015938775" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">IBGE</a>. O período analisado compreende os anos de 2000 a 2023, abrangendo recortes nacional, regional, estadual e municipal, o que permite análises comparativas e identificação de padrões regionais e locais.
                </p>
                <p>
                  A principal variável analisada é a taxa de mortalidade infantil (TMI), definida como o número de óbitos de crianças menores de um ano por mil nascidos vivos em determinado ano e localidade. A TMI é calculada como:
                </p>
                <div className="my-6 py-4 px-6 bg-muted/30 rounded-lg text-center overflow-x-auto">
                  <span className="font-serif text-lg italic">
                    TMI<sub>i,t</sub> = (Óbitos &lt; 1 ano<sub>i,t</sub> / Nascidos Vivos<sub>i,t</sub>) × 1000
                  </span>
                </div>
                <p>
                  Para garantir a qualidade dos dados, registros inconsistentes e referentes a "Município Ignorado" foram excluídos, e a análise foi restrita ao período pós-2000 devido à maior confiabilidade dos registros. O processamento e validação dos dados foram realizados com o auxílio de rotinas em Python para automação e checagem.
                </p>
              </div>
            </section>

            {/* Banco de dados de mortalidade geral e tábuas de vida */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Banco de dados de mortalidade geral e tábuas de vida</h2>
              <div className="space-y-4 text-justify leading-relaxed">
                <p>
                  A base de mortalidade geral e as tábuas de vida utilizadas seguem rigorosamente a metodologia oficial do IBGE, conforme detalhado nas Notas Metodológicas 01/2024. As tábuas são abreviadas, estruturadas em grupos etários quinquenais (0, 1-4, 5-9, ..., 90+), e cobrem o período de 2000 a 2070, sendo 2000-2023 dados observados e 2024-2070 projeções.
                </p>
                <p>
                  A construção das tábuas parte dos registros de óbitos (SIM) e das estimativas populacionais dos Censos Demográficos (2000, 2010, 2022), ajustados para cobertura e qualidade. O IBGE aplica técnicas como Busca Ativa, Captura-Recaptura e modelos logísticos para corrigir sub-registros e distorções, especialmente em idades avançadas, onde se utiliza o modelo log-quadrático de Wilmoth et al. (2012) e ajustes propostos pela ONU.
                </p>
                <p>
                  As principais variáveis das tábuas incluem: probabilidade de morte (<sub>n</sub>q<sub>x</sub>), sobreviventes (l<sub>x</sub>), óbitos (d<sub>x</sub>), pessoas-ano vividas (<sub>n</sub>L<sub>x</sub>), total de pessoas-ano acima da idade x (T<sub>x</sub>), expectativa de vida (e<sub>x</sub>) e, fundamentalmente para este projeto, a taxa central de mortalidade por grupo etário (<sub>n</sub>M<sub>x</sub>). A <sub>n</sub>M<sub>x</sub> representa a razão entre o número de óbitos ajustados e a população correspondente em cada grupo etário, sendo a principal variável utilizada para as previsões de mortalidade por idade. Essas tábuas permitem análises detalhadas e comparáveis dos padrões de mortalidade, sendo fundamentais para a avaliação de tendências e para a calibração dos modelos preditivos.
                </p>
              </div>
            </section>

            {/* Projeções oficiais do IBGE até 2070 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Projeções oficiais do IBGE até 2070</h2>
              <div className="space-y-4 text-justify leading-relaxed">
                <p>
                  As projeções oficiais do IBGE para mortalidade até 2070 baseiam-se em hipóteses de convergência da esperança de vida ao nascer, com limites superiores de 85 anos para homens e 88 anos para mulheres, alinhados às Tábuas Modelo Oeste da ONU. O ajuste é feito por interpolação entre os padrões observados em 2023 e os limites de 2100, garantindo coerência entre nível e estrutura etária da mortalidade projetada. A metodologia está descrita em IBGE. Projeções da população: <a href="https://biblioteca.ibge.gov.br/index.php/biblioteca-catalogo?view=detalhes&id=2102111" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">notas metodológicas 01/2024</a>.
                </p>
                <p>
                  Destaca-se, contudo, que o IBGE não informa se suas projeções foram submetidas a análises quantitativas de desempenho ou a métricas formais de avaliação preditiva, razão pela qual tais indicadores não estão disponíveis publicamente. Por esse motivo, e para garantir a comparabilidade com as demais projeções alternativas, utilizou-se neste projeto apenas as tábuas e projeções oficialmente publicadas pelo IBGE, sem aplicação ou reprodução de eventuais equações logísticas internas do órgão.
                </p>
              </div>
            </section>

            {/* Modelo Lee-Carter */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Modelo Lee-Carter</h2>
              <div className="space-y-4 text-justify leading-relaxed">
                <p>
                  O modelo Lee-Carter (1992) é um dos métodos mais consagrados para projeção de mortalidade, especialmente por sua capacidade de capturar tendências de longo prazo e mudanças estruturais. Ele modela a taxa central de mortalidade (<sub>n</sub>M<sub>x</sub>) por idade e ano como:
                </p>
                <div className="my-6 py-4 px-6 bg-muted/30 rounded-lg text-center overflow-x-auto">
                  <span className="font-serif text-lg italic">
                    ln(m<sub>x,t</sub>) = a<sub>x</sub> + b<sub>x</sub>k<sub>t</sub> + ε<sub>x,t</sub>
                  </span>
                </div>
                <p>onde:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><em>a<sub>x</sub></em>: padrão médio de mortalidade por idade;</li>
                  <li><em>b<sub>x</sub></em>: sensibilidade da mortalidade à variação temporal;</li>
                  <li><em>k<sub>t</sub></em>: índice de mortalidade ao longo do tempo;</li>
                  <li><em>ε<sub>x,t</sub></em>: termo de erro aleatório.</li>
                </ul>
                <p className="mt-4">
                  A estimação dos parâmetros é realizada por decomposição de valores singulares (SVD), utilizando o pacote <em>demography</em> (R). O componente temporal k<sub>t</sub> é projetado via modelo ARIMA(0,1,0) (passeio aleatório com drift), ajustado com o pacote <em>forecast</em>. O modelo é avaliado por faixa etária, permitindo identificar a acurácia em cada grupo e facilitando a comparação com outros métodos.
                </p>
              </div>
            </section>

            {/* Modelo Lee-Miller */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Modelo Lee-Miller</h2>
              <div className="space-y-4 text-justify leading-relaxed">
                <p>
                  A variante Lee-Miller (2001) foi desenvolvida para corrigir a tendência do Lee-Carter de subestimar a expectativa de vida projetada, especialmente em idades avançadas. Após a aplicação da SVD, o vetor k<sub>t</sub> é reajustado iterativamente para que as taxas projetadas repliquem com maior precisão a expectativa de vida observada, conforme a seguinte regra:
                </p>
                <div className="my-6 py-4 px-6 bg-muted/30 rounded-lg text-center overflow-x-auto">
                  <span className="font-serif text-lg italic">
                    k<sub>t</sub><sup>(j+1)</sup> = k<sub>t</sub><sup>(j)</sup> + Σ<sub>x</sub> b<sub>x</sub> × (L<sub>x</sub> / (e<sub>0,t</sub><sup>obs</sup> − e<sub>0,t</sub><sup>proj(j)</sup>))
                  </span>
                </div>
                <p>
                  Esse ajuste é repetido até que a diferença entre a expectativa de vida observada e projetada seja inferior a um limiar pré-definido (10<sup>−4</sup>). A implementação foi gerada com o pacote <em>demography</em> em R. Assim como no Lee-Carter, as avaliações são feitas por faixa etária, permitindo identificar ganhos de precisão em grupos específicos.
                </p>
              </div>
            </section>

            {/* Modelo combinado ARIMA + ETS */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Modelo combinado ARIMA + ETS</h2>
              <div className="space-y-4 text-justify leading-relaxed">
                <p>
                  O modelo combinado ARIMA+ETS integra duas abordagens clássicas de séries temporais para previsão da taxa central de mortalidade <sub>n</sub>M<sub>x</sub> por idade, sexo e localidade.
                </p>
                
                <p>
                  <strong>ARIMA (AutoRegressive Integrated Moving Average):</strong> Modelo clássico para séries temporais, capaz de capturar padrões lineares, tendências e sazonalidades. A estrutura geral é:
                </p>
                <div className="my-6 py-4 px-6 bg-muted/30 rounded-lg text-center overflow-x-auto">
                  <span className="font-serif text-lg italic">
                    Φ<sub>p</sub>(B)Φ<sub>P</sub>(B<sup>s</sup>)(1−B)<sup>d</sup>(1−B<sup>s</sup>)<sup>D</sup>y<sub>t</sub> = Θ<sub>q</sub>(B)Θ<sub>Q</sub>(B<sup>s</sup>)ε<sub>t</sub>
                  </span>
                </div>
                <p>
                  Os melhores hiperparâmetros são selecionados automaticamente via <em>auto.arima()</em> do pacote <em>forecast</em> (R).
                </p>

                <p className="mt-4">
                  <strong>ETS (Error, Trend, Seasonality):</strong> Modelo que decompõe a série em componentes de erro, tendência e sazonalidade, com variantes aditivas e multiplicativas. A estrutura básica é:
                </p>
                <div className="my-6 py-4 px-6 bg-muted/30 rounded-lg text-center overflow-x-auto">
                  <span className="font-serif text-lg italic">
                    y<sub>t</sub> = ℓ<sub>t−1</sub> + b<sub>t−1</sub> + s<sub>t−m</sub> + ε<sub>t</sub>
                  </span>
                </div>
                <p>
                  O ajuste é feito via máxima verossimilhança utilizando a função <em>ets()</em> do pacote <em>forecast</em> (R).
                </p>

                <p className="mt-4">
                  As previsões de cada modelo são combinadas por faixa etária, utilizando pesos inversamente proporcionais ao erro quadrático médio (RMSE) obtido no conjunto de validação para cada grupo etário:
                </p>
                <div className="my-6 py-4 px-6 bg-muted/30 rounded-lg text-center overflow-x-auto space-y-3">
                  <div className="font-serif text-lg italic">
                    W<sub>i</sub> = (1/RMSE<sub>i</sub>) / Σ<sub>j</sub>(1/RMSE<sub>j</sub>)
                  </div>
                  <div className="font-serif text-lg italic">
                    ŷ<sub>t</sub><sup>Comb</sup> = Σ<sub>i</sub> w<sub>i</sub>ŷ<sub>t</sub><sup>(i)</sup>, &nbsp; i ∈ {"{"} ARIMA, ETS {"}"}
                  </div>
                </div>
                <p>
                  Essa abordagem permite que a combinação seja sensível ao desempenho específico em cada faixa etária, maximizando a acurácia onde cada modelo é mais eficiente.
                </p>
              </div>
            </section>

            {/* Modelo combinado ARIMA + ETS + MLP-Shallow (NNAR) */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Modelo combinado ARIMA + ETS + MLP-Shallow (NNAR)</h2>
              <div className="space-y-4 text-justify leading-relaxed">
                <p>
                  A metodologia combina três modelos: ARIMA, ETS e NNAR (Neural Network AutoRegressive, uma rede neural MLP-shallow), para previsão da taxa central de mortalidade (<sub>n</sub>M<sub>x</sub>).
                </p>
                
                <p>
                  <strong>NNAR (Neural Network AutoRegressive, MLP-Shallow):</strong> Rede neural do tipo Multilayer Perceptron (MLP) com uma camada oculta, capaz de capturar padrões não-lineares. A arquitetura é:
                </p>
                <div className="my-6 py-4 px-6 bg-muted/30 rounded-lg text-center overflow-x-auto">
                  <span className="font-serif text-lg italic">
                    ŷ<sub>t+h</sub> = β<sub>0</sub> + Σ<sub>r=1</sub><sup>k</sup> β<sub>r</sub>σ(α<sub>r0</sub> + Σ<sub>j=1</sub><sup>p</sup> α<sub>rj</sub>y<sub>t−j+1</sub>)
                  </span>
                </div>
                <p>
                  onde <em>p</em> é o número de defasagens (lags) e <em>k</em> o número de neurônios na camada oculta. O ajuste é feito com o pacote <em>nnetar()</em> do <em>forecast</em> (R), com múltiplas inicializações para robustez.
                </p>

                <p className="mt-4">
                  As previsões dos três modelos são combinadas por faixa etária, utilizando a mesma regra de pesos inversamente proporcionais ao RMSE em validação:
                </p>
                <div className="my-6 py-4 px-6 bg-muted/30 rounded-lg text-center overflow-x-auto space-y-3">
                  <div className="font-serif text-lg italic">
                    W<sub>i</sub> = (1/RMSE<sub>i</sub>) / Σ<sub>j</sub>(1/RMSE<sub>j</sub>)
                  </div>
                  <div className="font-serif text-lg italic">
                    ŷ<sub>t</sub><sup>Comb</sup> = Σ<sub>i</sub> w<sub>i</sub>ŷ<sub>t</sub><sup>(i)</sup>, &nbsp; i ∈ {"{"} ARIMA, ETS, NNAR {"}"}
                  </div>
                </div>
                <p>
                  A incerteza das previsões combinadas é estimada por bootstrap residual paramétrico (B=1000), reamostrando resíduos, gerando séries sintéticas, reestimando os modelos e recombinando as previsões. Os intervalos de confiança de 95% são obtidos pelos percentis 2,5% e 97,5% das previsões simuladas.
                </p>
              </div>
            </section>

            {/* Divisão temporal dos dados e justificativa */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Divisão temporal dos dados e justificativa</h2>
              <div className="space-y-4 text-justify leading-relaxed">
                <p>
                  Para garantir a avaliação justa e realista dos modelos, os dados foram divididos em três períodos:
                </p>
                <div className="overflow-x-auto my-6">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border px-4 py-2 text-left font-semibold">Fase</th>
                        <th className="border border-border px-4 py-2 text-left font-semibold">Anos</th>
                        <th className="border border-border px-4 py-2 text-left font-semibold">Uso</th>
                        <th className="border border-border px-4 py-2 text-left font-semibold">Objetivo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border px-4 py-2">Treino</td>
                        <td className="border border-border px-4 py-2">2000–2011</td>
                        <td className="border border-border px-4 py-2">Ajuste dos modelos</td>
                        <td className="border border-border px-4 py-2">Estimar parâmetros</td>
                      </tr>
                      <tr>
                        <td className="border border-border px-4 py-2">Validação</td>
                        <td className="border border-border px-4 py-2">2012–2015</td>
                        <td className="border border-border px-4 py-2">Cálculo de RMSE</td>
                        <td className="border border-border px-4 py-2">Definir pesos de combinação</td>
                      </tr>
                      <tr>
                        <td className="border border-border px-4 py-2">Teste</td>
                        <td className="border border-border px-4 py-2">2016–2019</td>
                        <td className="border border-border px-4 py-2">Avaliação final</td>
                        <td className="border border-border px-4 py-2">Medir desempenho fora da amostra</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  A exclusão do período da pandemia de Covid-19 (2020 em diante) é justificada pelo fato de que a crise sanitária gerou mudanças abruptas e atípicas nas taxas de mortalidade, com impactos heterogêneos por idade, sexo e região. A inclusão desse período prejudicaria a avaliação dos modelos, pois estes são treinados para capturar padrões históricos e estruturais, não choques exógenos de curta duração. Assim, a avaliação de desempenho reflete a capacidade dos modelos de prever a mortalidade em condições normais.
                </p>
              </div>
            </section>

            {/* Métricas de avaliação */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Métricas de avaliação</h2>
              <div className="space-y-4 text-justify leading-relaxed">
                <p>
                  A avaliação dos modelos foi realizada por faixa etária, permitindo identificar a acurácia em cada grupo e facilitando a comparação entre métodos. As métricas utilizadas foram:
                </p>
                <ul className="list-none ml-4 space-y-6 my-6">
                  <li>
                    <strong>RMSE (Root Mean Square Error):</strong>
                    <div className="my-4 py-4 px-6 bg-muted/30 rounded-lg text-center overflow-x-auto">
                      <span className="font-serif text-lg italic">
                        RMSE = √(Σ<sub>i=1</sub><sup>n</sup> (ŷ<sub>i</sub> − y<sub>i</sub>)² / n)
                      </span>
                    </div>
                  </li>
                  <li>
                    <strong>MAE (Mean Absolute Error):</strong>
                    <div className="my-4 py-4 px-6 bg-muted/30 rounded-lg text-center overflow-x-auto">
                      <span className="font-serif text-lg italic">
                        MAE = (Σ<sub>i=1</sub><sup>n</sup> |y<sub>i</sub> − ŷ<sub>i</sub>|) / n
                      </span>
                    </div>
                  </li>
                  <li>
                    <strong>sMAPE (Symmetric Mean Absolute Percentage Error):</strong>
                    <div className="my-4 py-4 px-6 bg-muted/30 rounded-lg text-center overflow-x-auto">
                      <span className="font-serif text-lg italic">
                        sMAPE = (100/n) × Σ<sub>t=1</sub><sup>n</sup> |y<sub>t</sub> − ŷ<sub>t</sub>| / ((|y<sub>t</sub>| + |ŷ<sub>t</sub>|) / 2)
                      </span>
                    </div>
                  </li>
                </ul>
                <p>
                  Essas métricas foram calculadas separadamente para cada faixa etária, possibilitando avaliar a precisão dos modelos em diferentes grupos populacionais e identificar eventuais limitações ou pontos fortes em idades específicas. Os resultados do RMSE orientaram a escolha dos pesos na combinação dos modelos, sempre observando o desempenho em cada faixa etária.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metodologia;

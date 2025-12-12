import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp } from "lucide-react";

const PrevisaoExpectativa = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary mb-4">
              <TrendingUp className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Previsão de Expectativa de Vida</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Projeções da expectativa de vida para os próximos anos
            </p>
          </div>

          <Tabs defaultValue="previsao" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="previsao">Previsões</TabsTrigger>
              <TabsTrigger value="cenarios">Cenários</TabsTrigger>
            </TabsList>
            
            <TabsContent value="previsao" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Projeções da Expectativa de Vida</CardTitle>
                  <CardDescription>
                    Tendências futuras baseadas em análise histórica
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 flex items-center justify-center bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">
                      Gráfico de projeções será implementado
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="cenarios" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Cenários</CardTitle>
                  <CardDescription>
                    Diferentes cenários de desenvolvimento e impacto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-2">Cenário Otimista</h4>
                      <p className="text-sm text-muted-foreground">
                        Avanços significativos em saúde pública e qualidade de vida
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-2">Cenário Base</h4>
                      <p className="text-sm text-muted-foreground">
                        Manutenção das tendências atuais de desenvolvimento
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-2">Cenário Conservador</h4>
                      <p className="text-sm text-muted-foreground">
                        Desafios em saúde pública e aspectos socioeconômicos
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Fatores Considerados</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Tendências históricas de mortalidade</li>
                  <li>• Avanços em saúde pública</li>
                  <li>• Desenvolvimento socioeconômico</li>
                  <li>• Políticas de saúde preventiva</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Aplicações Práticas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Planejamento previdenciário</li>
                  <li>• Políticas de saúde pública</li>
                  <li>• Investimentos em infraestrutura</li>
                  <li>• Estratégias de desenvolvimento</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrevisaoExpectativa;

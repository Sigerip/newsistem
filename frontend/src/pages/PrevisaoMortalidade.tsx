import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target } from "lucide-react";

const PrevisaoMortalidade = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary mb-4">
              <Target className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Previsão de Mortalidade</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Modelos preditivos para taxas de mortalidade futuras
            </p>
          </div>

          <Tabs defaultValue="previsao" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="previsao">Previsões</TabsTrigger>
              <TabsTrigger value="modelo">Modelo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="previsao" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Projeções Futuras</CardTitle>
                  <CardDescription>
                    Previsões baseadas em modelos estatísticos avançados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 flex items-center justify-center bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">
                      Gráfico de previsões será implementado
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="modelo" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Metodologia do Modelo</CardTitle>
                  <CardDescription>
                    Detalhes técnicos e validação do modelo preditivo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Técnicas Utilizadas</h4>
                      <p className="text-sm text-muted-foreground">
                        Séries temporais, regressão e machine learning para previsões precisas
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Validação</h4>
                      <p className="text-sm text-muted-foreground">
                        Modelos validados com dados históricos e métricas de acurácia
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle>Aplicações das Previsões</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  As previsões de mortalidade são fundamentais para planejamento de políticas 
                  públicas, alocação de recursos em saúde e desenvolvimento de estratégias 
                  de prevenção. Nossos modelos auxiliam gestores na tomada de decisões 
                  baseadas em evidências.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrevisaoMortalidade;

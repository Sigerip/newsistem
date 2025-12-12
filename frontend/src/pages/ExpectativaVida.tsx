import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp } from "lucide-react";

const ExpectativaVida = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary mb-4">
              <TrendingUp className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Expectativa de Vida</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Análise da expectativa de vida no Brasil entre 2000-2023
            </p>
          </div>

          <Tabs defaultValue="grafico" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="grafico">Gráfico</TabsTrigger>
              <TabsTrigger value="tabela">Tabela</TabsTrigger>
            </TabsList>
            
            <TabsContent value="grafico" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução da Expectativa de Vida</CardTitle>
                  <CardDescription>
                    Visualização temporal da expectativa de vida por região
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 flex items-center justify-center bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">
                      Gráfico interativo será implementado com dados reais
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tabela" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dados Tabulados</CardTitle>
                  <CardDescription>
                    Valores detalhados da expectativa de vida
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 flex items-center justify-center bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">
                      Tabela de dados será implementada com informações reais
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle>Tendências Observadas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  A expectativa de vida no Brasil apresentou crescimento consistente nas últimas 
                  duas décadas, refletindo melhorias nas condições de saúde e qualidade de vida 
                  da população. Diferenças regionais permanecem significativas e merecem atenção 
                  especial nas políticas públicas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpectativaVida;

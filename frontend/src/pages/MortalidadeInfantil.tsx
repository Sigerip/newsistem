import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity } from "lucide-react";

const MortalidadeInfantil = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary mb-4">
              <Activity className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Mortalidade Infantil</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Indicadores de mortalidade infantil no Brasil
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
                  <CardTitle>Taxa de Mortalidade Infantil</CardTitle>
                  <CardDescription>
                    Evolução dos indicadores por região
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
                  <CardTitle>Dados Regionais</CardTitle>
                  <CardDescription>
                    Comparativo entre estados e regiões
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 flex items-center justify-center bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">
                      Tabela comparativa será implementada
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle>Importância do Indicador</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  A taxa de mortalidade infantil é um dos principais indicadores de saúde pública 
                  e desenvolvimento social. Sua redução reflete avanços em serviços de saúde, 
                  saneamento básico e condições socioeconômicas da população.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortalidadeInfantil;

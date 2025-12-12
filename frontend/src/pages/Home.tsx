import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart3, TrendingUp, Activity, Users, Database, Target } from "lucide-react";
import { TeamSection } from "@/components/TeamSection";
import ExemploTabelaMortalidade from "@/components/ExemploTabelaMortalidade";

const Home = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Dados de Mortalidade",
      description: "Análise completa das taxas de mortalidade por faixa etária e região",
      link: "/dados-mortalidade",
    },
    {
      icon: TrendingUp,
      title: "Expectativa de Vida",
      description: "Visualização da expectativa de vida ao longo dos anos",
      link: "/expectativa-vida",
    },
    {
      icon: Activity,
      title: "Mortalidade Infantil",
      description: "Indicadores de mortalidade infantil por região",
      link: "/mortalidade-infantil",
    },
    {
      icon: Target,
      title: "Previsões",
      description: "Modelos preditivos para mortalidade e expectativa de vida",
      link: "/previsao-mortalidade",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sigerip-dark to-primary py-20 md:py-12">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
              OIAtuarial
            </h1>
            
            <p className="mb-10 text-lg text-white/80 max-w-2xl mx-auto">
              Desenvolvemos sistemas inteligentes de apoio à decisão com enfoque na gestão de riscos 
              e previsão de dados demográficos e atuariais, impactando a comunidade através de 
              análises precisas e insights estratégicos.
            </p>
            
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4"></h2>
            {/* <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Acesse análises detalhadas e previsões baseadas em dados demográficos brasileiros
            </p> */}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} to={feature.link}>
                  <Card className="group h-full transition-all hover:shadow-lg hover:scale-105 cursor-pointer border-2 hover:border-primary/50">
                    <CardHeader>
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>


      {/* Team Section */}
      <TeamSection />
      {/* Apoiadores Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Apoiadores</h2>
            <p className="text-muted-foreground text-lg">
              Instituições que apoiam e financiam o Observatório de Inteligência Atuarial
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {[
              {
                name: "UFPB",
                logo: "../../public/img/brasao.png",
                link: "http://www.cnpq.br/"
              },
              {
                name: "PROEX",
                logo: "../../public/img/PROEXFULL.png",
                link: "https://www.gov.br/capes/pt-br"
              },].map((sponsor, index) => (
              <a
                key={index}
                href={sponsor.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-24"
              >
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="max-h-24 object-contain filter hover:brightness-110 transition-all"
                />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

// Importe o useState do React e os componentes que você está usando
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"; // Assumindo que você usa shadcn/ui
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

// Array com os dados da equipe (mantido fora do componente para clareza)
const teamMembers = [
  {
    name: "Prof. Dr. Filipe C. L. Duarte",
    role: "Coordenador - Tábuas de mortalidade",
    linkedin: "https://www.linkedin.com/in/filipeclduarte/",
    email: "filipe_pb_duarte@hotmail.com"
  },
  {
    name: "Prof. Dr. Gustavo C. Xavier",
    role: "Coordenador Adjunto - Sistema web",
    linkedin: "https://www.linkedin.com/in/gcxavier/",
    email: "gustavocorreiaxavier@gmail.com"
  },
  {
    name: "Prof. Me. YURI M. S. SANTOS",
    role: "Colaborador - Validação dos modelos",
    linkedin: "",
    email: ""
  },
  {
    name: "Prof. Dr. Herick C. G. Oliveira",
    role: "Colaborador - Mortalidade infantil",
    linkedin: "https://www.linkedin.com/in/herickcidarta/",
    email: "hcidarta@hotmail.com"
  },
  {
    name: "Tassia T. S. Oliveira",
    role: "Colaboradora",
    linkedin: "",
    email: ""
  },
  {
    name: "Cleo D. Anacleto",
    role: "Aluno Bolsista - Tábuas de mortalidade",
    linkedin: "https://www.linkedin.com/in/cleo-decker-anacleto-66a69b133/",
    email: "cleodecker@hotmail.com"
  },
  {
    name: "Cristiane S. Silva",
    role: "Aluna Voluntária - Tábuas de mortalidade",
    linkedin: "",
    email: "css3@academico.ufpb.br"
  },
  {
    name: "Gabrielle S. M. Vieira",
    role: "Aluna Voluntária - Mortalidade infantil",
    linkedin: "",
    email: "gabrielle.samara230@gmail.com"
  },
  {
    name: "Igor B. Kutelak",
    role: "Aluno Voluntário - Mortalidade infantil",
    linkedin: "https://www.linkedin.com/in/igor-kutelak-20b10a194/",
    email: "Kutelak.igor@gmail.com"
  },
  {
    name: "Isaias F. S. Sousa",
    role: "Aluno Voluntário - Sistema web",
    linkedin: "https://www.linkedin.com/in/isa%C3%ADas-felipe-silva-de-sousa-453902327/",
    email: "isaias.felipe@academico.ufpb.br"
  },
  {
    name: "Jefferson G. Silva",
    role: "Aluno Voluntário - Sistema web",
    linkedin: "",
    email: "jeffeersonguilhermeh@gmail.com"
  },
  {
    name: "João P. S. F. Silva",
    role: "Aluno Voluntário - Tábuas de mortalidade",
    linkedin: "https://www.linkedin.com/in/jo%C3%A3o-pedro-st%C3%AAnio-2861071b3/",
    email: "jpsfs2@academico.ufpb.br"
  },
  {
    name: "Nathiely B. Silva",
    role: "Aluna Voluntária - Sistema web",
    linkedin: "",
    email: "nathiely.silva@academico.ufpb.br"
  }
];


export function TeamSection() {
  // 1. Criamos um estado para controlar a visibilidade. Começa como 'false' (oculto).
  const [isTeamVisible, setIsTeamVisible] = useState(false);

  // 2. Função para alternar o estado entre true e false.
  const toggleTeamVisibility = () => {
    setIsTeamVisible(!isTeamVisible);
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Conheça nosso time</h2>
          
        </div>
        
        {/* 3. Botão que chama a função de toggle */}
        <div className="text-center">
          <Button onClick={toggleTeamVisibility} size="lg">
            {isTeamVisible ? 'Ocultar Equipe' : 'Ver Equipe Completa'}
          </Button>
        </div>

        {/* 4. Container da equipe com animação e renderização condicional */}
        <div 
          className={`
            transition-all duration-700 ease-in-out overflow-hidden
            ${isTeamVisible ? 'max-h-[2000px] opacity-100 mt-12' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline block"
                    >
                      LinkedIn
                    </a>
                  )}
                  {member.email && (
                    <a 
                      href={`mailto:${member.email}`} 
                      className="text-sm text-muted-foreground hover:underline break-words"
                    >
                      {member.email}
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
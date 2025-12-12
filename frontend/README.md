# SIGERIP Frontend

Interface web para visualização e análise de dados de mortalidade.

## 🚀 Início Rápido

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:5173

## 📋 Requisitos

- Node.js 18+
- Backend rodando em http://localhost:3001

## 🗂️ Estrutura

```
frontend/
├── src/
│   ├── components/
│   │   ├── charts/              # Componentes de gráficos
│   │   │   ├── CurvaMortalidadeChart.tsx
│   │   │   ├── TaxaMortalidadeChart.tsx
│   │   │   └── tabua-columns.tsx
│   │   ├── ui/                  # Componentes shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ... (30+ componentes)
│   │   ├── Navigation.tsx       # Menu de navegação
│   │   └── TeamSection.tsx      # Seção da equipe
│   ├── pages/
│   │   ├── Home.tsx             # Página inicial
│   │   ├── DadosMortalidade.tsx
│   │   ├── ExpectativaVida.tsx
│   │   ├── MortalidadePage.tsx  # Análise principal
│   │   ├── MortalidadeInfantil.tsx
│   │   ├── PrevisaoMortalidade.tsx
│   │   └── PrevisaoExpectativa.tsx
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   └── utils.ts             # Utilitários
│   ├── App.tsx                  # Rotas
│   ├── main.tsx                 # Entry point
│   └── index.css                # Estilos globais
├── public/
│   ├── dados/                   # CSVs (fallback)
│   │   ├── tabua_concatenada.csv
│   │   ├── taxa_mortalidade.csv
│   │   └── dados/               # Dados adicionais
│   └── img/
│       ├── brasao.png
│       └── PROEXFULL.png
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🎨 Páginas

### Home (`/`)
- Apresentação do projeto
- Informações da equipe
- Navegação para outras seções

### Dados de Mortalidade (`/dados-mortalidade`)
- Visualização de tábuas de mortalidade
- Filtros por local, sexo e ano

### Expectativa de Vida (`/expectativa-vida`)
- Gráficos de expectativa de vida
- Comparações entre regiões

### Mortalidade (`/mortalidade`)
- **Análise completa com 3 abas:**
  - Curva de Mortalidade
  - Taxa de Mortalidade
  - Análise de Dados (tabela completa)
- Filtros dinâmicos
- Estatísticas agregadas
- Integração com API

### Mortalidade Infantil (`/mortalidade-infantil`)
- Análises específicas de mortalidade infantil

### Previsões
- `/previsao-mortalidade`: Modelos de previsão
- `/previsao-expectativa`: Projeções futuras

## 🛠️ Scripts NPM

```bash
npm run dev      # Servidor de desenvolvimento (porta 5173)
npm run build    # Build para produção
npm run preview  # Preview do build de produção
npm run lint     # Verificar código com ESLint
```

## ⚙️ Configuração

### Arquivo .env

```env
VITE_API_URL=http://localhost:3001
```

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| VITE_API_URL | URL da API backend | http://localhost:3001 |

**Nota:** Variáveis Vite devem começar com `VITE_`

## 🎨 Componentes UI

O projeto utiliza **shadcn/ui**, uma coleção de componentes React reutilizáveis e acessíveis.

### Componentes Principais

- **Button**: Botões com variantes
- **Card**: Cards para conteúdo
- **Table**: Tabelas de dados
- **Tabs**: Navegação por abas
- **Select**: Dropdowns
- **Badge**: Badges de status
- **Alert**: Alertas e notificações
- **Chart**: Wrapper para Recharts

### Adicionar Novo Componente

```bash
npx shadcn-ui@latest add [component-name]
```

Exemplo:
```bash
npx shadcn-ui@latest add dropdown-menu
```

## 📊 Gráficos

Os gráficos utilizam **Recharts**:

```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

<LineChart data={dados}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="faixaEtaria" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="nqx" stroke="#8884d8" />
</LineChart>
```

## 🔌 Integração com API

### Exemplo de fetch

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function buscarDados() {
  try {
    const response = await fetch(`${API_URL}/api/mortalidade/tabua?local=Brasil&ano=2010`);
    const dados = await response.json();
    return dados;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    // Fallback para CSV local
    return buscarCSVLocal();
  }
}
```

### Fallback para CSV

Se a API não estiver disponível, o sistema carrega dados de CSVs locais em `public/dados/`.

## 🎨 Estilização

### TailwindCSS

O projeto usa TailwindCSS para estilização:

```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h2 className="text-2xl font-bold text-gray-900">Título</h2>
  <Button variant="outline" size="sm">Ação</Button>
</div>
```

### Classes Customizadas

Utilize `cn()` para combinar classes:

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className
)}>
```

## 🧩 Adicionar Nova Página

1. **Criar arquivo da página:**

```typescript
// src/pages/MinhaNovaPage.tsx
export default function MinhaNovaPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Minha Nova Página</h1>
    </div>
  );
}
```

2. **Adicionar rota em App.tsx:**

```typescript
import MinhaNovaPage from './pages/MinhaNovaPage';

// Dentro do <Routes>
<Route path="/minha-pagina" element={<MinhaNovaPage />} />
```

3. **Adicionar link no Navigation.tsx:**

```typescript
<NavigationMenuLink href="/minha-pagina">
  Minha Página
</NavigationMenuLink>
```

## 🐛 Troubleshooting

### API não conecta

- Verifique se o backend está rodando
- Confirme a URL no arquivo `.env`
- Abra o console do navegador (F12)

### Erro de CORS

Certifique-se de que o backend permite requisições de `http://localhost:5173`.

### Componente shadcn não encontrado

```bash
npx shadcn-ui@latest add [component-name]
```

### Build falha

```bash
# Limpar cache
rm -rf node_modules dist
npm install
npm run build
```

## 🚀 Deploy

### Build para produção

```bash
npm run build
```

Os arquivos estarão em `dist/`.

### Servir arquivos estáticos

```bash
npm run preview
```

### Deploy em servidor

Copie a pasta `dist/` para seu servidor web (Nginx, Apache, etc.).

**Configuração Nginx:**

```nginx
server {
  listen 80;
  server_name seu-dominio.com;
  root /caminho/para/dist;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
  
  location /api {
    proxy_pass http://localhost:3001;
  }
}
```

## 📱 Responsividade

O layout é responsivo usando Tailwind breakpoints:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Conteúdo */}
</div>
```

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🎯 Boas Práticas

1. **Componentes reutilizáveis:** Crie componentes genéricos
2. **Type safety:** Use TypeScript adequadamente
3. **Performance:** Lazy loading para páginas pesadas
4. **Acessibilidade:** Utilize componentes shadcn (já acessíveis)
5. **SEO:** Configure meta tags apropriadas

## 📚 Recursos

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Recharts Documentation](https://recharts.org/)

## 📄 Licença

Projeto acadêmico - UEFS

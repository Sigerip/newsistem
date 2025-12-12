# SIGERIP - Sistema de Gerenciamento de Informações de Mortalidade

Sistema para visualização e análise de dados de mortalidade no Brasil.

## 📁 Estrutura do Projeto

```
newsistem/
├── frontend/    # Interface web (React + Vite + TypeScript)
├── backend/     # API REST (Python + Flask)
└── dados/       # Dados de mortalidade (CSV)
```

## 🚀 Como Executar

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📋 Tecnologias

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Python, Flask, SQLAlchemy
- **Dados**: CSV, SQLite

## 📄 Licença

Este projeto está sob a licença MIT.

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flasgger import Swagger
import os

# Configuração do Flask
app = Flask(__name__)

# Configuração do Swagger
app.config['SWAGGER'] = {
    'title': 'API SIGERIP - Mortalidade',
    'uiversion': 3
}
swagger = Swagger(app)

# Configuração do banco de dados SQLite
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, 'banco_atuarial.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DATABASE_PATH}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configuração de CORS
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "http://localhost:5173", "http://localhost:8080", "http://localhost:8081"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Inicialização do SQLAlchemy
db = SQLAlchemy(app)

# ============================================
# MODELOS DO BANCO DE DADOS
# ============================================

class DimLocal(db.Model):
    __tablename__ = 'dim_locais'
    id_local = db.Column(db.Integer, primary_key=True)
    nome_local = db.Column(db.String, unique=True)
    
    # CORREÇÃO 1: Use o nome da CLASSE alvo ('TabuaMortalidade'), não da tabela
    projecoes = db.relationship('TabuaMortalidade', backref='local', lazy=True)

class DimSexo(db.Model):
    __tablename__ = 'dim_sexo'
    id_sexo = db.Column(db.Integer, primary_key=True)
    descricao = db.Column(db.String, unique=True)
    
    # CORREÇÃO 1: Use o nome da CLASSE alvo ('TabuaMortalidade')
    projecoes = db.relationship('TabuaMortalidade', backref='sexo', lazy=True)

class DimFaixa(db.Model):
    __tablename__ = 'dim_faixas'
    id_faixa = db.Column(db.Integer, primary_key=True)
    descricao = db.Column(db.String, unique=True)
    
    # CORREÇÃO 1: Use o nome da CLASSE alvo ('TabuaMortalidade')
    projecoes = db.relationship('TabuaMortalidade', backref='faixa', lazy=True)

class TabuaMortalidade(db.Model):
    __tablename__ = 'fato_projecoes' # Nome da tabela no banco
    id = db.Column(db.Integer, primary_key=True)
    
    # CORREÇÃO 2: Use o nome da TABELA.coluna ('dim_faixas.id_faixa')
    id_faixa = db.Column(db.Integer, db.ForeignKey('dim_faixas.id_faixa'))
    id_local = db.Column(db.Integer, db.ForeignKey('dim_locais.id_local'))
    id_sexo = db.Column(db.Integer, db.ForeignKey('dim_sexo.id_sexo'))
    ano = db.Column(db.Integer)
    # Dados atuariais (assumindo que estão na dimensão por enquanto)
    nqx = db.Column(db.Float)
    nMx = db.Column(db.Float)
    nAx = db.Column(db.Float)
    ndx = db.Column(db.Float)
    nLx = db.Column(db.Float)
    Tx = db.Column(db.Float)
    ex = db.Column(db.Float)

    # Função para transformar este objeto em JSON legível
    def to_dict(self):
        return {
            "id": self.id,
            "ano": self.ano,
            # Graças ao backref nos relacionamentos, podemos acessar os nomes direto:
            "local": self.local.nome_local if self.local else None,
            "sexo": self.sexo.descricao if self.sexo else None,
            "faixa_etaria": self.faixa.descricao if self.faixa else None,
            
        }

# ============================================
# ROTAS DA API
# ============================================

@app.route('/sigerip/tabua-mortalidade', methods=['GET'])
def get_tabua_mortalidade():
    """
    Retorna a tábua de mortalidade paginada
    ---
    parameters:
      - name: ano
        in: query
        type: integer
        description: Filtra por ano máximo
      - name: sexo
        in: query
        enum: ['Masculino', 'Feminino', 'Ambos']
        type: string
        description: Filtra por sexo
      - name: local
        in: query
        type: string
        description: Filtra por local
      - name: faixa
        in: query
        type: string
        enum: ['0', '1-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80-84', '85-89', '90+']

      - name: page
        in: query
        type: integer
        default: 1
      - name: per_page
        in: query
        type: integer
        default: 100
    responses:
      200:
        description: Lista de dados atuariais
    """

    #Filtros
    filtro_local = request.args.get('local', type=str)
    filtro_sexo = request.args.get('sexo')
    filtro_faixa = request.args.get('faixa')
    filtro_ano = request.args.get('ano')

    # 2. Inicia a Query base (SELECT * FROM fato_projecoes)
    query = TabuaMortalidade.query

    # 3. Aplica os filtros dinamicamente
    # Filtro por LOCAL (precisa de JOIN pois o nome está na DimLocal)
    if filtro_local:
        query = query.join(DimLocal).filter(DimLocal.nome_local == filtro_local)
    
    # Filtro por SEXO (precisa de JOIN)
    if filtro_sexo:
        query = query.join(DimSexo).filter(DimSexo.descricao == filtro_sexo)

    # Filtro por FAIXA ETÁRIA (precisa de JOIN)
    if filtro_faixa:
        query = query.join(DimFaixa).filter(DimFaixa.descricao == filtro_faixa)

    # Filtro por ANO (está direto na tabela Fato, não precisa de JOIN)
    if filtro_ano:
        query = query.filter(TabuaMortalidade.ano == int(filtro_ano))

    # Paginação
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 100, type=int)
    
    # Faz a query paginada
    paginacao = query.paginate(page=page, per_page=per_page, error_out=False)
    print(f"DEBUG: Recebi Local: '{filtro_local}'")
    print(f"DEBUG: Recebi Sexo: '{filtro_sexo}'")
    # Monta a resposta usando o método to_dict() que criamos
    return jsonify({
        'data': [item.to_dict() for item in paginacao.items],
        'total': paginacao.total,
        'page': paginacao.page,
        'per_page': paginacao.per_page,
        'pages': paginacao.pages
    })

# ============================================
# EXECUÇÃO
# ============================================

if __name__ == '__main__':
    # Cria o banco se não existir
    with app.app_context():
        db.create_all()
        
    print(f"API rodando em: http://0.0.0.0:8001")
    print(f"Documentação Swagger: http://localhost:8001/apidocs")
    app.run(host='0.0.0.0', port=8001, debug=True)
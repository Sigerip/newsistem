from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

# Configuração do Flask
app = Flask(__name__)

# Configuração do banco de dados SQLite
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, 'mortalidade.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DATABASE_PATH}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configuração de CORS para permitir frontend
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

class TabuaMortalidade(db.Model):
    __tablename__ = 'tabua_mortalidade'
    id = db.Column(db.Integer, primary_key=True)
    ano = db.Column(db.Integer)
    faixa_etaria = db.Column(db.Integer)
    local = db.Column(db.String(100))
    sexo = db.Column(db.String(20))
    nMx = db.Column(db.Float)
    nqx = db.Column(db.Float)
    lx = db.Column(db.Float)
    ndx = db.Column(db.Float)
    nLx = db.Column(db.Float)
    Tx = db.Column(db.Float)
    ex = db.Column(db.Float)

class MortalidadeInfantil(db.Model):
    __tablename__ = 'mortalidade_infantil'
    id = db.Column(db.Integer, primary_key=True)
    ano = db.Column(db.Integer)
    taxa = db.Column(db.Float)
    local = db.Column(db.String(100))

class PrevisaoLC(db.Model):
    __tablename__ = 'previsao_lc'
    id = db.Column(db.Integer, primary_key=True)
    ano = db.Column(db.Integer)
    faixa_etaria = db.Column(db.Integer)
    sexo = db.Column(db.String(20))
    nMx = db.Column(db.Float)
    nqx = db.Column(db.Float)
    lx = db.Column(db.Float)
    ndx = db.Column(db.Float)
    nLx = db.Column(db.Float)
    Tx = db.Column(db.Float)
    ex = db.Column(db.Float)
    modelo = db.Column(db.String(50))

class PrevisaoLM(db.Model):
    __tablename__ = 'previsao_lm'
    id = db.Column(db.Integer, primary_key=True)
    ano = db.Column(db.Integer)
    faixa_etaria = db.Column(db.Integer)
    sexo = db.Column(db.String(20))
    nMx = db.Column(db.Float)
    nqx = db.Column(db.Float)
    lx = db.Column(db.Float)
    ndx = db.Column(db.Float)
    nLx = db.Column(db.Float)
    Tx = db.Column(db.Float)
    ex = db.Column(db.Float)
    modelo = db.Column(db.String(50))

class PrevisaoCombinada(db.Model):
    __tablename__ = 'previsao_combinada'
    id = db.Column(db.Integer, primary_key=True)
    ano = db.Column(db.Integer)
    faixa_etaria = db.Column(db.Integer)
    sexo = db.Column(db.String(20))
    nMx = db.Column(db.Float)
    nqx = db.Column(db.Float)
    lx = db.Column(db.Float)
    ndx = db.Column(db.Float)
    nLx = db.Column(db.Float)
    Tx = db.Column(db.Float)
    ex = db.Column(db.Float)
    modelo = db.Column(db.String(50))

class PrevisaoARIMAETS(db.Model):
    __tablename__ = 'previsao_arima_ets'
    id = db.Column(db.Integer, primary_key=True)
    ano = db.Column(db.Integer)
    faixa_etaria = db.Column(db.Integer)
    sexo = db.Column(db.String(20))
    nMx = db.Column(db.Float)
    nqx = db.Column(db.Float)
    lx = db.Column(db.Float)
    ndx = db.Column(db.Float)
    nLx = db.Column(db.Float)
    Tx = db.Column(db.Float)
    ex = db.Column(db.Float)
    modelo = db.Column(db.String(50))

# ============================================
# FUNÇÕES AUXILIARES
# ============================================

def model_to_dict(model):
    """Converte um modelo SQLAlchemy para dicionário"""
    return {column.name: getattr(model, column.name) for column in model.__table__.columns}

def paginate_query(query, page=1, per_page=100):
    """Paginação de query"""
    total = query.count()
    items = query.offset((page - 1) * per_page).limit(per_page).all()
    return {
        'data': [model_to_dict(item) for item in items],
        'total': total,
        'page': page,
        'per_page': per_page,
        'pages': (total + per_page - 1) // per_page
    }

# ============================================
# ROTAS DE SISTEMA
# ============================================

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    try:
        db.session.execute(db.text('SELECT 1'))
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'version': '1.0.0'
        })
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'database': 'disconnected',
            'error': str(e)
        }), 500

@app.route('/database/status', methods=['GET'])
def database_status():
    """Retorna status do banco de dados com contagem de registros"""
    try:
        counts = {
            'tabua_mortalidade': TabuaMortalidade.query.count(),
            'mortalidade_infantil': MortalidadeInfantil.query.count(),
            'previsao_lc': PrevisaoLC.query.count(),
            'previsao_lm': PrevisaoLM.query.count(),
            'previsao_combinada': PrevisaoCombinada.query.count(),
            'previsao_arima_ets': PrevisaoARIMAETS.query.count()
        }
        return jsonify({
            'status': 'connected',
            'tables': counts,
            'total_records': sum(counts.values())
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================
# ROTAS DE TÁBUA DE MORTALIDADE
# ============================================

@app.route('/sigerip/tabua-mortalidade', methods=['GET'])
def get_tabua_mortalidade():
    """Lista tábuas de mortalidade com filtros opcionais"""
    query = TabuaMortalidade.query
    
    # Filtros
    ano_inicio = request.args.get('ano_inicio', type=int)
    ano_fim = request.args.get('ano_fim', type=int)
    sexo = request.args.get('sexo')
    local = request.args.get('local')
    faixa_etaria = request.args.get('faixa_etaria', type=int)
    
    if ano_inicio:
        query = query.filter(TabuaMortalidade.ano >= ano_inicio)
    if ano_fim:
        query = query.filter(TabuaMortalidade.ano <= ano_fim)
    if sexo:
        query = query.filter(TabuaMortalidade.sexo == sexo)
    if local:
        query = query.filter(TabuaMortalidade.local == local)
    if faixa_etaria is not None:
        query = query.filter(TabuaMortalidade.faixa_etaria == faixa_etaria)
    
    query = query.order_by(TabuaMortalidade.ano, TabuaMortalidade.faixa_etaria)
    
    # Paginação
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 100, type=int)
    
    return jsonify(paginate_query(query, page, per_page))

@app.route('/sigerip/tabua-mortalidade/<int:id>', methods=['GET'])
def get_tabua_mortalidade_by_id(id):
    """Retorna uma tábua de mortalidade por ID"""
    item = TabuaMortalidade.query.get_or_404(id)
    return jsonify(model_to_dict(item))

@app.route('/sigerip/tabua-mortalidade/anos', methods=['GET'])
def get_tabua_mortalidade_anos():
    """Lista anos disponíveis"""
    anos = db.session.query(TabuaMortalidade.ano).distinct().order_by(TabuaMortalidade.ano).all()
    return jsonify([ano[0] for ano in anos])

@app.route('/sigerip/tabua-mortalidade/locais', methods=['GET'])
def get_tabua_mortalidade_locais():
    """Lista locais disponíveis"""
    locais = db.session.query(TabuaMortalidade.local).distinct().order_by(TabuaMortalidade.local).all()
    return jsonify([local[0] for local in locais if local[0]])

# ============================================
# ROTAS DE MORTALIDADE INFANTIL
# ============================================

@app.route('/sigerip/mortalidade-infantil', methods=['GET'])
def get_mortalidade_infantil():
    """Lista mortalidade infantil com filtros"""
    query = MortalidadeInfantil.query
    
    ano_inicio = request.args.get('ano_inicio', type=int)
    ano_fim = request.args.get('ano_fim', type=int)
    local = request.args.get('local')
    
    if ano_inicio:
        query = query.filter(MortalidadeInfantil.ano >= ano_inicio)
    if ano_fim:
        query = query.filter(MortalidadeInfantil.ano <= ano_fim)
    if local:
        query = query.filter(MortalidadeInfantil.local == local)
    
    query = query.order_by(MortalidadeInfantil.ano)
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 100, type=int)
    
    return jsonify(paginate_query(query, page, per_page))

# ============================================
# ROTAS DE PREVISÕES
# ============================================

@app.route('/sigerip/previsoes/lc', methods=['GET'])
def get_previsoes_lc():
    """Lista previsões Lee-Carter"""
    query = PrevisaoLC.query
    
    ano_inicio = request.args.get('ano_inicio', type=int)
    ano_fim = request.args.get('ano_fim', type=int)
    sexo = request.args.get('sexo')
    faixa_etaria = request.args.get('faixa_etaria', type=int)
    
    if ano_inicio:
        query = query.filter(PrevisaoLC.ano >= ano_inicio)
    if ano_fim:
        query = query.filter(PrevisaoLC.ano <= ano_fim)
    if sexo:
        query = query.filter(PrevisaoLC.sexo == sexo)
    if faixa_etaria is not None:
        query = query.filter(PrevisaoLC.faixa_etaria == faixa_etaria)
    
    query = query.order_by(PrevisaoLC.ano, PrevisaoLC.faixa_etaria)
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 100, type=int)
    
    return jsonify(paginate_query(query, page, per_page))

@app.route('/sigerip/previsoes/lm', methods=['GET'])
def get_previsoes_lm():
    """Lista previsões Lee-Miller"""
    query = PrevisaoLM.query
    
    ano_inicio = request.args.get('ano_inicio', type=int)
    ano_fim = request.args.get('ano_fim', type=int)
    sexo = request.args.get('sexo')
    faixa_etaria = request.args.get('faixa_etaria', type=int)
    
    if ano_inicio:
        query = query.filter(PrevisaoLM.ano >= ano_inicio)
    if ano_fim:
        query = query.filter(PrevisaoLM.ano <= ano_fim)
    if sexo:
        query = query.filter(PrevisaoLM.sexo == sexo)
    if faixa_etaria is not None:
        query = query.filter(PrevisaoLM.faixa_etaria == faixa_etaria)
    
    query = query.order_by(PrevisaoLM.ano, PrevisaoLM.faixa_etaria)
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 100, type=int)
    
    return jsonify(paginate_query(query, page, per_page))

@app.route('/sigerip/previsoes/combinada', methods=['GET'])
def get_previsoes_combinada():
    """Lista previsões combinadas"""
    query = PrevisaoCombinada.query
    
    ano_inicio = request.args.get('ano_inicio', type=int)
    ano_fim = request.args.get('ano_fim', type=int)
    sexo = request.args.get('sexo')
    faixa_etaria = request.args.get('faixa_etaria', type=int)
    
    if ano_inicio:
        query = query.filter(PrevisaoCombinada.ano >= ano_inicio)
    if ano_fim:
        query = query.filter(PrevisaoCombinada.ano <= ano_fim)
    if sexo:
        query = query.filter(PrevisaoCombinada.sexo == sexo)
    if faixa_etaria is not None:
        query = query.filter(PrevisaoCombinada.faixa_etaria == faixa_etaria)
    
    query = query.order_by(PrevisaoCombinada.ano, PrevisaoCombinada.faixa_etaria)
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 100, type=int)
    
    return jsonify(paginate_query(query, page, per_page))

@app.route('/sigerip/previsoes/arima-ets', methods=['GET'])
def get_previsoes_arima_ets():
    """Lista previsões ARIMA-ETS"""
    query = PrevisaoARIMAETS.query
    
    ano_inicio = request.args.get('ano_inicio', type=int)
    ano_fim = request.args.get('ano_fim', type=int)
    sexo = request.args.get('sexo')
    faixa_etaria = request.args.get('faixa_etaria', type=int)
    
    if ano_inicio:
        query = query.filter(PrevisaoARIMAETS.ano >= ano_inicio)
    if ano_fim:
        query = query.filter(PrevisaoARIMAETS.ano <= ano_fim)
    if sexo:
        query = query.filter(PrevisaoARIMAETS.sexo == sexo)
    if faixa_etaria is not None:
        query = query.filter(PrevisaoARIMAETS.faixa_etaria == faixa_etaria)
    
    query = query.order_by(PrevisaoARIMAETS.ano, PrevisaoARIMAETS.faixa_etaria)
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 100, type=int)
    
    return jsonify(paginate_query(query, page, per_page))

@app.route('/sigerip/previsoes/anos', methods=['GET'])
def get_previsoes_anos():
    """Lista anos disponíveis nas previsões"""
    anos_lc = db.session.query(PrevisaoLC.ano).distinct().all()
    anos_lm = db.session.query(PrevisaoLM.ano).distinct().all()
    anos_comb = db.session.query(PrevisaoCombinada.ano).distinct().all()
    
    todos_anos = set([a[0] for a in anos_lc + anos_lm + anos_comb])
    return jsonify(sorted(list(todos_anos)))

# ============================================
# ROTAS DE EXPECTATIVA DE VIDA
# ============================================

@app.route('/sigerip/expectativa-vida', methods=['GET'])
def get_expectativa_vida():
    """Retorna expectativa de vida (ex) filtrada"""
    query = TabuaMortalidade.query
    
    ano = request.args.get('ano', type=int)
    sexo = request.args.get('sexo')
    faixa_etaria = request.args.get('faixa_etaria', 0, type=int)
    
    if ano:
        query = query.filter(TabuaMortalidade.ano == ano)
    if sexo:
        query = query.filter(TabuaMortalidade.sexo == sexo)
    
    query = query.filter(TabuaMortalidade.faixa_etaria == faixa_etaria)
    query = query.order_by(TabuaMortalidade.ano)
    
    results = query.all()
    return jsonify([{
        'ano': r.ano,
        'sexo': r.sexo,
        'local': r.local,
        'faixa_etaria': r.faixa_etaria,
        'ex': r.ex
    } for r in results])

# ============================================
# ROTA PRINCIPAL
# ============================================

@app.route('/', methods=['GET'])
def index():
    """Página inicial da API"""
    return jsonify({
        'api': 'SIGERIP API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/health',
            'database_status': '/database/status',
            'tabua_mortalidade': '/sigerip/tabua-mortalidade',
            'mortalidade_infantil': '/sigerip/mortalidade-infantil',
            'previsoes_lc': '/sigerip/previsoes/lc',
            'previsoes_lm': '/sigerip/previsoes/lm',
            'previsoes_combinada': '/sigerip/previsoes/combinada',
            'previsoes_arima_ets': '/sigerip/previsoes/arima-ets',
            'expectativa_vida': '/sigerip/expectativa-vida'
        }
    })

# ============================================
# EXECUÇÃO
# ============================================

if __name__ == '__main__':
    print("Iniciando servidor Flask...")
    print(f"Database: {DATABASE_PATH}")
    app.run(host='0.0.0.0', port=8000, debug=True)

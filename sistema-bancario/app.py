from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import sqlite3
from datetime import date, datetime

app = Flask(__name__)
CORS(app)

# Configurações globais do sistema bancário
LIMITE_SAQUES = 3
LIMITE_TRANSACOES = 10
LIMITE_VALOR_SAQUE = 500

def inicializar_banco():
    conn = sqlite3.connect('banco.db')
    cursor = conn.cursor()
    
    # Criar tabela de usuários com campo de senha
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuarios (
            cpf TEXT PRIMARY KEY,
            nome TEXT NOT NULL,
            senha TEXT NOT NULL,
            data_nascimento TEXT NOT NULL,
            endereco TEXT NOT NULL,
            saldo FLOAT DEFAULT 4000.0,
            numero_saques INTEGER DEFAULT 0,
            numero_transacoes INTEGER DEFAULT 0
        )
    ''')
    
    # Criar tabela de transações com campos adicionais para transferência
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transacoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cpf_usuario TEXT,
            tipo TEXT,
            valor FLOAT,
            data TEXT,
            hora TEXT,
            cpf_destino TEXT,
            banco TEXT,
            agencia TEXT,
            conta TEXT,
            tipo_conta TEXT,
            FOREIGN KEY (cpf_usuario) REFERENCES usuarios (cpf)
        )
    ''')
    
    conn.commit()
    conn.close()

# Rotas para páginas
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

# Rotas da API
@app.route('/api/cadastro', methods=['POST'])
def cadastro():
    try:
        data = request.json
        conn = sqlite3.connect('banco.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO usuarios (nome, cpf, senha, data_nascimento, endereco)
            VALUES (?, ?, ?, ?, ?)
        ''', (data['nome'], data['cpf'], data['senha'], data['dataNascimento'], data['endereco']))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Usuário cadastrado com sucesso!'
        })
        
    except sqlite3.IntegrityError:
        return jsonify({
            'success': False,
            'message': 'CPF já cadastrado!'
        }), 400
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        cpf = data.get('cpf')
        senha = data.get('senha')
        
        conn = sqlite3.connect('banco.db')
        cursor = conn.cursor()
        
        cursor.execute('SELECT nome, senha FROM usuarios WHERE cpf = ?', (cpf,))
        usuario = cursor.fetchone()
        conn.close()
        
        if usuario and usuario[1] == senha:  # Aqui você deve usar hash da senha
            return jsonify({
                'success': True,
                'nome': usuario[0]
            })
        else:
            return jsonify({
                'success': False,
                'message': 'CPF ou senha incorretos'
            }), 401
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/transacao', methods=['POST'])
def transacao():
    try:
        data = request.json
        cpf = data.get('cpf')
        tipo = data.get('tipo')
        valor = float(data.get('valor'))
        
        # Dados adicionais para transferência
        if tipo == 'transferencia':
            cpf_destino = data.get('cpfDestino')
            banco = data.get('banco')
            agencia = data.get('agencia')
            conta = data.get('conta')
            tipo_conta = data.get('tipoConta')
            
            # Validar dados da transferência
            if not all([cpf_destino, banco, agencia, conta, tipo_conta]):
                return jsonify({
                    'success': False,
                    'message': 'Todos os campos são obrigatórios para transferência'
                }), 400

        conn = sqlite3.connect('banco.db')
        cursor = conn.cursor()
        
        # Verificar limites e saldo
        cursor.execute('''
            SELECT saldo, numero_saques, numero_transacoes 
            FROM usuarios 
            WHERE cpf = ?
        ''', (cpf,))
        resultado = cursor.fetchone()
        
        if not resultado:
            conn.close()
            return jsonify({
                'success': False,
                'message': 'Usuário não encontrado'
            }), 404
            
        saldo_atual, num_saques, num_transacoes = resultado
        
        # Verificar limites
        if num_transacoes >= LIMITE_TRANSACOES:
            conn.close()
            return jsonify({
                'success': False,
                'message': f'Limite de {LIMITE_TRANSACOES} transações diárias atingido'
            }), 400
            
        if tipo == 'saque':
            if num_saques >= LIMITE_SAQUES:
                conn.close()
                return jsonify({
                    'success': False,
                    'message': f'Limite de {LIMITE_SAQUES} saques diários atingido'
                }), 400
                
            if valor > LIMITE_VALOR_SAQUE:
                conn.close()
                return jsonify({
                    'success': False,
                    'message': f'Valor máximo por saque é R$ {LIMITE_VALOR_SAQUE}'
                }), 400
        
        if tipo in ['saque', 'transferencia'] and valor > saldo_atual:
            conn.close()
            return jsonify({
                'success': False,
                'message': 'Saldo insuficiente'
            }), 400
        
        # Atualizar saldo e contadores
        novo_saldo = saldo_atual + valor if tipo == 'deposito' else saldo_atual - valor
        novo_num_saques = num_saques + 1 if tipo == 'saque' else num_saques
        novo_num_transacoes = num_transacoes + 1
        
        cursor.execute('''
            UPDATE usuarios 
            SET saldo = ?, numero_saques = ?, numero_transacoes = ? 
            WHERE cpf = ?
        ''', (novo_saldo, novo_num_saques, novo_num_transacoes, cpf))
        
        # Registrar transação
        hora_atual = datetime.now().strftime('%H:%M:%S')
        if tipo == 'transferencia':
            cursor.execute('''
                INSERT INTO transacoes (
                    cpf_usuario, tipo, valor, data, hora, 
                    cpf_destino, banco, agencia, conta, tipo_conta
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                cpf, tipo, valor, date.today().strftime('%Y-%m-%d'), 
                hora_atual,
                cpf_destino, banco, agencia, conta, tipo_conta
            ))
        else:
            cursor.execute('''
                INSERT INTO transacoes (cpf_usuario, tipo, valor, data, hora)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                cpf, tipo, valor, date.today().strftime('%Y-%m-%d'),
                hora_atual
            ))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'saldo': novo_saldo,
            'message': f'{tipo.capitalize()} realizado com sucesso!'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/extrato/<cpf>', methods=['GET'])
def extrato(cpf):
    try:
        conn = sqlite3.connect('banco.db')
        cursor = conn.cursor()
        
        # Pegar saldo atual
        cursor.execute('SELECT saldo FROM usuarios WHERE cpf = ?', (cpf,))
        saldo = cursor.fetchone()[0]
        
        # Pegar transações com todos os detalhes
        cursor.execute('''
            SELECT tipo, valor, data, hora, cpf_destino, banco, agencia, conta, tipo_conta
            FROM transacoes 
            WHERE cpf_usuario = ? 
            ORDER BY id DESC
        ''', (cpf,))
        
        transacoes = cursor.fetchall()
        conn.close()
        
        return jsonify({
            'success': True,
            'saldo': saldo,
            'transacoes': [
                {
                    'tipo': t[0],
                    'valor': t[1],
                    'data': t[2],
                    'hora': t[3],
                    'cpf_destino': t[4],
                    'banco': t[5],
                    'agencia': t[6],
                    'conta': t[7],
                    'tipo_conta': t[8]
                }
                for t in transacoes
            ]
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/limpar_contadores', methods=['POST'])
def limpar_contadores():
    try:
        conn = sqlite3.connect('banco.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE usuarios 
            SET numero_saques = 0, numero_transacoes = 0
        ''')
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Contadores resetados com sucesso!'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

if __name__ == '__main__':
    inicializar_banco()
    app.run(debug=True)
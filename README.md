# sistema-bancario-digital-python
Sistema bancário desenvolvido com Python (Flask) e interface web moderna, oferecendo funcionalidades essenciais de um banco digital.
Sistema Bancário Digital
📋 Descrição
Sistema bancário desenvolvido com Python (Flask) e interface web moderna, oferecendo funcionalidades essenciais de um banco digital.
🛠️ Funcionalidades
Autenticação e Segurança
Cadastro de usuários com validação de CPF
Login seguro com senha
Sistema de sessão para proteção das rotas
Logout com limpeza de dados
Operações Bancárias
Depósito
Atualização instantânea do saldo
Registro no extrato
Saque
Verificação de saldo disponível
Limite por operação (R$ 500,00)
Controle de quantidade diária (3 saques)
Transferência
Dados completos do destinatário
Registro de banco, agência e conta
Validação de saldo disponível
Extrato
Histórico detalhado de transações
Data e hora das operações
Informações completas das transferências
Saldo atual
Interface
Design responsivo
Dashboard intuitivo
Visualização das últimas 3 transações
Modal para operações
Feedback visual das ações
🚀 Tecnologias Utilizadas
Backend
Python
Flask
SQLite3
Flask-CORS
Frontend
HTML5
CSS3
JavaScript
Font Awesome (ícones)
📊 Banco de Dados
Tabela: usuarios
cpf (PRIMARY KEY)
nome
senha
data_nascimento
endereco
saldo
numero_saques
numero_transacoes
Tabela: transacoes
id (PRIMARY KEY)
cpf_usuario (FOREIGN KEY)
tipo
valor
data
hora
cpf_destino
banco
agencia
conta
tipo_conta
🔒 Regras de Negócio
Limite de 3 saques diários
Valor máximo por saque: R$ 500,00
CPF único por usuário
Senha obrigatória para cadastro
Validação de saldo para saques e transferências
🔄 Atualizações Futuras Planejadas
[ ] Implementação de criptografia de senha
[ ] Sistema de recuperação de senha
[ ] Notificações por email
[ ] Comprovantes em PDF
[ ] Histórico de login
[ ] Perfil do usuário com foto
👥 Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para:
Fazer um fork do projeto
Criar uma branch para sua feature
Commitar suas mudanças
Fazer push para a branch
Abrir um Pull Request
📄 Licença
Este projeto está sob a licença MIT.
📞 Contato
[Seu Nome]
Email: [seu-email]
LinkedIn: [seu-linkedin]
GitHub: [seu-github]

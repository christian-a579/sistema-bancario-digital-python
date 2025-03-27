Sistema Bancário Digital
## 📋 Descrição
Sistema bancário desenvolvido com Python (Flask) e interface web moderna, oferecendo funcionalidades essenciais de um banco digital.

## 🛠️ Funcionalidades
- Autenticação e Segurança
- Cadastro de usuários com validação de CPF
- Login seguro com senha
- Sistema de sessão para proteção das rotas
- Logout com limpeza de dados

## 💲Operações Bancárias
- Depósito
     - Atualização instantânea do saldo
     - Registro no extrato
- Saque
     - Verificação de saldo disponível
     - Limite por operação (R$ 500,00)
     - Controle de quantidade diária (3 saques)
- Transferência
     - Dados completos do destinatário
     - Registro de banco, agência e conta
     - Validação de saldo disponível
- Extrato
     - Histórico detalhado de transações
     - Data e hora das operações
     - Informações completas das transferências
     - Saldo atual
       
## 🌐 Interface
- Design responsivo
- Dashboard intuitivo
- Visualização das últimas 3 transações
- Modal para operações
- Feedback visual das ações

## 🚀 Tecnologias Utilizadas
- Backend
     - Python
     - Flask
     - SQLite3
     - Flask-CORS
- Frontend
     - HTML5
     - CSS3
     - JavaScript
     - Font Awesome (ícones)

 ## 📊 Banco de Dados
 - Tabela: usuarios
 - Tabela: transacoes

## 🔒 Regras de Negócio
- Limite de 3 saques diários
- Valor máximo por saque: R$ 500,00
- CPF único por usuário
- Senha obrigatória para cadastro
- Validação de saldo para saques e transferências

## 👥 Contribuição
- Contribuições são bem-vindas! Sinta-se à vontade para:
- Fazer um fork do projeto
- Criar uma branch para sua feature
- Commitar suas mudanças
- Fazer push para a branch
- Abrir um Pull Request

## 📄 Licença
Este projeto está sob a licença MIT.

## 📞 Contato
Christian Alves
- Email: ca3072907@gmail.com
- LinkedIn: https://www.linkedin.com/in/christian-alves-de-souza-2a4a47327/
- GitHub: https://github.com/christian-a579

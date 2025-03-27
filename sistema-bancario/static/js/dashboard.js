// Variáveis globais
let saldoAtual = 0;
const cpfUsuario = localStorage.getItem("cpfUsuario");

// Carregar dados iniciais
async function carregarDados() {
  try {
    const response = await fetch(`/api/extrato/${cpfUsuario}`);
    const data = await response.json();
    if (data.success) {
      saldoAtual = data.saldo;
      atualizarSaldo();
      atualizarTransacoes(data.transacoes);
      atualizarUltimasTransacoes();
    }
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
}

// Atualizar saldo na tela
function atualizarSaldo() {
  document.getElementById("saldo").textContent = `R$ ${saldoAtual.toFixed(2)}`;
}

// Mostrar modal de operação
function showModal(tipo) {
  const modal = document.getElementById("operacaoModal");
  const title = document.getElementById("modalTitle");
  const camposTransferencia = document.getElementById("camposTransferencia");

  modal.style.display = "block";
  title.textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);
  modal.dataset.tipo = tipo;

  // Mostrar campos adicionais apenas para transferência
  if (tipo === "transferencia") {
    camposTransferencia.style.display = "block";
    document.getElementById("cpfDestino").required = true;
    document.getElementById("banco").required = true;
    document.getElementById("agencia").required = true;
    document.getElementById("conta").required = true;
    document.getElementById("tipoConta").required = true;
  } else {
    camposTransferencia.style.display = "none";
    document.getElementById("cpfDestino").required = false;
    document.getElementById("banco").required = false;
    document.getElementById("agencia").required = false;
    document.getElementById("conta").required = false;
    document.getElementById("tipoConta").required = false;
  }
}

// Fechar modal
function closeModal() {
  document.getElementById("operacaoModal").style.display = "none";
  document.getElementById("operacaoForm").reset();
}

// Lidar com operações
async function handleOperacao(event) {
  event.preventDefault();
  const tipo = document.getElementById("operacaoModal").dataset.tipo;
  const valor = parseFloat(document.getElementById("valor").value);

  let dadosOperacao = {
    cpf: cpfUsuario,
    tipo: tipo,
    valor: valor,
  };

  // Adicionar dados de transferência se necessário
  if (tipo === "transferencia") {
    dadosOperacao = {
      ...dadosOperacao,
      cpfDestino: document.getElementById("cpfDestino").value,
      banco: document.getElementById("banco").value,
      agencia: document.getElementById("agencia").value,
      conta: document.getElementById("conta").value,
      tipoConta: document.getElementById("tipoConta").value,
    };
  }

  try {
    const response = await fetch("/api/transacao", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosOperacao),
    });

    const data = await response.json();

    if (data.success) {
      saldoAtual = data.saldo;
      atualizarSaldo();
      atualizarUltimasTransacoes();
      await carregarDados();
      closeModal();
      alert(
        `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} realizado com sucesso!`
      );
    } else {
      alert(data.message || "Erro na operação");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao realizar operação");
  }
}

// Função para mostrar o extrato
function showExtrato() {
  const modal = document.getElementById("extratoModal");
  modal.style.display = "block";

  // Atualizar saldo no modal
  document.getElementById(
    "extratoSaldo"
  ).textContent = `R$ ${saldoAtual.toFixed(2)}`;

  // Carregar transações
  fetch(`/api/extrato/${cpfUsuario}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const extratoList = document.getElementById("extratoList");
        if (data.transacoes.length === 0) {
          extratoList.innerHTML =
            "<p class='no-transactions'>Nenhuma transação realizada</p>";
          return;
        }

        extratoList.innerHTML = data.transacoes
          .map((t) => {
            let detalhes = "";
            if (t.tipo === "transferencia") {
              detalhes = `
                <div class="transacao-detalhes">
                  <p>Destinatário: ${t.cpf_destino}</p>
                  <p>Banco: ${t.banco}</p>
                  <p>Agência: ${t.agencia}</p>
                  <p>Conta: ${t.conta}</p>
                  <p>Tipo de Conta: ${t.tipo_conta}</p>
                </div>
              `;
            }

            return `
              <div class="transacao ${t.tipo.toLowerCase()}">
                <div class="transacao-info">
                  <div class="transacao-principal">
                    <span class="transacao-tipo">${
                      t.tipo.charAt(0).toUpperCase() + t.tipo.slice(1)
                    }</span>
                    <span class="transacao-data">${t.data} ${t.hora}</span>
                  </div>
                  ${detalhes}
                </div>
                <span class="transacao-valor ${
                  t.tipo === "deposito" ? "positivo" : "negativo"
                }">
                  ${t.tipo === "deposito" ? "+" : "-"} R$ ${Math.abs(
              t.valor
            ).toFixed(2)}
                </span>
              </div>
            `;
          })
          .join("");
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar extrato:", error);
      alert("Erro ao carregar extrato");
    });
}

// Função para fechar o modal do extrato
function closeExtratoModal() {
  const modal = document.getElementById("extratoModal");
  modal.style.display = "none";
}

// Função para atualizar as últimas transações no dashboard
function atualizarUltimasTransacoes() {
  fetch(`/api/extrato/${cpfUsuario}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const container = document.getElementById("ultimasTransacoes");
        const transacoes = data.transacoes.slice(0, 3); // Pega apenas as 3 últimas

        if (transacoes.length === 0) {
          container.innerHTML =
            '<p class="sem-transacoes">Nenhuma transação realizada</p>';
          return;
        }

        container.innerHTML = transacoes
          .map((t) => {
            let valorFormatado = `${
              t.tipo === "deposito" ? "+" : "-"
            } R$ ${Math.abs(t.valor).toFixed(2)}`;
            let dataFormatada = new Date(t.data + " " + t.hora).toLocaleString(
              "pt-BR",
              {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              }
            );

            return `
              <div class="mini-transacao ${t.tipo.toLowerCase()}">
                <div class="mini-transacao-info">
                  <span class="mini-transacao-tipo">
                    ${t.tipo.charAt(0).toUpperCase() + t.tipo.slice(1)}
                  </span>
                  <span class="mini-transacao-data">${dataFormatada}</span>
                </div>
                <span class="mini-transacao-valor ${
                  t.tipo === "deposito" ? "positivo" : "negativo"
                }">
                  ${valorFormatado}
                </span>
              </div>
            `;
          })
          .join("");
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar últimas transações:", error);
    });
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  carregarDados();
});

// Fechar modais quando clicar fora
window.onclick = function (event) {
  const operacaoModal = document.getElementById("operacaoModal");
  const extratoModal = document.getElementById("extratoModal");

  if (event.target === operacaoModal) {
    closeModal();
  }
  if (event.target === extratoModal) {
    closeExtratoModal();
  }
};

function logout() {
  // Limpar dados do localStorage
  localStorage.removeItem("cpfUsuario");
  localStorage.removeItem("nomeUsuario");

  // Redirecionar para a página de login
  window.location.href = "/";
}

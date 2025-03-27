document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const cadastroForm = document.getElementById("cadastroForm");
  const showCadastro = document.getElementById("showCadastro");
  const showLogin = document.getElementById("showLogin");

  // Alternar entre formulários
  showCadastro.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.remove("active");
    cadastroForm.classList.add("active");
  });

  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    cadastroForm.classList.remove("active");
    loginForm.classList.add("active");
  });

  // Login
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const cpf = document.getElementById("cpfLogin").value;
    const senha = document.getElementById("senhaLogin").value;

    if (!validarCPF(cpf)) {
      alert("CPF inválido!");
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cpf, senha }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("cpfUsuario", cpf);
        localStorage.setItem("nomeUsuario", data.nome);
        window.location.href = "/dashboard";
      } else {
        alert(data.message || "CPF ou senha incorretos");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao fazer login");
    }
  });

  // Cadastro
  cadastroForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const senha = document.getElementById("senhaCadastro").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    const dados = {
      nome: document.getElementById("nome").value,
      cpf: document.getElementById("cpfCadastro").value,
      senha: senha,
      dataNascimento: document.getElementById("dataNascimento").value,
      endereco: document.getElementById("endereco").value,
    };

    if (!validarCPF(dados.cpf)) {
      alert("CPF inválido!");
      return;
    }

    try {
      const response = await fetch("/api/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      const data = await response.json();

      if (data.success) {
        alert("Cadastro realizado com sucesso!");
        toggleForms(); // Volta para o login
      } else {
        alert(data.message || "Erro ao cadastrar usuário");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao cadastrar usuário");
    }
  });
});

function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const icon = input.nextElementSibling;

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const cpf = document.getElementById("cpfLogin").value;
  const senha = document.getElementById("senhaLogin").value;

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cpf, senha }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("cpfUsuario", cpf);
      localStorage.setItem("nomeUsuario", data.nome);
      window.location.href = "/dashboard";
    } else {
      alert(data.message || "CPF ou senha incorretos");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao fazer login");
  }
}

async function handleCadastro(event) {
  event.preventDefault();
  const senha = document.getElementById("senhaCadastro").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;

  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem!");
    return;
  }

  const dados = {
    nome: document.getElementById("nome").value,
    cpf: document.getElementById("cpfCadastro").value,
    senha: senha,
    dataNascimento: document.getElementById("dataNascimento").value,
    endereco: document.getElementById("endereco").value,
  };

  try {
    const response = await fetch("/api/cadastro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    const data = await response.json();

    if (data.success) {
      alert("Cadastro realizado com sucesso!");
      toggleForms(); // Volta para o login
    } else {
      alert(data.message || "Erro ao cadastrar usuário");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao cadastrar usuário");
  }
}

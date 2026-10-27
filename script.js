// Demonstração: nenhum dado é enviado ou salvo.
var mensagem = document.getElementById("mensagem");
var formLogin = document.getElementById("form-login");
var formCadastro = document.getElementById("form-cadastro");
var mostrarSenha = document.getElementById("mostrar-senha");
var esqueciSenha = document.getElementById("esqueci-senha");
var botoesSociais = document.querySelectorAll(".social");

if (formLogin) {
  formLogin.addEventListener("submit", function (evento) {
    evento.preventDefault();
    window.location.href = "home.html?v=produtos-2";
  });
}

if (formCadastro) {
  formCadastro.addEventListener("submit", function (evento) {
    evento.preventDefault();
    mensagem.textContent = "Cadastro concluído na demonstração! Você já pode voltar para Entrar.";
  });
}

if (mostrarSenha) {
  mostrarSenha.addEventListener("click", function () {
    var senha = document.getElementById("senha");
    if (senha.type === "password") {
      senha.type = "text";
      mostrarSenha.setAttribute("aria-label", "Ocultar senha");
      mostrarSenha.setAttribute("aria-pressed", "true");
    } else {
      senha.type = "password";
      mostrarSenha.setAttribute("aria-label", "Mostrar senha");
      mostrarSenha.setAttribute("aria-pressed", "false");
    }
  });
}

if (esqueciSenha) {
  esqueciSenha.addEventListener("click", function () {
    mensagem.textContent = "Recuperação de senha simulada. Nesta demonstração, nenhum e-mail é enviado.";
  });
}

for (var i = 0; i < botoesSociais.length; i++) {
  botoesSociais[i].addEventListener("click", function () {
    var provedor = this.getAttribute("data-provedor");
    mensagem.textContent = "Acesso com " + provedor + " selecionado. Esta opção é apenas demonstrativa.";
  });
}

// Interações simples da página de produto.
var paginaProduto = document.getElementById('pagina-produto');
var campoQuantidade = document.getElementById('quantidade-produto');
var diminuirProduto = document.getElementById('diminuir-produto');
var aumentarProduto = document.getElementById('aumentar-produto');
var avisoProduto = document.getElementById('mensagem-produto');
var tempoProduto;
function mensagemProduto(texto) {
  avisoProduto.textContent = texto;
  avisoProduto.hidden = false;
  clearTimeout(tempoProduto);
  tempoProduto = setTimeout(function () { avisoProduto.hidden = true; }, 4500);
}
function ajustarBotoesQuantidade() {
  var quantidade = Number(campoQuantidade.value);
  diminuirProduto.disabled = quantidade <= 1;
  aumentarProduto.disabled = quantidade >= 99;
}
diminuirProduto.onclick = function () {
  campoQuantidade.value = Math.max(1, (Number(campoQuantidade.value) || 1) - 1);
  ajustarBotoesQuantidade();
};
aumentarProduto.onclick = function () {
  campoQuantidade.value = Math.min(99, (Number(campoQuantidade.value) || 0) + 1);
  ajustarBotoesQuantidade();
};
campoQuantidade.addEventListener('input', ajustarBotoesQuantidade);
document.getElementById('form-compra').addEventListener('submit', function (evento) {
  evento.preventDefault();
  if (!this.reportValidity()) return;
  var produto = {
    nome: paginaProduto.getAttribute('data-nome'),
    categoria: paginaProduto.getAttribute('data-categoria'),
    imagem: paginaProduto.getAttribute('data-imagem')
  };
  if (adicionarAoCarrinho(produto, Number(campoQuantidade.value))) {
    window.location.href = 'carrinho.html?v=produtos-2';
  } else mensagemProduto('Não foi possível adicionar o produto ao carrinho.');
});
var curtirProduto = document.getElementById('curtir-produto');
curtirProduto.onclick = function () {
  var curtido = this.getAttribute('aria-pressed') !== 'true';
  this.setAttribute('aria-pressed', String(curtido));
  mensagemProduto(curtido ? 'Produto curtido nesta demonstração.' : 'Curtida removida.');
};
document.getElementById('carrinho').onclick = function () {
  window.location.href = 'carrinho.html?v=produtos-2';
};
document.getElementById('favoritos').onclick = function () {
  mensagemProduto('Os favoritos são apenas demonstrativos por enquanto.');
};
var relacionados = document.querySelectorAll('.produto .adicionar');
for (var i = 0; i < relacionados.length; i++) {
  relacionados[i].addEventListener('click', function () {
    var cartao = this.closest('.produto');
    var produto = {
      nome: cartao.querySelector('h3').textContent,
      categoria: cartao.getAttribute('data-categoria'),
      imagem: cartao.querySelector('.foto-produto img').getAttribute('src')
    };
    if (adicionarAoCarrinho(produto, 1)) window.location.href = 'carrinho.html?v=produtos-2';
    else mensagemProduto('Não foi possível adicionar o produto ao carrinho.');
  });
}

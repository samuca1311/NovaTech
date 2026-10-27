// Demonstração. Somente o carrinho é salvo neste navegador.
var aviso = document.getElementById('mensagem-home');
var tempoAviso;
function mostrarMensagem(texto) {
  aviso.textContent = texto;
  aviso.hidden = false;
  clearTimeout(tempoAviso);
  tempoAviso = setTimeout(function () { aviso.hidden = true; }, 4500);
}

// Os botões usam os dados do cartão clicado.
var botoesAdicionar = document.querySelectorAll('.adicionar');
for (var i = 0; i < botoesAdicionar.length; i++) {
  botoesAdicionar[i].addEventListener('click', function () {
    var cartao = this.closest('.produto');
    var nome = cartao.querySelector('h3').textContent;
    var produto = { nome: nome, categoria: cartao.getAttribute('data-categoria'),
      imagem: cartao.querySelector('.foto-produto img').getAttribute('src') };
    if (adicionarAoCarrinho(produto, 1)) window.location.href = 'carrinho.html?v=produtos-1';
    else mostrarMensagem('Não foi possível salvar o carrinho neste navegador.');
  });
}
document.getElementById('carrinho').addEventListener('click', function () {
  window.location.href = 'carrinho.html?v=produtos-1';
});
document.getElementById('favoritos').addEventListener('click', function () {
  mostrarMensagem('Você ainda não tem favoritos nesta demonstração.');
});
document.getElementById('sobre').addEventListener('click', function () {
  mostrarMensagem('NovaTech: tecnologia vintage, história em cada detalhe.');
});

// Busca simples pelos nomes e categorias dos cartões já presentes no HTML.
var produtos = document.querySelectorAll('.produto');
var resultado = document.getElementById('resultado-busca');
function filtrarProdutos(texto) {
  var encontrados = 0;
  for (var i = 0; i < produtos.length; i++) {
    var mostrar = produtos[i].textContent.toLowerCase().indexOf(texto.toLowerCase()) !== -1;
    produtos[i].hidden = !mostrar;
    if (mostrar) encontrados++;
  }
  resultado.hidden = !texto;
  resultado.textContent = encontrados ? 'Produtos encontrados para: ' + texto : 'Nenhum produto encontrado. Limpe a busca para mostrar todos.';
}
document.getElementById('form-busca').addEventListener('submit', function (evento) {
  evento.preventDefault();
  filtrarProdutos(document.getElementById('buscar').value.trim());
  document.getElementById('ofertas').scrollIntoView();
});
document.getElementById('form-novidades').addEventListener('submit', function (evento) {
  evento.preventDefault();
  mostrarMensagem('Inscrição simulada! Nenhum e-mail foi enviado ou armazenado.');
  this.reset();
});

// Contagem apenas visual, reiniciada quando a página é aberta.
var segundos = 4 * 3600 + 6 * 60 + 31;
setInterval(function () {
  if (segundos > 0) segundos--;
  var horas = Math.floor(segundos / 3600);
  var minutos = Math.floor((segundos % 3600) / 60);
  var resto = segundos % 60;
  document.getElementById('contador').textContent = String(horas).padStart(2, '0') + ':' + String(minutos).padStart(2, '0') + ':' + String(resto).padStart(2, '0');
}, 1000);

// A busca de outras páginas também abre os resultados na Home.
var buscaRecebida = new URLSearchParams(window.location.search).get('busca');
if (buscaRecebida) {
  document.getElementById('buscar').value = buscaRecebida;
  filtrarProdutos(buscaRecebida);
  document.getElementById('ofertas').scrollIntoView();
}

// Tudo nesta página é uma demonstração. Nenhum dado é enviado ou salvo.
var aviso = document.getElementById('mensagem-home');
var tempoAviso;
function mostrarMensagem(texto) {
  aviso.textContent = texto;
  aviso.hidden = false;
  clearTimeout(tempoAviso);
  tempoAviso = setTimeout(function () { aviso.hidden = true; }, 4500);
}

// O número inicial acompanha o protótipo.
var quantidade = 3;
var botoesAdicionar = document.querySelectorAll('.adicionar');
for (var i = 0; i < botoesAdicionar.length; i++) {
  botoesAdicionar[i].addEventListener('click', function () {
    quantidade++;
    document.getElementById('quantidade').textContent = quantidade;
    document.getElementById('carrinho').setAttribute('aria-label', 'Carrinho, ' + quantidade + ' produtos');
    mostrarMensagem(this.getAttribute('data-produto') + ' adicionado ao carrinho de demonstração.');
  });
}
document.getElementById('carrinho').addEventListener('click', function () {
  mostrarMensagem('Seu carrinho de demonstração tem ' + quantidade + ' produtos.');
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
function filtrarProdutos(texto, categoria) {
  var encontrados = 0;
  for (var i = 0; i < produtos.length; i++) {
    var nome = produtos[i].textContent.toLowerCase();
    var tipo = produtos[i].getAttribute('data-categoria');
    var mostrar = nome.indexOf(texto.toLowerCase()) !== -1;
    if (categoria) {
      mostrar = tipo === categoria;
      if (categoria === 'Filmadora') mostrar = nome.indexOf('filmadora') !== -1;
    }
    produtos[i].hidden = !mostrar;
    if (mostrar) encontrados++;
  }
  resultado.hidden = !texto && !categoria;
  resultado.textContent = encontrados ? 'Produtos encontrados para: ' + (categoria || texto) : 'Nenhum produto encontrado. Use a busca vazia ou Ver mais para mostrar todos.';
}
document.getElementById('form-busca').addEventListener('submit', function (evento) {
  evento.preventDefault();
  filtrarProdutos(document.getElementById('buscar').value.trim(), '');
  document.getElementById('ofertas').scrollIntoView();
});
var categorias = document.querySelectorAll('.categoria');
for (var i = 0; i < categorias.length; i++) {
  categorias[i].addEventListener('click', function () {
    filtrarProdutos('', this.getAttribute('data-filtro'));
    document.getElementById('ofertas').scrollIntoView();
  });
}
document.getElementById('todas-categorias').addEventListener('click', function () {
  document.getElementById('buscar').value = '';
  filtrarProdutos('', '');
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

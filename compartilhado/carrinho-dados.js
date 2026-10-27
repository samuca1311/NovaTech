// Carrinho de demonstração salvo somente neste navegador.
// As imagens são armazenadas a partir de assets/, independente da pasta da página.
function normalizarImagem(caminho) {
  return typeof caminho === 'string' ? caminho.replace(/^(?:\.\.\/|\.\/)+/, '') : '';
}

// Valores em centavos para evitar erros de arredondamento.
var precosProdutos = {
  "Nintendo Game Boy Classic": 49900,
  "TV SONY TRINITRON KV-1310": 99999,
  "Sony Discman": 39900,
  "Polaroid OneStep SX-70": 54900,
  "Filmadora Analógica Vintage": 69900,
  "SONY PLAYSTATION 1 (PS1)": 64999,
  "NINTENDO 64 (N64)": 89999,
  "SUPER NINTENDO": 74999,
  "Sony Walkman": 129900
};
function formatarPreco(centavos) {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function precoDoProduto(nome) {
  return Object.prototype.hasOwnProperty.call(precosProdutos, nome) ? precosProdutos[nome] : null;
}
function calcularSubtotal(itens) {
  var soma = 0;
  for (var i = 0; i < itens.length; i++) {
    var preco = precoDoProduto(itens[i].nome);
    if (preco === null) return null;
    soma += preco * itens[i].quantidade;
  }
  return soma;
}
var paginasProdutos = {
  "Nintendo Game Boy Classic": "../produtos/gameboy.html?v=pastas-1",
  "TV SONY TRINITRON KV-1310": "../produtos/tv-trinitron.html?v=pastas-1",
  "Sony Discman": "../produtos/discman.html?v=pastas-1",
  "Polaroid OneStep SX-70": "../produtos/polaroid.html?v=pastas-1",
  "Filmadora Analógica Vintage": "../produtos/filmadora.html?v=pastas-1",
  "SONY PLAYSTATION 1 (PS1)": "../produtos/playstation.html?v=pastas-1",
  "NINTENDO 64 (N64)": "../produtos/nintendo64.html?v=pastas-1",
  "SUPER NINTENDO": "../produtos/super-nintendo.html?v=pastas-1",
  "Sony Walkman": "../produtos/walkman.html?v=pastas-1"
};
function paginaDoProduto(nome) {
  return Object.prototype.hasOwnProperty.call(paginasProdutos, nome) ? paginasProdutos[nome] : "../home/index.html?v=pastas-1";
}
function adicionarAoCarrinho(produto, quantidade) {
  if (precoDoProduto(produto.nome) === null || !Number.isInteger(quantidade) || quantidade < 1 || quantidade > 99) return false;
  var itens = lerCarrinho();
  var existente = itens.find(function (item) { return item.id === produto.nome; });
  if (existente) existente.quantidade = Math.min(99, existente.quantidade + quantidade);
  else itens.push({ id: produto.nome, nome: produto.nome, categoria: produto.categoria, imagem: normalizarImagem(produto.imagem), quantidade: quantidade });
  return salvarCarrinho(itens);
}
var chaveCarrinho = 'novatech-carrinho-v1';
function lerCarrinho() {
  try {
    var salvo = localStorage.getItem(chaveCarrinho);
    if (salvo === null) {
      var teste = [{ id: 'Nintendo Game Boy Classic', nome: 'Nintendo Game Boy Classic', categoria: 'Video Games', imagem: 'assets/home/gameboy.png', quantidade: 1 }];
      localStorage.setItem(chaveCarrinho, JSON.stringify(teste));
      return teste;
    }
    var itens = JSON.parse(salvo);
    if (!Array.isArray(itens)) return [];
    // Atualiza o antigo item genérico de teste sem apagar o carrinho.
    itens.forEach(function (item) {
      if (item && item.id === 'teste') {
        item.id = 'Nintendo Game Boy Classic';
        item.nome = item.id; item.categoria = 'Video Games'; item.imagem = 'assets/home/gameboy.png';
      }
    });
    itens.forEach(function (item) { if (item) item.imagem = normalizarImagem(item.imagem); });
    return itens.filter(function (item) {
      return item && typeof item.id === 'string' && typeof item.nome === 'string'
        && Number.isInteger(item.quantidade) && item.quantidade > 0 && item.quantidade <= 99;
    });
  } catch (erro) { return []; }
}
function salvarCarrinho(itens) {
  try { localStorage.setItem(chaveCarrinho, JSON.stringify(itens)); return true; }
  catch (erro) { return false; }
}
function atualizarContadorCarrinho() {
  var itens = lerCarrinho();
  var total = 0;
  for (var i = 0; i < itens.length; i++) total += itens[i].quantidade;
  var contador = document.getElementById('quantidade');
  if (contador) contador.textContent = total;
  var botao = document.getElementById('carrinho');
  if (botao) botao.setAttribute('aria-label', 'Carrinho, ' + total + (total === 1 ? ' item' : ' itens'));
}
atualizarContadorCarrinho();
window.addEventListener('pageshow', atualizarContadorCarrinho);

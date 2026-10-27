// Carrinho de demonstração salvo somente neste navegador.
var chaveCarrinho = 'novatech-carrinho-v1';
function lerCarrinho() {
  try {
    var salvo = localStorage.getItem(chaveCarrinho);
    if (salvo === null) {
      var teste = [{ id: 'teste', nome: 'Item de teste', categoria: 'Produto para testar quantidade e exclusão', imagem: '', quantidade: 1 }];
      localStorage.setItem(chaveCarrinho, JSON.stringify(teste));
      return teste;
    }
    var itens = JSON.parse(salvo);
    if (!Array.isArray(itens)) return [];
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

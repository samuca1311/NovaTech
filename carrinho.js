var itensCarrinho = lerCarrinho();
var lista = document.getElementById('lista-itens');
var avisoCarrinho = document.getElementById('aviso-carrinho');
function avisar(texto) { avisoCarrinho.textContent = texto; }
function desenharCarrinho() {
  lista.textContent = '';
  var total = 0;
  itensCarrinho.forEach(function (item, indice) {
    total += item.quantidade;
    var linha = document.createElement('article');
    linha.className = 'item-carrinho';
    if (item.imagem && /^assets\/home\/[a-z0-9-]+\.png$/.test(item.imagem)) {
      var foto = document.createElement('img');
      foto.className = 'imagem-item'; foto.src = item.imagem; foto.alt = item.nome; linha.appendChild(foto);
    } else {
      var foto = document.createElement('div');
      foto.className = 'imagem-item sem-imagem'; foto.textContent = '?'; foto.setAttribute('aria-hidden', 'true'); linha.appendChild(foto);
    }
    var dados = document.createElement('div'); dados.className = 'nome-item';
    var nome = document.createElement('h2');
    var linkProduto = document.createElement('a');
    linkProduto.href = paginaDoProduto(item.nome); linkProduto.textContent = item.nome; nome.appendChild(linkProduto);
    var categoria = document.createElement('p'); categoria.textContent = item.categoria || '';
    var estado = document.createElement('span'); estado.className = 'estado-item'; estado.textContent = item.id === 'teste' ? 'Item para demonstra��o' : 'Usado - Revisado e testado';
    var unitario = document.createElement('small');
    unitario.className = 'preco-unitario';
    var preco = precoDoProduto(item.nome);
    unitario.textContent = preco === null ? 'Pre�o indispon�vel' : formatarPreco(preco) + ' por unidade';
    dados.append(nome, categoria, estado, unitario); linha.appendChild(dados);
    var controle = document.createElement('div'); controle.className = 'controle-quantidade';
    var menos = document.createElement('button'); menos.type = 'button'; menos.textContent = '-'; menos.setAttribute('aria-label', 'Diminuir quantidade de ' + item.nome); menos.disabled = item.quantidade <= 1;
    var valor = document.createElement('output'); valor.textContent = item.quantidade; valor.setAttribute('aria-label', 'Quantidade de ' + item.nome);
    var mais = document.createElement('button'); mais.type = 'button'; mais.textContent = '+'; mais.setAttribute('aria-label', 'Aumentar quantidade de ' + item.nome); mais.disabled = item.quantidade >= 99;
    menos.onclick = function () { alterarQuantidade(indice, -1); };
    mais.onclick = function () { alterarQuantidade(indice, 1); };
    controle.append(menos, valor, mais); linha.appendChild(controle);
    var valorItem = document.createElement('strong'); valorItem.className = 'valor-item';
    valorItem.textContent = preco === null ? '-' : formatarPreco(preco * item.quantidade);
    valorItem.setAttribute('aria-label', 'Total de ' + item.nome + ': ' + valorItem.textContent);
    linha.appendChild(valorItem);
    var excluir = document.createElement('button'); excluir.type = 'button'; excluir.className = 'excluir'; excluir.setAttribute('aria-label', 'Excluir ' + item.nome);
    excluir.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7"/></svg>';
    excluir.onclick = function () {
      var novos = itensCarrinho.filter(function (_, posicao) { return posicao !== indice; });
      if (!salvarCarrinho(novos)) { avisar('N�o foi poss�vel salvar a altera��o.'); return; }
      itensCarrinho = novos; desenharCarrinho(); avisar(item.nome + ' removido do carrinho.');
      document.querySelector('.continuar').focus();
    };
    linha.appendChild(excluir); lista.appendChild(linha);
  });
  lista.hidden = itensCarrinho.length === 0;
  document.getElementById('carrinho-vazio').hidden = itensCarrinho.length > 0;
  document.getElementById('subtotal').textContent = 'Subtotal (' + total + (total === 1 ? ' item)' : ' itens)');
  var subtotal = calcularSubtotal(itensCarrinho);
  document.getElementById('valor-subtotal').textContent = subtotal === null ? '-' : formatarPreco(subtotal);
  document.getElementById('valor-total').textContent = subtotal === null ? '-' : formatarPreco(subtotal);
  document.getElementById('finalizar').disabled = total === 0;
  atualizarContadorCarrinho();
}
function alterarQuantidade(indice, diferenca) {
  var quantidade = itensCarrinho[indice].quantidade;
  itensCarrinho[indice].quantidade = Math.min(99, Math.max(1, quantidade + diferenca));
  if (!salvarCarrinho(itensCarrinho)) { itensCarrinho[indice].quantidade = quantidade; avisar('N�o foi poss�vel salvar a altera��o.'); return; }
  var nome = itensCarrinho[indice].nome;
  desenharCarrinho();
  avisar('Quantidade de ' + nome + ' atualizada.');
}
document.getElementById('carrinho').onclick = function () { document.getElementById('titulo-carrinho').scrollIntoView(); };
document.getElementById('favoritos').onclick = function () { avisar('Voc� ainda n�o tem favoritos nesta demonstra��o.'); };
document.getElementById('form-cupom').onsubmit = function (evento) {
  evento.preventDefault(); avisar('Cupons estar�o dispon�veis em breve.');
};
document.getElementById('finalizar').onclick = function () { avisar('Esta � uma demonstra��o. A finaliza��o da compra estar� dispon�vel em breve.'); };
desenharCarrinho();


// Finalização de compra demonstrativa. Endereço e cartão de teste ficam só nesta tela.
var enderecoEntrega = null;
var cartaoTeste = null;
var entregasPedido = {
  padrao: { nome: 'Entrega Padrão', valor: 1990 },
  expressa: { nome: 'Entrega Expressa', valor: 2990 },
  retirada: { nome: 'Retirada na loja', valor: 0 }
};
var nomesPagamento = { cartao: 'Cartão de crédito', pix: 'Pix', boleto: 'Boleto bancário' };
var avisoCheckout = document.getElementById('aviso-checkout');
var formEndereco = document.getElementById('form-endereco');
var formCartao = document.getElementById('form-cartao');

function avisarCheckout(texto) { avisoCheckout.textContent = texto; }
function criarTexto(tag, texto, classe) {
  var elemento = document.createElement(tag);
  elemento.textContent = texto;
  if (classe) elemento.className = classe;
  return elemento;
}
function entregaSelecionada() { return document.querySelector('input[name="entrega"]:checked').value; }
function pagamentoSelecionado() { return document.querySelector('input[name="pagamento"]:checked').value; }
function calcularTotalPedido(itens, entrega) {
  var subtotal = calcularSubtotal(itens);
  if (subtotal === null || !Object.prototype.hasOwnProperty.call(entregasPedido, entrega)) return null;
  return subtotal + (itens.length ? entregasPedido[entrega].valor : 0);
}
function atualizarResumoPedido() {
  var itens = lerCarrinho();
  var lista = document.getElementById('produtos-resumo');
  lista.textContent = '';
  var quantidade = 0;
  itens.forEach(function (item) {
    quantidade += item.quantidade;
    var linha = document.createElement('article');
    linha.className = 'item-resumo';
    if (/^assets\/home\/[a-z0-9-]+\.png$/.test(item.imagem)) {
      var foto = document.createElement('img');
      foto.src = '../' + item.imagem;
      foto.alt = item.nome;
      foto.width = 76;
      foto.height = 62;
      linha.appendChild(foto);
    }
    var dados = document.createElement('div');
    var titulo = document.createElement('h3');
    var link = criarTexto('a', item.nome);
    link.href = paginaDoProduto(item.nome);
    titulo.appendChild(link);
    dados.appendChild(titulo);
    dados.appendChild(criarTexto('p', item.categoria || '', 'categoria-resumo'));
    dados.appendChild(criarTexto('span', 'Usado · Revisado e testado', 'estado-resumo'));
    var preco = precoDoProduto(item.nome);
    var valores = document.createElement('p');
    valores.className = 'preco-item-resumo';
    valores.appendChild(criarTexto('small', 'Qtd: ' + item.quantidade));
    valores.appendChild(criarTexto('strong', preco === null ? 'Preço indisponível' : formatarPreco(preco * item.quantidade)));
    dados.appendChild(valores);
    linha.appendChild(dados);
    lista.appendChild(linha);
  });
  var vazio = itens.length === 0;
  var subtotal = calcularSubtotal(itens);
  var entrega = entregaSelecionada();
  var total = calcularTotalPedido(itens, entrega);
  document.getElementById('checkout-vazio').hidden = !vazio;
  document.getElementById('etapas-checkout').hidden = vazio;
  document.getElementById('resumo-pedido').hidden = vazio;
  document.getElementById('rotulo-subtotal').textContent = 'Subtotal (' + quantidade + (quantidade === 1 ? ' item)' : ' itens)');
  document.getElementById('valor-subtotal').textContent = subtotal === null ? '—' : formatarPreco(subtotal);
  document.getElementById('rotulo-frete').textContent = 'Frete (' + entregasPedido[entrega].nome + ')';
  document.getElementById('valor-frete').textContent = entregasPedido[entrega].valor === 0 ? 'Grátis' : formatarPreco(entregasPedido[entrega].valor);
  document.getElementById('valor-total').textContent = total === null ? '—' : formatarPreco(total);
  document.getElementById('finalizar-pedido').disabled = vazio || total === null;
  document.getElementById('bloco-endereco').hidden = entrega === 'retirada';
  if (subtotal === null) avisarCheckout('Um produto está com o preço indisponível. Revise os itens no carrinho antes de continuar.');
  atualizarContadorCarrinho();
}
function desenharEndereco() {
  var dados = document.getElementById('dados-endereco');
  dados.textContent = '';
  if (!enderecoEntrega) {
    dados.appendChild(criarTexto('h3', 'Nenhum endereço cadastrado'));
    dados.appendChild(criarTexto('p', 'Adicione um endereço para receber seu pedido.'));
  } else {
    dados.appendChild(criarTexto('h3', enderecoEntrega.apelido || 'Meu endereço'));
    var linhas = [
      enderecoEntrega.destinatario,
      enderecoEntrega.rua + ', ' + enderecoEntrega.numero,
      enderecoEntrega.complemento,
      enderecoEntrega.bairro + ' · ' + enderecoEntrega.cidade + ' - ' + enderecoEntrega.uf,
      'CEP ' + enderecoEntrega.cep
    ];
    linhas.filter(Boolean).forEach(function (texto) { dados.appendChild(criarTexto('p', texto)); });
  }
  document.getElementById('editar-endereco').querySelector('span').textContent = enderecoEntrega ? 'Editar' : 'Adicionar';
  document.getElementById('excluir-endereco').hidden = !enderecoEntrega;
  document.getElementById('etiqueta-endereco').hidden = !enderecoEntrega;
}
function abrirEndereco() {
  Array.from(formEndereco.elements).forEach(function (campo) {
    if (campo.name) campo.value = enderecoEntrega ? enderecoEntrega[campo.name] || '' : '';
    if (campo.setCustomValidity) campo.setCustomValidity('');
  });
  document.getElementById('modal-endereco').showModal();
  formEndereco.elements.destinatario.focus();
}
function desenharCartao() {
  var dados = document.getElementById('dados-cartao');
  dados.textContent = '';
  if (!cartaoTeste) {
    dados.appendChild(criarTexto('strong', 'Nenhum cartão adicionado'));
    dados.appendChild(criarTexto('span', 'Adicione um cartão de teste para continuar.'));
  } else {
    dados.appendChild(criarTexto('strong', 'Final ' + cartaoTeste.final));
    dados.appendChild(criarTexto('span', cartaoTeste.titular));
    var partes = cartaoTeste.validade.split('-');
    dados.appendChild(criarTexto('span', 'Validade ' + partes[1] + '/' + partes[0].slice(-2)));
    dados.appendChild(criarTexto('span', 'Cartão de teste', 'selo-cartao'));
  }
  document.getElementById('editar-cartao').hidden = !cartaoTeste;
  document.getElementById('adicionar-cartao').querySelector('span').textContent = cartaoTeste ? 'Trocar cartão de teste' : 'Cadastrar novo cartão';
}
function abrirCartao() {
  Array.from(formCartao.elements).forEach(function (campo) {
    if (campo.name) campo.value = cartaoTeste ? cartaoTeste[campo.name] || '' : '';
    if (campo.setCustomValidity) campo.setCustomValidity('');
  });
  var hoje = new Date();
  formCartao.elements.validade.min = hoje.getFullYear() + '-' + String(hoje.getMonth() + 1).padStart(2, '0');
  document.getElementById('modal-cartao').showModal();
  formCartao.elements.titular.focus();
}
function lerFormulario(formulario) {
  var dados = {};
  Array.from(formulario.elements).forEach(function (campo) {
    if (campo.name) {
      dados[campo.name] = campo.value.trim();
      if (campo.required && !dados[campo.name]) campo.setCustomValidity('Preencha este campo.');
    }
  });
  return formulario.reportValidity() ? dados : null;
}
formEndereco.addEventListener('submit', function (evento) {
  evento.preventDefault();
  var dados = lerFormulario(this);
  if (!dados) return;
  dados.cep = dados.cep.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');
  enderecoEntrega = dados;
  desenharEndereco();
  document.getElementById('modal-endereco').close();
  avisarCheckout('Endereço atualizado para esta simulação.');
});
formCartao.addEventListener('submit', function (evento) {
  evento.preventDefault();
  var dados = lerFormulario(this);
  if (!dados) return;
  cartaoTeste = dados;
  desenharCartao();
  document.getElementById('modal-cartao').close();
  avisarCheckout('Cartão de teste selecionado.');
});
[formEndereco, formCartao].forEach(function (formulario) {
  formulario.addEventListener('input', function (evento) {
    if (evento.target.setCustomValidity) evento.target.setCustomValidity('');
  });
});
document.getElementById('editar-endereco').onclick = abrirEndereco;
document.getElementById('excluir-endereco').onclick = function () {
  enderecoEntrega = null;
  desenharEndereco();
  avisarCheckout('Endereço removido desta simulação.');
  document.getElementById('editar-endereco').focus();
};
document.getElementById('adicionar-cartao').onclick = abrirCartao;
document.getElementById('editar-cartao').onclick = abrirCartao;
document.querySelectorAll('[data-fechar]').forEach(function (botao) {
  botao.onclick = function () { this.closest('dialog').close(); };
});
document.querySelectorAll('input[name="entrega"]').forEach(function (radio) {
  radio.addEventListener('change', function () {
    avisarCheckout('');
    atualizarResumoPedido();
  });
});
document.querySelectorAll('input[name="pagamento"]').forEach(function (radio) {
  radio.addEventListener('change', function () {
    var pagamento = pagamentoSelecionado();
    document.getElementById('painel-cartao').hidden = pagamento !== 'cartao';
    document.getElementById('painel-pix').hidden = pagamento !== 'pix';
    document.getElementById('painel-boleto').hidden = pagamento !== 'boleto';
    avisarCheckout('');
  });
});
document.getElementById('finalizar-pedido').onclick = function () {
  atualizarResumoPedido();
  var itens = lerCarrinho();
  var entrega = entregaSelecionada();
  var pagamento = pagamentoSelecionado();
  var total = calcularTotalPedido(itens, entrega);
  if (!itens.length || total === null) return;
  if (entrega !== 'retirada' && !enderecoEntrega) {
    avisarCheckout('Adicione o endereço de entrega para continuar.');
    abrirEndereco();
    return;
  }
  if (pagamento === 'cartao' && !cartaoTeste) {
    avisarCheckout('Adicione um cartão de teste ou escolha outra forma de pagamento.');
    abrirCartao();
    return;
  }
  document.getElementById('resumo-confirmacao').textContent = entregasPedido[entrega].nome + ' · ' + nomesPagamento[pagamento] + ' · Total: ' + formatarPreco(total);
  document.getElementById('modal-confirmacao').showModal();
};
document.getElementById('carrinho').onclick = function () { window.location.href = '../carrinho/index.html?v=checkout-1'; };
document.getElementById('favoritos').onclick = function () { avisarCheckout('Os favoritos são demonstrativos por enquanto.'); };
window.addEventListener('pageshow', atualizarResumoPedido);
window.addEventListener('storage', function (evento) { if (evento.key === chaveCarrinho || evento.key === null) atualizarResumoPedido(); });
atualizarResumoPedido();

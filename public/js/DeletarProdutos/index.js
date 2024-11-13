$('#confirmDeleteModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget); // Botão que acionou o modal
  var idProduto = button.data('id'); // Extrai info do atributo data-id
  var descricaoProduto = button.data('descricao'); // Extrai info do atributo data-descricao

  // Atualiza o campo do formulário no modal
  var modal = $(this);
  modal.find('#idProduto').val(idProduto); // Atualiza o valor do campo oculto
  modal.find('#idProdutoText').text(descricaoProduto); // Atualiza o nome do produto na tela
});

  document.getElementById('deleteForm').addEventListener('submit', function(event) {
    // Desabilita o botão de envio para evitar múltiplos cliques
    document.querySelector('button[type="submit"]').disabled = true;
  });

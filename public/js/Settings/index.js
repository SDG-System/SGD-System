$(document).ready(function () {
    // Lógica de clique no botão Editar
    $('.edit-button').click(function () {
      const form = $(this).closest('.product-form');
      const originalValues = {}; // Armazena os valores originais

      // Mostra os campos para edição e o botão "Salvar"
      form.find('.editable').each(function () {
        const span = $(this);
        const field = span.data('field');
        const currentValue = span.text();

        // Armazena o valor original
        originalValues[field] = currentValue;

        // Criar input para editar
        const input = $('<input>', {
          type: 'text',
          value: currentValue,
          class: 'form-control',
          'data-field': field,
          'data-id': span.data('id'),
        });
        span.replaceWith(input);
      });

      // Mostra o botão "Salvar" e "Fechar" e esconde o "Editar"
      form.find('.save-button').show();
      form.find('.close-button').show();
      $(this).hide(); // Esconde o botão "Editar"

      // Fechar edição sem salvar (botão "Fechar")
      form.find('.close-button').off('click').on('click', function () {
        form.find('input').each(function () {
          const field = $(this).data('field');
          const originalValue = originalValues[field];
          const span = $('<span>', {
            class: 'editable',
            'data-field': field,
            'data-id': $(this).data('id'),
            text: originalValue
          });
          $(this).replaceWith(span);
        });
        $(this).hide(); // Esconde o botão "Fechar"
        form.find('.save-button').hide(); // Esconde o botão "Salvar"
        form.find('.edit-button').show(); // Mostra o botão "Editar" novamente
      });
    });

    // Interceptar o envio do formulário
    $('.product-form').submit(async function (e) {
      e.preventDefault();

      const form = $(this);
      const idFunc = form.find('input[name="idFunc"]').val();
      const infoFunc = { idFunc }; // Inicia com o ID do produto

      // Coleta os valores dos inputs editáveis
      form.find('input[data-field]').each(function () {
        const field = $(this).data('field');
        const value = $(this).val();
        produtoData[field] = value; // Adiciona ao objeto
      });

      const token = localStorage.getItem('token');

      try {
        const response = await fetch('/edicao-produtos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(produtoData)
        });

        if (response.ok) {
          $('#successModal').modal('show');
          // Atualiza a interface com os novos valores
          for (const field in produtoData) {
            const input = form.find(`input[data-field="${field}"]`);
            if (input.length) {
              const span = $('<span>', {
                class: 'editable',
                'data-field': field,
                'data-id': input.data('id'),
                text: produtoData[field]
              });
              input.replaceWith(span);
            }
          }
          form.find('.save-button').hide(); // Esconde o botão "Salvar"
          form.find('.close-button').hide(); // Esconde o botão "Fechar"
          form.find('.edit-button').show(); // Mostra o botão "Editar"
        } else {
          $('#errorModal').modal('show');
        }
      } catch (error) {
        console.error('Erro ao editar o produto:', error);
        $('#errorModal').modal('show');
      }
    });
  });
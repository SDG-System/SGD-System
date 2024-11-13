$(document).ready(function () {
    $('.edit-button').click(function () {
      const form = $(this).closest('.product-form');
      const originalValues = {}; 

      form.find('.editable').each(function () {
        const span = $(this);
        const field = span.data('field');
        const currentValue = span.text();

        originalValues[field] = currentValue;

        const input = $('<input>', {
          type: 'text',
          value: currentValue,
          class: 'form-control',
          'data-field': field,
          'data-id': span.data('id'),
        });
        span.replaceWith(input);
      });

      form.find('.save-button').show();
      form.find('.close-button').show();
      $(this).hide(); 


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
        $(this).hide();
        form.find('.save-button').hide(); 
        form.find('.edit-button').show(); 
      });
    });

    $('.product-form').submit(async function (e) {
      e.preventDefault();

      const form = $(this);
      const idProduto = form.find('input[name="idProduto"]').val();
      const produtoData = { idProduto }; 

      form.find('input[data-field]').each(function () {
        const field = $(this).data('field');
        const value = $(this).val();
        produtoData[field] = value;
      });

      try {
        const response = await fetch('/edicao-produtos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
document.getElementById('formEntrada').addEventListener('submit', async function(event) {
    event.preventDefault();

    const idProduto = document.getElementById('idProduto').value;
    const quantidadeProduto = document.getElementById('quantidadeProduto').value;

    try {
        const response = await fetch('/atualizar-entrada', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idProduto, quantidadeProduto }),
            credentials: 'same-origin'
        });

        const data = await response.json();

        if (response.ok) {
            // Exibe o modal de sucesso
            $('#confirmModal').modal('show');
        } else {
            // Exibe o modal de erro
            $('#errorModal').modal('show');
            document.getElementById('error-message').textContent = data.message || 'Erro ao Atualizar Produto.';
        }

    } catch (error) {
        // Exibe o modal de erro se ocorrer uma exceção
        $('#errorModal').modal('show');
        document.getElementById('error-message').textContent = 'Produto Inexistente.';
    }
});

// Fechar o modal de sucesso quando o botão OK for clicado
document.getElementById('confirmBtn').addEventListener('click', function() {
    $('#confirmModal').modal('hide');
    // Opcional: Redirecionar ou fazer outras ações após a confirmação
    window.location.reload();
});

// Fechar o modal de erro quando o botão OK for clicado
document.getElementById('errorBtn').addEventListener('click', function() {
    $('#errorModal').modal('hide');
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o envio normal do formulário

        const formData = new FormData(form); // Coleta os dados do formulário
        const produtoData = {};
        formData.forEach((value, key) => {
            produtoData[key] = value;
        });

        try {
            const response = await fetch('/cadastrar-produtos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(produtoData)
            });

            if (response.ok) {
                $('#successModal').modal('show');
                form.reset(); 
            } else {
                $('#errorModal').modal('show');
            }
        } catch (error) {
            console.error('Erro ao cadastrar o produto:', error);
            $('#errorModal').modal('show');
        }
    });
});

const btnLimpar = document.getElementById('btn-limpar');

function limparDados() {
    document.getElementById('idProduto').value = '';
    document.getElementById('produto').value = '';
    document.getElementById('descricaoProduto').value = '';
    document.getElementById('precoProduto').value = ''; 
    document.getElementById('quantidadeProduto').value = '';
    document.getElementById('categoriaProduto').value = '';
}

btnLimpar.addEventListener('click', limparDados);

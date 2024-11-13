document.getElementById('verificationForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita o envio padrão do formulário
    const username = document.getElementById('username').value; // Capturando o nome de usuário
    const code = document.getElementById('codigo').value; // Capturando o código de verificação

    try {
        const response = await fetch('/verificar-codigo', {
            method: 'POST', // Mudado para POST
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, codigo: code }), // Enviando username e código
        });

        const result = await response.json();
        document.getElementById('message').innerText = result.message;

        if (response.ok) {
            // Se a resposta for bem-sucedida, redirecione ou exiba uma mensagem
            setTimeout(() => {
                window.location.href = '/login'; // Redireciona para a página de login
            }, 2000); // Espera 2 segundos antes de redirecionar
        }
    } catch (error) {
        document.getElementById('message').innerText = 'Erro ao verificar o código. Tente novamente.';
        console.error('Erro:', error);
    }
});

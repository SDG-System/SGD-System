async function login(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
            credentials: 'same-origin'
        });

        const data = await response.json();  // Agora recebendo JSON com cdFuncionario
        
        if (response.ok) {
            // Exibe o modal de confirmação
            $('#confirmModal').modal('show');
            
            setTimeout(function() {
                window.location.href = '/principal';
            }, 1500); // Redireciona após 1.5 segundos
        } else {
            // Exibe o modal de erro
            $('#errorModal').modal('show');
        }

    } catch (error) {
        // Exibe o modal de erro em caso de exceção
        $('#errorModal').modal('show');
    }
}

// Fechar o modal de erro quando o botão OK for clicado
document.getElementById('errorBtn').addEventListener('click', function() {
    $('#errorModal').modal('hide');
});

// Fechar o modal de confirmação quando o botão OK for clicado
document.getElementById('confirmBtn').addEventListener('click', function() {
    $('#confirmModal').modal('hide');
    window.location.href = '/principal';
});

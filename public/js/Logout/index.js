function logout() {
    const btnSair = document.getElementById('btn-logout');

    btnSair.addEventListener('click', () => {
        // Redireciona o usuário para a rota de logout no servidor
        window.location.href = '/logout';
    });
}

// Chame a função logout() para que o evento seja configurado
logout();

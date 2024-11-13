async function fetchPrincipal() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = '/login';
        return;
    }

    const response = await fetch('/principal', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (response.ok) {
        const data = await response.text();
        document.body.innerHTML = data;
    } else {
        const error = await response.json();
        console.error('Erro ao acessar a rota protegida:', error);
        window.location.href = '/login';
    }
}

async function fetchListProd() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = '/login';
        return;
    }

    const response = await fetch('/listagem-produtos', {
        method: 'GET',
        headers : {
            'Authorization': token,
            'X-access-token': token
        }
    });

    if (response.ok) {
        // Processar a resposta da rota protegida
        const data = await response.text();
        document.body.innerHTML = data;
    } else {
        const error = await response.json();
        window.location.href = '/login';
    }
}

if (localStorage.getItem('token')) {
    fetchListProd();
} else {
    window.location.href = '/login';
}

function carregarDashboards() {
    // Buscar os dados do backend
    fetch('/visualizar-relatorios/relatorios')
        .then(res => res.json())
        .then(data => {
            const { entradas, saidas, baixoEstoque } = data;

            // Criar gráficos com os dados retornados
            graficoEntradas(entradas);
            graficoSaidas(saidas);
            graficoBaixoEstoque(baixoEstoque);
        })
        .catch(error => console.error('Erro ao carregar os dados:', error));
}

function graficoEntradas(entradas) {
    // Preparar os dados para o gráfico de entradas
    const labels = entradas.map(item => `Produto ${item.id_produto}`);
    const data = entradas.map(item => item.entradas);

    // Configurar o gráfico de entradas
    const ctx = document.getElementById('grafico-entradas').getContext('2d');
    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: labels,
            datasets: [{
                label: 'Entradas de Produtos',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function graficoSaidas(saidas) {
    // Preparar os dados para o gráfico de saídas
    const labels = saidas.map(item => `Produto ${item.id_produto}`);
    const data = saidas.map(item => item.saidas);

    // Configurar o gráfico de saídas
    const ctx = document.getElementById('grafico-saidas').getContext('2d');
    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: labels,
            datasets: [{
                label: 'Saídas de Produtos',
                data: data,
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function graficoBaixoEstoque(baixoEstoque) {
    // Preparar os dados para o gráfico de baixo estoque
    const labels = baixoEstoque.map(item => `Produto ${item.cd_produto}`);
    const data = baixoEstoque.map(item => item.qt_produto);

    // Configurar o gráfico de baixo estoque
    const ctx = document.getElementById('grafico-baixo-estoque').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Quantidade em Estoque Baixo',
                data: data,
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Chamar a função que carrega todos os gráficos no carregamento da página
document.addEventListener('DOMContentLoaded', carregarDashboards);

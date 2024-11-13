function criarGraficos() {
    fetch('/principal/dashboards')
    .then(res => res.json())
    .then(dados => {
        // Dados obtidos do backend
        console.log(dados);

        // Preparar os dados para os gráficos (exemplo: número de itens em estoque)
        const labels = dados.map(item => item.nm_produto);
        const data = dados.map(item => item.qt_produto);

        // Configurar o primeiro gráfico
        const ctx1 = document.getElementById('grafico').getContext('2d');
        const myChart1 = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Quantidade em Estoque',
                    data: data,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
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

        // Configurar o segundo gráfico
        const ctx2 = document.getElementById('graficoDois').getContext('2d');
        const myChart2 = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Quantidade em Estoque',
                    data: data,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
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

        // Configurar o terceiro gráfico
        const ctx3 = document.getElementById('graficoTres').getContext('2d');
        const myChart3 = new Chart(ctx3, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Quantidade em Estoque',
                    data: data,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
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
    })
}

document.addEventListener('DOMContentLoaded', criarGraficos);

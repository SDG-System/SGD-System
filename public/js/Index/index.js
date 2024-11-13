// JS da página inicial
const btnEntrar = document.getElementById("btn-entrar");
const btnCadastrar = document.getElementById("btn-cadastrar");

btnEntrar.addEventListener('click', () => {
    window.location.href = 'login';
})

btnCadastrar.addEventListener('click', () => {
    window.location.href = 'signup';
})

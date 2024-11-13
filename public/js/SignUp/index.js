document.querySelector("form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Pegando os dados do formulário
    const formData = new FormData(event.target);
    const data = {
      username: formData.get('username'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      email: formData.get('email')
    };

    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Verificando o status da resposta
      const result = await response.json();
      console.log('Resultado do servidor:', result); // Log do resultado do servidor

      if (response.ok) {
        // Se o cadastro for bem-sucedido, mostrar o modal de sucesso
        $("#confirmModal").modal("show");

        // Redirecionar para a página de login após fechar o modal de sucesso
        $('#confirmModal').on('hidden.bs.modal', function () {
          window.location.href = '/verificar-codigo';
        });
      } else {
        // Se o servidor retornar um erro (como usuário já existente), mostrar o modal de erro
        document.getElementById('error-message').textContent = result.message || 'Erro no cadastro.';
        $("#errorModal").modal("show");
      }
    } catch (error) {
      // Em caso de erro inesperado (falha na comunicação com o servidor)
      console.error('Erro no cadastro:', error);
      document.getElementById('error-message').textContent = 'Erro ao tentar realizar o cadastro. Tente novamente mais tarde.';
      $("#errorModal").modal("show");
    }
  });

function visibilidadeSenha(inputSenha, iconeSenha) {
    const senha = document.getElementById(inputSenha);
    const icone = document.getElementById(iconeSenha);

    if (senha.type === "password") {
        senha.type = "text"
        icone.classList.remove("bi-eye-slash");
        icone.classList.add("bi-eye");
    } else {
        senha.type = "password"
        icone.classList.remove("bi-eye");
        icone.classList.add("bi-eye-slash");
    }
}

document.getElementById('toggleSenha').onclick = function () {
    visibilidadeSenha("password", "toggleSenha");
}

document.getElementById("toggleConfirmaSenha").onclick = function () {
    visibilidadeSenha("confirmPassword", "toggleConfirmaSenha")
}

const btnSair = document.getElementById('btn-sair');

btnSair.addEventListener('click', () => {
    window.location.href = '/';
});
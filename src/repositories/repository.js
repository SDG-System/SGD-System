import { consulta } from "../database/conexao.js";

class Repository {
    // CRUD
    async create(username, email, hashedPassword, codigoVerificacao) {
        try {
            const tipoUserPadrao = 2; // 1 - Admin, 2 - Usuário padrão, 3 - Visitante
            const statusUser = '1'; // 1 - Ativo, 2 - Inativo, 3 - Demitido
            const sql = "INSERT INTO tb_funcionario (nm_funcionario, nm_email, cd_senha, st_usuario, dt_registro_usuario, id_tipo_funcionario, cd_verificacao) VALUES (?, ?, ?, ?, NOW(), ?, ?)";
            const result = await consulta(sql, [username, email, hashedPassword, statusUser, tipoUserPadrao, codigoVerificacao]);
            return result; // Retorna o ID do novo registro
        } catch (error) {
            throw new Error('Erro ao inserir novo registro na tabela tb_funcionario: ' + error);
        }
    }

    async read(username) {
        try {
            const sql = "SELECT * FROM tb_funcionario WHERE nm_funcionario = ?";
            const result = await consulta(sql, [username]);
            return result[0];
        } catch (error) {
            throw new Error('Erro ao selecionar registro da tabela tb_funcionario pelo nome de usuário: ' + error);
        }
    }

    async getAll() {
        try {
            const sql = "SELECT * FROM tb_funcionario";
            const result = await consulta(sql);
            return result;
        } catch (error) {
            throw new Error('Erro ao selecionar registros da tabela tb_funcionario: ' + error);
        }
    }

    async update(username, newPassword) {
        try {
            const sql = "UPDATE tb_funcionario SET cd_senha = ? WHERE nm_funcionario = ?";
            const result = await consulta(sql, [newPassword, username]);

            if (result.affectedRows > 0) {
                return "Usuário atualizado com sucesso!";
            } else {
                throw new Error("Usuário não encontrado ou as credenciais originais estão incorretas.");
            }
        } catch (error) {
            throw new Error('Erro ao atualizar usuário: ' + error);
        }
    }

    async usuarioExistente(username, email) {
        try {
            const sql = "SELECT COUNT(*) as count FROM tb_funcionario WHERE nm_funcionario = ? OR nm_email = ?";
            const result = await consulta(sql, [username, email]);
            return result[0].count > 0;
        } catch (error) {
            throw new Error('Falha ao cadastrar. Usuário já existente: ' + error);
        }
    }

    async deleteUsuario(id_Funcionario) {
        try {
            const sql = "DELETE FROM tb_funcionario WHERE cd_funcionario = ?";
            const result = await consulta(sql, [id_Funcionario]);
            return result;
        } catch (error) {
            throw new Error('Falha ao excluir usuário: ' + error);
        }
    }

    async verificaEmail(verificado, username) {
        const sql = "UPDATE tb_funcionario SET verificacao = ? WHERE nm_funcionario = ?";
        const result = await consulta(sql, [verificado, username]);
        return result;
    }

    async verificaCodigo(username, codigo) {
        try {
            const sql = "SELECT * FROM tb_funcionario WHERE nm_funcionario = ? AND cd_verificacao = ?";
            const result = await consulta(sql, [username, codigo]);
            return result[0]; // Retorna o usuário se o código for válido
        } catch (error) {
            throw new Error('Erro ao verificar o código de verificação: ' + error);
        }
    }
}

export default new Repository();

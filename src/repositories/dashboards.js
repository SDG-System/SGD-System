import { consulta } from "../database/conexao.js";

class Dashboard {

    async read() {
        try {
            const sql = "SELECT * FROM tb_produto ORDER BY cd_produto DESC LIMIT 10";
            const result = await consulta(sql);
            return result;
        } catch (error) {
            throw new Error('Erro ao selecionar registro da tabela tb_users pelo ID: ');
        }
    }
}

export default new Dashboard();
import { consulta } from "../database/conexao.js";

class Estoque {

    async sumProd(idProduto, quantidadeProduto) {
        try {
            const sql = "UPDATE tb_produto SET qt_produto = qt_produto + ? WHERE cd_produto = ?";
            const result = await consulta(sql, [quantidadeProduto, idProduto]);

            if (result.affectedRows === 0) {
                throw new Error('Produto não encontrado ou não atualizado.');
            }

            return { success: true, message: 'Quantidade atualizada com sucesso.' };
        } catch (error) {
            // Em caso de erro, retorna uma mensagem com o erro ocorrido
            return { success: false, message: error.message || 'Erro ao atualizar a quantidade.' };
        }
    }

    async subProd(idProduto, quantidadeProduto) {
        const sqlSub = "SELECT qt_produto FROM tb_produto WHERE cd_produto = ?";
        const resultSub = await consulta(sqlSub, [idProduto]);

        if (resultSub.lenght == 0) {
            throw new Error('Produto Não encontrado ...');
        }

        const quantAtual = resultSub[0].quant_estoq;

        if (quantAtual - quantidadeProduto < 0) {
            throw new Error('Estoque insuficiente ...');
        }

        const sql = "UPDATE tb_produto SET qt_produto = qt_produto - ?  WHERE cd_produto = ?";
        const result = await consulta(sql, [quantidadeProduto, idProduto]);
        return result;
    }

    async quantidadeEstoque(idProduto) {
        const sql = "SELECT qt_produto FROM tb_produto WHERE cd_produto = ?";
        const result = await consulta(sql, [idProduto]);
        return result[0]?.quant_estoq;
    }

    async estoque(idProduto, quantidadeProduto) {
        try {
            const sql = "INSERT INTO tb_estoque (qt_produto, id_produto) VALUES (?, ?)";
            const result = await consulta(sql, [quantidadeProduto, idProduto]);
            return result;
        } catch (error) {
            throw new Error('Erro ao enviar dados à Tabela de Estoque ...');
        }
    }

    async getIdEstoque(idProduto) {
        try {
            const sql = "SELECT cd_estoque FROM tb_estoque WHERE id_produto = ?";
            const result = await consulta(sql, [idProduto]);
            return result;
        } catch (error) {
            throw new Error('Erro ao pegar id estoque', error);
        }
    }
}

export default new Estoque();

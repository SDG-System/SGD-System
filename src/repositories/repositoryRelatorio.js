import { consulta } from "../database/conexao.js";

class Relatorios {
    async create(idProduto, idCategoria, idEstoque, quantidadeProduto) {
        try {
            const statusRelatorio = '1'; // Status do Relatorio, na hora da criação é 1, pois já vem como um ativo
            const sql = "INSERT INTO tb_relatorio (dt_registro_relatorio, st_relatorio, id_produto, id_categoria, id_estoque, qt_produto) VALUES (NOW(), ?, ?, ?, ?, ?)";
            const result = await consulta(sql, [statusRelatorio, idProduto, idCategoria,idEstoque, quantidadeProduto]);
            return result;
        } catch (error) {
            throw new Error('Falha na criação do Relátorio', error)
        }
    }

    async getAll() {
        try {
            const sql = "SELECT * FROM tb_relatorio";
            const result = await consulta(sql);
            return result;
        } catch (error) {
            throw new Error('Falha em puxar dados do Relátorio', error)
        }
    }

    async getEntradas() {
        try {
            const sql = "SELECT id_produto, SUM(qt_produto) as entradas from tb_relatorio WHERE st_relatorio = 1 GROUP BY id_produto ORDER BY entradas DESC LIMIT 10";
            const result = await consulta(sql);
            return result;
        } catch (error) {
            throw new Error('Falha no Relátorio de entradas', error)
        }
    }

    async getSaidas() {
        try {
            const sql = "SELECT id_produto, SUM(qt_produto) as saidas from tb_relatorio WHERE st_relatorio = 1 GROUP BY id_produto ORDER BY saidas DESC LIMIT 10";
            const result = await consulta(sql);
            return result;
        } catch (error) {
            throw new Error('Falha no Relátorio de saidas', error)
        }
    }

    async getBaixoEstoque() {
        try {
            const sql = `
                SELECT p.cd_produto, p.nm_produto, p.qt_produto 
                FROM tb_produto p 
                WHERE p.qt_produto < 5 
                ORDER BY p.qt_produto ASC`;
            const result = await consulta(sql);
            return result;
        } catch (error) {
            throw new Error('Falha ao buscar itens com baixo estoque: ', error);
        }
    }
}

export default new Relatorios();

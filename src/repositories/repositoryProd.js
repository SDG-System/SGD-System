import { consulta } from "../database/conexao.js";

class Produtos {
    
    async create(idProduto, nomeProduto, descricaoProduto, precoProduto, quantidadeProduto, cdFuncionario, categoriaProduto) {
        try {
            const sql = "INSERT INTO tb_produto (cd_produto, nm_produto, ds_produto, vl_produto, qt_produto, id_funcionario, id_categoria) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const result = await consulta(sql, [idProduto, nomeProduto, descricaoProduto, precoProduto, quantidadeProduto, cdFuncionario, categoriaProduto]);
            return result;
        } catch (error) {
            throw new Error('Erro ao inserir novo produto: ' + (error.message || error));  // Verifica se error.message existe
        }
    }

    async findByOne(idProduto) {
        try {
            const sql = "SELECT * FROM tb_produto WHERE cd_produto = ?";
            const result = await consulta(sql, [idProduto]);
            return result;
        } catch (error) {
            throw new Error('Erro ao encontrar Código do produto: ' + error.message);
        }
    }

    async getAll() {
        try {
            const sql = "SELECT * FROM tb_produto";
            const result = await consulta(sql);           
            return result;
        } catch (error) {
            throw new Error('Erro ao consultar produto na tabela: ' + error.message);
        }
    }

    async search(query) {
        try {
            const sql = "SELECT * FROM tb_produto WHERE cd_produto LIKE ? OR nm_produto LIKE ? OR ds_produto OR id_categoria LIKE ?";
            const result = await consulta(sql, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]);
            return result;
        } catch (error) {
            throw new Error(`Falha no Relátorio de entradas: ${error.message}`);
        }
    }

    async update(idProduto, nomeProduto, descricaoProduto, precoProduto) {
        try {
            const sql = "UPDATE tb_produto SET nm_produto = ?, ds_produto = ?, vl_produto = ? WHERE cd_produto = ?";
            const result = await consulta(sql, [nomeProduto, descricaoProduto, precoProduto, idProduto]);
            return result;
        } catch (error) {
            throw new Error('Falha ao editar produtos: ' + error.message);
        }
    }

    async deleteProd(idProduto) {
        try {    
            const sql = "DELETE FROM tb_produto WHERE cd_produto = ?";
            const result = await consulta(sql, [idProduto]);

            return  result
        } catch (error) {
            throw new Error('Falha ao deletar produto e registros relacionados: ' + error.message);
        }
    }

    async deleteEstoq(idProduto) {
        try {    
            console.log('Tentando deletar produto do estoque:', idProduto);
            const sql = "DELETE FROM tb_estoque WHERE id_produto = ?";
            const result = await consulta(sql, [idProduto]);
    
            return result;
        } catch (error) {
            throw new Error('Falha ao deletar produto e registros relacionados: ' + error.message);
        }
    }
    
    async produtoExistente(idProduto) {
        try {
            const sql = "SELECT COUNT(*) as count FROM tb_produto WHERE cd_produto = ?";
            const result = await consulta(sql, [idProduto]);
            return result[0].count > 0;            
        } catch (error) {
            throw new Error('Falha ao buscar produto duplicado: ' + error.message);               
        }
    }

    async verificaEstoque() {
        const quantidadeMinima = 5;

        try {
            const sql = "SELECT * FROM tb_produto WHERE qt_produto < ?";
            const result = await consulta(sql, [quantidadeMinima]);
            return result;            
        } catch (error) {
            throw new Error('Erro ao verificar estoque: ' + error.message);
        }
    }

    async categoria(categoriaProduto) {
        try {
            const sql = "INSERT INTO tb_categoria (nm_categoria) VALUES (?)";
            const result = await consulta(sql, [categoriaProduto]);
            return result;            
        } catch (error) {
            throw new Error('Falha ao inserir categoria: ' + error.message);   
        }
    }

    async getCategoria(categoriaProduto) {
        try {
            const sql = "SELECT cd_categoria FROM tb_categoria WHERE nm_categoria = ?";      
            const result = await consulta(sql, [categoriaProduto]);
            return result;      
        } catch (error) {
            throw new Error('Falha ao buscar categoria: ' + error.message);   
        }
    }
        
    async categoriaExistente(categoriaProduto) {
        try {
            const sql = "SELECT cd_categoria FROM tb_categoria WHERE nm_categoria = ?";
            const result = await consulta(sql, [categoriaProduto]);
            return result.length > 0;
        } catch (error) {
            throw new Error('Falha ao buscar categoria: ' + error.message);                    
        }
    }
}

export default new Produtos();

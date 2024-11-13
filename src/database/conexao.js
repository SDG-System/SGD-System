import mysql from "mysql";

const conexao = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '1234567',
    database: 'bd_gerenciamento_de_estoque_2'
});

conexao.connect((error) => {
    if(error) {
        console.error('Erro ao conectar ao banco de dados:', error.stack); // Aqui estava err.stack, corrigi para error.stack
        return;
    }
    console.log('Conexão bem sucedida com o ID:', conexao.threadId);
});

/**
 *
 * @param {string} sql 
 * @param {string || [username, senha]} valores 
 * @param {string} mensagemReject 
 * @returns 
 */

export const consulta = (sql, valores='', mensagemReject) => {
    return new Promise((resolve, reject) => {
        conexao.query(sql, valores, (error, result) => {
            if(error) return reject(mensagemReject)
            const row = JSON.parse(JSON.stringify(result)) 
            return resolve(row)
        })
    })
}
    
export default conexao;

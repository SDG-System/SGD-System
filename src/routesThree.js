import { Router } from "express";
import bodyParser from "body-parser";
import repositoryProd from "./repositories/repositoryProd.js";
import repositoryEstoq from "./repositories/repositoryEstoq.js";
import { isAuthenticated } from "./middleware/auth.js";
import session from "express-session";

const routesThree = Router();

routesThree.use(bodyParser.json());
routesThree.use(bodyParser.urlencoded({ extended: true }));

routesThree.use(session({
    secret: 'IUEF9UEWQG9VVEWUBUB9B9V2B9V8B92VB9236', // Substitua por um segredo forte
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // Sessão expira em 1 hora
}));

// routesThree.get('/gerenciar-estoque', verifyToken, (req, res) => {
//     res.render('pages/Gerenciador/index');
// });

routesThree.get('/atualizar-entrada', isAuthenticated, async (req, res) => {
    const produto = await repositoryProd.getAll();
    res.render('pages/AtualizarEntrada/index', {produto});
});

routesThree.post('/atualizar-entrada', isAuthenticated, async (req, res) => {
    const { idProduto, quantidadeProduto } = req.body;

    try {
        const produto = await repositoryEstoq.sumProd(idProduto, quantidadeProduto);         
        res.json({ success: true, message: 'Atualização realizada com sucesso!' });
        console.log(produto);
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        res.render('pages/Erro/index');        
    }
});

routesThree.get('/atualizar-saida', isAuthenticated, async (req, res) => {
    const produto = await repositoryProd.getAll();
    res.render('pages/AtualizarSaida/index', {produto});
});

routesThree.post('/atualizar-saida', isAuthenticated,  async (req, res) => {
    const { idProduto, quantidadeProduto } = req.body;
    const estoqueMin = 5;

    try {
        const produto = await repositoryEstoq.subProd(idProduto, quantidadeProduto);
        let quantidadeAtual = await repositoryEstoq.quantidadeEstoque(idProduto);

        let alerta = null;

        if (quantidadeAtual < estoqueMin) {
            alerta = 'Alerta de Estoque Baixo...';
        }

        res.json({ success: true, message: 'Atualização realizada com sucesso!', alerta });
        console.log(produto);
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        res.render('pages/Erro/index');
    }
});

export default routesThree;

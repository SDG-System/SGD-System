import { Router } from "express";
import bodyParser from "body-parser";
import repositoryProd from "./repositories/repositoryProd.js";
import { isAuthenticated } from "./middleware/auth.js";
import session from "express-session";
import repositoryEstoq from "./repositories/repositoryEstoq.js";
import repositoryRelatorio from "./repositories/repositoryRelatorio.js";

const routesTwo = Router();

routesTwo.use(bodyParser.json());
routesTwo.use(bodyParser.urlencoded({ extended: true }));

routesTwo.use(bodyParser.json());
routesTwo.use(bodyParser.urlencoded({ extended: true }));

routesTwo.use(session({
    secret: 'IUEF9UEWQG9VVEWUBUB9B9V2B9V8B92VB9238', // Substitua por um segredo forte
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } 
}));

// Aplicar o middleware isAuthenticated a todas as rotas de routesTwo
// routesTwo.use(isAuthenticated);

routesTwo.get('/cadastrar-produtos', isAuthenticated, async (req, res) => {
    const { cdFuncionario } = req.session.user;
    console.log(`Funcionário ID: ${cdFuncionario}`);
    
    res.render('pages/CadastrarProdutos/index', { cdFuncionario });
});

routesTwo.post('/cadastrar-produtos', isAuthenticated, async (req, res) => {
    const { idProduto, produto, descricaoProduto, precoProduto, quantidadeProduto, categoriaProduto } = req.body;
   const { cdFuncionario } = req.session.user;

    try {
        const produtoDuplicado = await repositoryProd.produtoExistente(idProduto);

        if (produtoDuplicado) {
            console.log('Produto Já Existe: ', idProduto);
            return res.status(400).render('pages/erro', { mensagem: 'Produto já existe' });
        }

        console.log('Dados recebidos: ', idProduto, produto, descricaoProduto, precoProduto, quantidadeProduto, categoriaProduto);
        console.log('ID Funcionario: ', cdFuncionario); // Verifica se o cdFuncionario está sendo passado corretamente

        let idCategoria;
        const verifyCategoria = await repositoryProd.categoriaExistente(categoriaProduto);

        if (verifyCategoria) {
            const categoria = await repositoryProd.getCategoria(categoriaProduto);
            idCategoria = categoria[0].cd_categoria;
        } else {
            const novaCategoria = await repositoryProd.categoria(categoriaProduto);
            idCategoria = novaCategoria.insertId;
        }

        console.log('ID Categoria: ', idCategoria, categoriaProduto);
        
        // Inserir produto
        await repositoryProd.create(idProduto, produto, descricaoProduto, precoProduto, quantidadeProduto, cdFuncionario, idCategoria);

        // Adicionar ao estoque
        await repositoryEstoq.estoque(idProduto, quantidadeProduto);

        // Buscar idEstoque após inserir no estoque
        const estoqueCriado = await repositoryEstoq.getIdEstoque(idProduto);

        const idEstoque = estoqueCriado[0].cd_estoque; // Acessa corretamente o campo cd_estoque
        console.log('Estoque:', idEstoque);

        // Inserir no relatório
        await repositoryRelatorio.create(idProduto, idCategoria, idEstoque, quantidadeProduto);
        
        res.redirect('/cadastrar-produtos'); // Certifique-se de que o caminho está correto

        console.log(idProduto, produto, descricaoProduto, precoProduto, quantidadeProduto, categoriaProduto, idCategoria, idEstoque);

    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        res.render('pages/Erro/index');
    }
});

routesTwo.get('/listagem-produtos', isAuthenticated, async (req, res) => {
    try {
        const produtos = await repositoryProd.getAll();
        const categoria = await repositoryProd.getCategoria();
        res.render('pages/ListagemProdutos/index', { produtos, categoria });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.render('pages/Erro/index');
    }
});

routesTwo.get('/listagem-produtos/search', isAuthenticated, async (req, res) => {
    const { query } = req.query;

    try {
        const produtos = await repositoryProd.search(query);
        res.render('pages/ListagemProdutos/index', { produtos });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.render('pages/Erro/index');
    }
});

routesTwo.get('/editar-produtos', isAuthenticated, async (req, res) => {
    console.log(req.session);

    try {
        const produtos = await repositoryProd.getAll();
        res.render('pages/EditarProdutos/index', { produtos });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.render('pages/Erro/index');
    }
});


routesTwo.post('/edicao-produtos', isAuthenticated, async (req, res) => {
    const { idProduto, nomeProduto, descricaoProduto, precoProduto } = req.body;
    console.log(req.body);
    
    try {
        await repositoryProd.update(idProduto, nomeProduto, descricaoProduto, precoProduto);
        const produtos = await repositoryProd.getAll();
        res.render('pages/EditarProdutos/index', { produtos });
    } catch (error) {
        console.error('Erro ao editar produtos:', error);
        res.render('pages/Erro/index');
    }
});


routesTwo.get('/deletar-produtos', isAuthenticated, async (req, res) => {
    const deletar = await repositoryProd.getAll();
    res.render('pages/DeletarProdutos/index', { deletar });
});

routesTwo.post('/deletar-produtos', isAuthenticated, async (req, res) => {
    const { idProduto } = req.body;
    console.log('Este é o', idProduto);

    try {
        const estoque = await repositoryProd.deleteEstoq(idProduto);
        const produtos = await repositoryProd.deleteProd(idProduto);
        const deletar = await repositoryProd.getAll(); // Recupere todos os produtos novamente
        res.render('pages/DeletarProdutos/index', { deletar });
        console.log(produtos);
    } catch (error) {
        console.error('Erro ao deletar produtos:', error);
        res.render('pages/Erro/index');
    }
});

export default routesTwo;

import { Router } from "express";
import bodyParser from "body-parser";
import repositoryEstoq from "./repositories/repositoryEstoq.js";
import repositoryRelatorio from "./repositories/repositoryRelatorio.js";
import session from "express-session";
import { isAuthenticated } from "./middleware/auth.js";


const routesFour = Router();

routesFour.use(bodyParser.json());
routesFour.use(bodyParser.urlencoded({ extended: true }));

routesFour.use(session({
    secret: 'IUEF9UEWQG9VVEWUBUB9B9V2B9V8B92VB9235', // Substitua por um segredo forte
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // Sessão expira em 1 hora
}));

routesFour.get('/visualizar-relatorios', isAuthenticated, async (req, res) => {
    const entradas = await repositoryRelatorio.getEntradas();
    const saidas = await repositoryRelatorio.getSaidas();
    const baixoEstoque = await repositoryRelatorio.getBaixoEstoque();
    console.log(entradas, saidas, baixoEstoque);
    

    res.render('pages/Relatorios/index', {entradas, saidas, baixoEstoque});
});

routesFour.get('/visualizar-relatorios/relatorios', isAuthenticated, async (req, res) => {
    try {
        // Chamar as funções para obter os dados
        const relatoriosEntrada = await repositoryRelatorio.getEntradas();
        const relatoriosSaida = await repositoryRelatorio.getSaidas();
        const estoqueBaixo = await repositoryRelatorio.getBaixoEstoque();
        
        // Enviar os dados em um único objeto JSON
        res.json({
            entradas: relatoriosEntrada,
            saidas: relatoriosSaida,
            baixoEstoque: estoqueBaixo
        });
    } catch (error) {
        // Caso ocorra algum erro
        res.status(500).json({ message: "Erro ao buscar os relatórios", error: error.message });
    }
});


export default routesFour;

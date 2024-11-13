import express from "express";
import routes from "./routes.js";
import routesTwo from "./routesTwo.js";
import routesThree from "./routesThree.js";
import routesFour from "./routesFour.js";
import routesFive from "./routesFive.js";
import cors from  "cors";

const app = express();

app.use(cors());

app.use(express.static('public'));

app.use(express.json());

app.use(routes);
app.use(routesTwo);
app.use(routesThree);
app.use(routesFour);
app.use(routesFive);

// Configurar o Express para usar o EJS como mecanismo de visualização
app.set('view engine', 'ejs');

// Definir o diretório de visualizações
app.set('views', './views');

// Rota para a página de login (renderizar o template EJS)

app.use(express.urlencoded({ extended: true }));

export default app;

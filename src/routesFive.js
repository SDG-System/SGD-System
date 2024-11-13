import { Router } from "express";
import bodyParser from "body-parser";
import repository from "./repositories/repository.js";
import session from "express-session";
import { isAuthenticated } from "./middleware/auth.js";

const routesFive = Router();

routesFive.use(bodyParser.json());
routesFive.use(bodyParser.urlencoded({ extended: true }));

routesFive.use(session({
    secret: 'IUEF9UEWQG9VVEWUBUB9B9V2B9V8B92VB9234',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // Sessão expira em 1 hora
}));

routesFive.get('/settings', isAuthenticated, async (req, res) => {
    const settings = await repository.getAll();
    res.render('pages/Settings/index', { settings });
    console.log(settings);
    
});

export default routesFive;
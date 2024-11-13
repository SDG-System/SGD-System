import { Router } from "express";
import repository from "./repositories/repository.js";
import dashboards from "./repositories/dashboards.js";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import session from "express-session";
import nodemailer from "nodemailer";
import crypto from 'crypto';
import { isAuthenticated } from "./middleware/auth.js";

const enviarEmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'italoc999@gmail.com',
        pass: 'zliv vyvj pexx whzk'
    }
});

const routes = Router();

routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({ extended: true }));

// Configuração da sessão
routes.use(session({
    secret: 'IUEF9UEWQG9VVEWUBUB9B9V2B9V8B92VB9238', // Substitua por um segredo forte
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // Sessão expira em 1 hora
}));

routes.get('', (req, res) => {
    res.render('pages/Index/index');
});

routes.get('/login', (req, res) => {
    res.render('pages/Login/index');
});

routes.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await repository.read(username);
        if (!user) {
            return res.redirect('pages/Erro/index');
        }

        const senhaCerta = await bcrypt.compare(password, user.cd_senha);

        if (!senhaCerta) {
            return res.redirect('/erro');
        }

        if (user && senhaCerta) {
            req.session.user = { cdFuncionario: user.cd_funcionario };
            return res.json({ message: 'Login bem-sucedido', cdFuncionario: user.cd_funcionario });
        }
    } catch (error) {
        return res.redirect('/erro');
    }
});

routes.get('/principal', isAuthenticated, (req, res) => {
    res.render('pages/Principal/index');
});

routes.get('/principal/dashboards', isAuthenticated, async (req, res) => {
    try {
        const dados = await dashboards.read();
        res.json(dados);
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        res.status(500).json({ error: "Deu ruim" });
    }
});

routes.get('/signup', (req, res) => {
    res.render('pages/SignUp/index');
});

routes.post('/signup', async (req, res) => {
    const { username, password, confirmPassword, email } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'As senhas não são iguais.' });
    }

    try {
        const usuarioExiste = await repository.usuarioExistente(username, email);

        if (usuarioExiste) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        const codigoVerificacao = crypto.randomInt(100000, 999999).toString();

        const hashedPassword = await bcrypt.hash(password, 10);
        await repository.create(username, email, hashedPassword, codigoVerificacao);

            const mailOptions = {
                from: 'italoc999@gmail.com',
                to: email,
                subject: 'Código de Verificação de E-mail',
                html: 'Verifique sua conta - Código: ${codigoVerificacao}',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Verifique sua conta</title>
                    </head>
                    <body>
                        <p>Olá,</p>
                        <p>Agradecemos por se cadastrar em nosso site! Para confirmar seu e-mail e concluir o processo de cadastro, por favor, insira o código abaixo:</p>
                        <h2 style="text-align: center;">${codigoVerificacao}</h2>
                        <p>Copie e cole este código no campo indicado na página de verificação ou clique no botão abaixo:</p>
                        <a href="localhost:8000" style="background-color: #4CAF50; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size:   
             16px;">Verificar Agora</a>
                        <p>Se você não solicitou esta verificação, por favor, ignore este e-mail.</p>
                        <p>Atenciosamente,</p>
                        <p>Equipe SDG</p>
                    </body>
                    </html>
                `
            };

        await enviarEmail.sendMail(mailOptions);

        return res.status(200).json({ message: 'Cadastro realizado com sucesso. Verifique seu e-mail para o código de ativação.' });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        return res.status(500).json({ message: 'Erro interno no servidor' });
    }
});

routes.get('/verificar-codigo', async (req, res) => {
    res.render('pages/VerficacaoEmail/index');
});

routes.post('/verificar-codigo', async (req, res) => {
    const { username, codigo } = req.body;

    try {
        const user = await repository.read(username);

        if (!user || user.cd_verificacao !== codigo) {
            return res.status(400).json({ message: 'Código de verificação inválido.' });
        }

        await repository.verificaEmail(true, username);

        res.json({ message: 'E-mail verificado com sucesso!' });
    } catch (error) {
        console.error('Erro ao verificar código:', error);
        return res.status(500).json({ message: 'Erro interno no servidor' });
    }
});

routes.get('/RecuperarLogin', (req, res) => {
    res.render('pages/RecuperarLogin/index');
});

routes.post('/RecuperarLogin', async (req, res) => {
    const { username, newPassword } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await repository.update(username, hashedPassword);
        res.redirect('login');
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.render('pages/Erro/index');
    }
});

routes.get('/erro', (req, res) => {
    res.render('pages/Erro/index');
});

routes.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao encerrar sessão' });
        }
        res.redirect('/login');
    });
});

routes.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Erro ao sair.");
        }
        res.clearCookie('connect.sid'); // Remove o cookie da sessão
        res.redirect('/login'); // Redireciona para a página de login
    });
});
export default routes;

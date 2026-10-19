// ==========================================
// CONFIGURAÇÕES INICIAIS
// ==========================================

require("dotenv").config();

const express = require("express");

const registrarRotasJwc = require("./rotas/jwc");

const app = express();

const porta = process.env.PORT || 3000;

// O Render utiliza um proxy na frente do servidor.
app.set("trust proxy", 1);

app.disable("x-powered-by");

// Aceita formulários HTML tradicionais.
app.use(
    express.urlencoded({
        extended: false,
        limit: "20kb",
        parameterLimit: 20
    })
);

// Também permite uma futura integração com JavaScript.
app.use(
    express.json({
        limit: "20kb"
    })
);

// ==========================================
// VERIFICAÇÃO DO SERVIDOR
// ==========================================

app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

// ==========================================
// ROTAS DO JWC
// ==========================================

registrarRotasJwc(app);

// ==========================================
// TRATAMENTO DE ERROS
// ==========================================

app.use((erro, req, res, next) => {
    console.error("Falha ao processar requisição:", erro.type || erro.name);

    const status =
        erro.status === 413
            ? 413
            : erro.status === 400
                ? 400
                : 500;

    res.status(status).type("text").send(
        "Não foi possível processar a solicitação. Tente novamente."
    );
});

// ==========================================
// INICIALIZAÇÃO
// ==========================================

app.listen(porta, () => {
    console.log(`Servidor iniciado na porta ${porta}.`);
});
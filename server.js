const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// CONFIGURAÇÃO DA PASTA DE IMAGENS
// Altere este caminho se necessário
const IMAGES_PATH = path.join(__dirname, '../public/imgs');

// Servir arquivos estáticos
app.use(express.static('public'));
app.use('../public/imgs', express.static(IMAGES_PATH)); // Rota para acessar as imagens

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Pasta de imagens: ${IMAGES_PATH}`);
});
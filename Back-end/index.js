import express from 'express';
import cors from 'cors';

import professions from './date/professions.json' with { type: 'json' }; 

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/api/professions', (req, res) => {
  try {
    res.status(200).json(professions);
  } catch (error) {
    console.error("Erro ao processar a rota:", error);
    res.status(500).json({ 
        error: "Erro interno do servidor ao carregar profissões."
    });
  }
});

app.use((req, res) => {
    res.status(404).json({
        error: "Recurso não encontrado.",
        message: `O recurso em ${req.url} não foi encontrado.`
    });
});

app.listen(PORT, () => {
  console.log(`Servidor Backend rodando em http://localhost:${PORT}`);
});
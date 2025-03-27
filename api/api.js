require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/reserves', require('./routes/reservations-routes'));

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Sincronização do banco e inicialização do servidor
const PORT = process.env.PORT || 3000;
db.sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database sync error:', err);
  });
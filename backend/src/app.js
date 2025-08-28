const express = require('express');
const cors = require('cors');
const clientsRouter = require('./routes/clients.route');

const app = express();

app.use(express.json());
app.use(cors());
app.use(clientsRouter);

module.exports = app;

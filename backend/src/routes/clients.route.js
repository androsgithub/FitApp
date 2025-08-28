const clientsRouter = require('express').Router();
const clientsController = require('../controller/clients.controller');

clientsRouter.get('/', clientsController.getAllClients);

clientsRouter.post('/', clientsController.createClient);

clientsRouter.put('/:id', clientsController.updateClient);

clientsRouter.delete('/:id', clientsController.removeClient);

module.exports = clientsRouter;

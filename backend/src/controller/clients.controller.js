const { clientsService } = require('../service/index');

async function getAllClients(_, res) {
  const clients = await clientsService.findAll();
  return res.status(200).json(clients);
}

async function createClient(req, res) {
  const data = [
    req.body.name,
    req.body.email,
    req.body.phone,
    req.body.address,
    req.body.plan,
    req.body.goal
  ];
  await clientsService.addClient(data);
  return res.status(200).json('Cliente registrado com sucesso');
}

async function updateClient(req, res) {
  const { id } = req.params;
  const data = [
    req.body.name,
    req.body.email,
    req.body.phone,
    req.body.address,
    req.body.plan,
    req.body.goal
  ];
  await clientsService.updateClient(data, id);
  return res.status(200).json('Cliente atualizado com sucesso');
}

async function removeClient(req, res) {
  const { id } = req.params;

  await clientsService.deleteClient(id);

  return res.status(200).json('Cliente excluido com sucesso');
}

module.exports = {
  getAllClients,
  createClient,
  removeClient,
  updateClient
};

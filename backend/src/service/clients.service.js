const camelize = require('camelize');
const connection = require('../infra/database');

const findAll = async () => {
  const query = 'SELECT * FROM clients';
  const [clients] = await connection.execute(query);
  return camelize(clients);
};

const addClient = async (data) => {
  const [name, email, phone, address, plan, goal] = data;
  const query =
    'INSERT INTO clients (`name`, `email`, `phone`, `address`, `plan`, `goal`) VALUES (?, ?, ?, ?, ?, ?)';

  await connection.execute(query, [name, email, phone, address, plan, goal]);
};

const updateClient = async (data, id) => {
  const [name, email, phone, address, plan, goal] = data;
  const query =
    'UPDATE clients SET `name` = ?, `email` = ?, `phone` = ?, `address` = ?, `plan` = ?, `goal` = ? WHERE `id` = ?';

  await connection.execute(query, [name, email, phone, address, plan, goal, id]);
};

const deleteClient = async (id) => {
  const query = 'DELETE FROM clients WHERE `id` = ?';
  await connection.execute(query, [id]);
};

module.exports = {
  findAll,
  addClient,
  updateClient,
  deleteClient
};

const camelize = require('camelize');
const connection = require('../infra/database');
const { Client } = require('../models');

const findAll = async () => {
  const query = 'SELECT * FROM clients';
  const [clients] = await connection.execute(query);

  // Converte para instâncias de Client e retorna como array
  return camelize(clients).map((clientData) => Client.fromObject(clientData));
};

const addClient = async (data) => {
  // Valida os dados usando a entidade Client
  const client = Client.fromArray(data);
  const validation = client.validate();

  if (!validation.isValid) {
    const error = new Error('Invalid client data');
    error.errors = validation.errors;
    throw error;
  }

  const [name, email, phone, address, plan, goal] = data;
  const query =
    'INSERT INTO clients (`name`, `email`, `phone`, `address`, `plan`, `goal`) VALUES (?, ?, ?, ?, ?, ?)';

  await connection.execute(query, [name, email, phone, address, plan, goal]);
};

const updateClient = async (data, id) => {
  // Valida os dados usando a entidade Client
  const client = Client.fromArray(data, id);
  const validation = client.validate();

  if (!validation.isValid) {
    const error = new Error('Invalid client data');
    error.errors = validation.errors;
    throw error;
  }

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

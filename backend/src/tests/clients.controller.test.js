const controller = require('../controller/clients.controller');
const service = require('../service');

describe('clients.controller', () => {
  afterEach(() => {
    // limpa os spies/mocks após cada teste
    jest.clearAllMocks();
  });

  test('getAllClients should return 200 and clients', async () => {
    /*
      Setup:
        - Mock `service.clientsService.findAll` para retornar uma lista fake de clientes.
        - Mock `res` do Express com `status` e `json`.
      O que chamamos:
        - `controller.getAllClients(req, res)` (req não utilizado nesse controller).
      Asserções:
        - `clientsService.findAll` foi chamado.
        - `res.status(200)` foi chamado.
        - `res.json` foi chamado com os clientes retornados pelo service.
    */
    const fakeClients = [{ id: 1, name: 'John' }];
    service.clientsService.findAll = jest.fn().mockResolvedValue(fakeClients);

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await controller.getAllClients({}, res);

    expect(service.clientsService.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeClients);
  });

  test('createClient should call addClient and return success message', async () => {
    /*
      Setup:
        - Mock `service.clientsService.addClient` para não tocar no DB.
        - Criar `req.body` com os campos esperados e `res` mockado.
      O que chamamos:
        - `controller.createClient(req, res)`.
      Asserções:
        - `addClient` foi chamado com um array ordenado dos campos do body.
        - `res.status(200)` e `res.json('Cliente registrado com sucesso')` foram chamados.
    */
    service.clientsService.addClient = jest.fn().mockResolvedValue();

    const req = { body: { name: 'N', email: 'e', phone: 'p', address: 'a', plan: 'pl', goal: 'g' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await controller.createClient(req, res);

    expect(service.clientsService.addClient).toHaveBeenCalledWith([
      'N', 'e', 'p', 'a', 'pl', 'g'
    ]);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith('Cliente registrado com sucesso');
  });

  test('updateClient should call updateClient and return success message', async () => {
    /*
      Setup:
        - Mock `service.clientsService.updateClient`.
        - Criar `req.params.id` e `req.body` com campos.
      O que chamamos:
        - `controller.updateClient(req, res)`.
      Asserções:
        - `updateClient` foi chamado com `[...values]` e o id string.
        - Resposta com status 200 e mensagem de sucesso.
    */
    service.clientsService.updateClient = jest.fn().mockResolvedValue();

    const req = { params: { id: '3' }, body: { name: 'N', email: 'e', phone: 'p', address: 'a', plan: 'pl', goal: 'g' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await controller.updateClient(req, res);

    expect(service.clientsService.updateClient).toHaveBeenCalledWith([
      'N', 'e', 'p', 'a', 'pl', 'g'
    ], '3');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith('Cliente atualizado com sucesso');
  });

  test('removeClient should call deleteClient and return success message', async () => {
    /*
      Setup:
        - Mock `service.clientsService.deleteClient`.
        - Criar `req.params.id`.
      O que chamamos:
        - `controller.removeClient(req, res)`.
      Asserções:
        - `deleteClient` foi chamado com o id.
        - Resposta com status 200 e mensagem de sucesso.
    */
    service.clientsService.deleteClient = jest.fn().mockResolvedValue();

    const req = { params: { id: '9' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await controller.removeClient(req, res);

    expect(service.clientsService.deleteClient).toHaveBeenCalledWith('9');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith('Cliente excluido com sucesso');
  });
});

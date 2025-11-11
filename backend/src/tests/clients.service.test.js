const clientsService = require('../service/clients.service');
const db = require('../infra/database');
const { Client } = require('../models');

describe('serviço de clientes', () => {
  const mockClientData = {
    id: 1,
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '11999999999',
    address: 'Rua Principal, 123',
    plan: 'Premium',
    goal: 'Ganhar massa'
  };

  afterEach(() => {
    // limpa mocks entre testes para evitar vazamento de estado
    jest.clearAllMocks();
  });

  describe('buscar todos', () => {
    test('deve retornar todos os clientes como instâncias de Client', async () => {
      const dbResult = [
        [
          {
            id: 1,
            name: 'João Silva',
            email: 'joao@example.com',
            phone: '11999999999',
            address: 'Rua Principal, 123',
            plan: 'Premium',
            goal: 'Ganhar massa'
          },
          {
            id: 2,
            name: 'Maria Santos',
            email: 'maria@example.com',
            phone: '11888888888',
            address: 'Avenida Central, 456',
            plan: 'Basic',
            goal: 'Perder peso'
          }
        ]
      ];
      db.execute = jest.fn().mockResolvedValue(dbResult);

      const result = await clientsService.findAll();

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM clients');
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Client);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: 1,
          name: 'João Silva',
          email: 'joao@example.com',
          phone: '11999999999',
          address: 'Rua Principal, 123',
          plan: 'Premium',
          goal: 'Ganhar massa'
        })
      );
    });

    test('deve retornar array vazio quando não há clientes', async () => {
      db.execute = jest.fn().mockResolvedValue([[]]);

      const result = await clientsService.findAll();

      expect(db.execute).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    test('deve lançar erro quando banco de dados falha', async () => {
      const dbError = new Error('Database connection failed');
      db.execute = jest.fn().mockRejectedValue(dbError);

      await expect(clientsService.findAll()).rejects.toThrow(
        'Database connection failed'
      );
    });
  });

  describe('adicionar cliente', () => {
    test('deve inserir cliente com dados válidos', async () => {
      db.execute = jest.fn().mockResolvedValue([{ affectedRows: 1 }]);

      const data = [
        'João Silva',
        'joao@example.com',
        '11999999999',
        'Rua Principal, 123',
        'Premium',
        'Ganhar massa'
      ];

      await clientsService.addClient(data);

      expect(db.execute).toHaveBeenCalled();
      const [query, params] = db.execute.mock.calls[0];

      expect(query.toUpperCase()).toContain('INSERT INTO CLIENTS');
      expect(params).toEqual(data);
      expect(params).toHaveLength(6);
    });

    test('deve lançar erro quando validação de cliente falha', async () => {
      const invalidData = [
        '', // empty name
        'invalid-email', // invalid email
        '123',
        'Address',
        'Plan',
        'Goal'
      ];

      await expect(clientsService.addClient(invalidData)).rejects.toThrow(
        'Invalid client data'
      );
    });

    test('deve lançar erro quando campo obrigatório está faltando', async () => {
      const incompleteData = [
        'João Silva',
        'joao@example.com',
        '', // missing phone
        'Rua Principal, 123',
        'Premium'
      ];

      await expect(clientsService.addClient(incompleteData)).rejects.toThrow();
    });

    test('deve lançar erro quando inserção no banco de dados falha', async () => {
      const dbError = new Error('Insert failed');
      db.execute = jest.fn().mockRejectedValue(dbError);

      const data = [
        'João Silva',
        'joao@example.com',
        '11999999999',
        'Rua Principal, 123',
        'Premium',
        'Ganhar massa'
      ];

      await expect(clientsService.addClient(data)).rejects.toThrow('Insert failed');
    });
  });

  describe('atualizar cliente', () => {
    test('deve atualizar cliente com dados válidos', async () => {
      db.execute = jest.fn().mockResolvedValue([{ affectedRows: 1 }]);

      const id = 1;
      const data = [
        'João Silva Atualizado',
        'joao.atualizado@example.com',
        '11987654321',
        'Rua Atualizada, 789',
        'Premium Plus',
        'Ganhar mais massa'
      ];

      await clientsService.updateClient(data, id);

      expect(db.execute).toHaveBeenCalled();
      const [query, params] = db.execute.mock.calls[0];

      expect(query.toUpperCase()).toContain('UPDATE CLIENTS');
      expect(params).toEqual([...data, id]);
    });

    test('deve lançar erro quando validação de cliente falha', async () => {
      const invalidData = [
        '', // empty name
        'invalid-email', // invalid email
        '11987654321',
        'Rua Atualizada, 789',
        'Premium Plus',
        'Ganhar mais massa'
      ];

      await expect(clientsService.updateClient(invalidData, 1)).rejects.toThrow(
        'Invalid client data'
      );
    });

    test('deve colocar id como último parâmetro', async () => {
      db.execute = jest.fn().mockResolvedValue([{ affectedRows: 1 }]);

      const id = 5;
      const data = ['Name', 'email@test.com', '123', 'Address', 'Plan', 'Goal'];

      await clientsService.updateClient(data, id);

      const [, params] = db.execute.mock.calls[0];
      expect(params[params.length - 1]).toBe(id);
      expect(params).toHaveLength(7);
    });

    test('deve lançar erro quando atualização no banco de dados falha', async () => {
      const dbError = new Error('Update failed');
      db.execute = jest.fn().mockRejectedValue(dbError);

      const data = ['Name', 'email@test.com', '123', 'Address', 'Plan', 'Goal'];

      await expect(clientsService.updateClient(data, 1)).rejects.toThrow('Update failed');
    });
  });

  describe('deletar cliente', () => {
    test('deve deletar cliente por id', async () => {
      db.execute = jest.fn().mockResolvedValue([{ affectedRows: 1 }]);

      const id = 1;
      await clientsService.deleteClient(id);

      expect(db.execute).toHaveBeenCalled();
      const [query, params] = db.execute.mock.calls[0];

      expect(query.toUpperCase()).toContain('DELETE FROM CLIENTS');
      expect(query).toContain('id');
      expect(params).toEqual([id]);
    });

    test('deve passar parâmetro de id correto', async () => {
      db.execute = jest.fn().mockResolvedValue([{ affectedRows: 1 }]);

      const id = 42;
      await clientsService.deleteClient(id);

      const [, params] = db.execute.mock.calls[0];
      expect(params).toEqual([id]);
      expect(params).toHaveLength(1);
    });

    test('deve lançar erro quando deleção no banco de dados falha', async () => {
      const dbError = new Error('Delete failed');
      db.execute = jest.fn().mockRejectedValue(dbError);

      await expect(clientsService.deleteClient(1)).rejects.toThrow('Delete failed');
    });

    test('deve lidar graciosamente com deleção de cliente não existente', async () => {
      db.execute = jest.fn().mockResolvedValue([{ affectedRows: 0 }]);

      await expect(clientsService.deleteClient(999)).resolves.not.toThrow();
      expect(db.execute).toHaveBeenCalled();
    });
  });
});

const clientsService = require('../service/clients.service');
const db = require('../infra/database');

describe('clients.service', () => {
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

  describe('findAll', () => {
    test('should return all clients with camelized properties', async () => {
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

    test('should return empty array when no clients exist', async () => {
      db.execute = jest.fn().mockResolvedValue([[]]);

      const result = await clientsService.findAll();

      expect(db.execute).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    test('should throw error when database fails', async () => {
      const dbError = new Error('Database connection failed');
      db.execute = jest.fn().mockRejectedValue(dbError);

      await expect(clientsService.findAll()).rejects.toThrow(
        'Database connection failed'
      );
    });
  });

  describe('addClient', () => {
    test('should insert client with all required fields', async () => {
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
      expect(query).toContain('name');
      expect(query).toContain('email');
      expect(query).toContain('phone');
      expect(query).toContain('address');
      expect(query).toContain('plan');
      expect(query).toContain('goal');
      expect(params).toEqual(data);
      expect(params).toHaveLength(6);
    });

    test('should pass correct parameters in exact order', async () => {
      db.execute = jest.fn().mockResolvedValue([{ affectedRows: 1 }]);

      const name = 'Maria Santos';
      const email = 'maria@example.com';
      const phone = '11888888888';
      const address = 'Avenida Central, 456';
      const plan = 'Basic';
      const goal = 'Perder peso';

      const data = [name, email, phone, address, plan, goal];
      await clientsService.addClient(data);

      const [, params] = db.execute.mock.calls[0];
      expect(params[0]).toBe(name);
      expect(params[1]).toBe(email);
      expect(params[2]).toBe(phone);
      expect(params[3]).toBe(address);
      expect(params[4]).toBe(plan);
      expect(params[5]).toBe(goal);
    });

    test('should throw error when database insert fails', async () => {
      const dbError = new Error('Insert failed');
      db.execute = jest.fn().mockRejectedValue(dbError);

      const data = ['Name', 'email@test.com', '123', 'Address', 'Plan', 'Goal'];

      await expect(clientsService.addClient(data)).rejects.toThrow('Insert failed');
    });
  });

  describe('updateClient', () => {
    test('should update client with all fields', async () => {
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
      expect(query).toContain('name');
      expect(query).toContain('email');
      expect(query).toContain('phone');
      expect(query).toContain('address');
      expect(query).toContain('plan');
      expect(query).toContain('goal');
      expect(query).toContain('id');
      expect(params).toEqual([...data, id]);
    });

    test('should place id as the last parameter', async () => {
      db.execute = jest.fn().mockResolvedValue([{ affectedRows: 1 }]);

      const id = 5;
      const data = ['Name', 'email@test.com', '123', 'Address', 'Plan', 'Goal'];

      await clientsService.updateClient(data, id);

      const [, params] = db.execute.mock.calls[0];
      expect(params[params.length - 1]).toBe(id);
      expect(params).toHaveLength(7);
    });

    test('should throw error when database update fails', async () => {
      const dbError = new Error('Update failed');
      db.execute = jest.fn().mockRejectedValue(dbError);

      const data = ['Name', 'email@test.com', '123', 'Address', 'Plan', 'Goal'];

      await expect(clientsService.updateClient(data, 1)).rejects.toThrow('Update failed');
    });

    test('should handle non-existent client update gracefully', async () => {
      db.execute = jest.fn().mockResolvedValue([{ affectedRows: 0 }]);

      const data = ['Name', 'email@test.com', '123', 'Address', 'Plan', 'Goal'];

      await expect(clientsService.updateClient(data, 999)).resolves.not.toThrow();
      expect(db.execute).toHaveBeenCalled();
    });
  });

  describe('deleteClient', () => {
    test('should delete client by id', async () => {
      db.execute = jest.fn().mockResolvedValue([{ affectedRows: 1 }]);

      const id = 1;
      await clientsService.deleteClient(id);

      expect(db.execute).toHaveBeenCalled();
      const [query, params] = db.execute.mock.calls[0];

      expect(query.toUpperCase()).toContain('DELETE FROM CLIENTS');
      expect(query).toContain('id');
      expect(params).toEqual([id]);
    });

    test('should pass correct id parameter', async () => {
      db.execute = jest.fn().mockResolvedValue([{ affectedRows: 1 }]);

      const id = 42;
      await clientsService.deleteClient(id);

      const [, params] = db.execute.mock.calls[0];
      expect(params).toEqual([id]);
      expect(params).toHaveLength(1);
    });

    test('should throw error when database delete fails', async () => {
      const dbError = new Error('Delete failed');
      db.execute = jest.fn().mockRejectedValue(dbError);

      await expect(clientsService.deleteClient(1)).rejects.toThrow('Delete failed');
    });

    test('should handle non-existent client deletion gracefully', async () => {
      db.execute = jest.fn().mockResolvedValue([{ affectedRows: 0 }]);

      await expect(clientsService.deleteClient(999)).resolves.not.toThrow();
      expect(db.execute).toHaveBeenCalled();
    });
  });
});

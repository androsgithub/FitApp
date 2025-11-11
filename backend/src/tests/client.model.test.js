const Client = require('../models/Client');

describe('Modelo Client', () => {
  const validClientData = {
    id: 1,
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '11999999999',
    address: 'Rua Principal, 123',
    plan: 'Premium',
    goal: 'Ganhar massa'
  };

  describe('Construtor', () => {
    test('deve criar um cliente com todas as propriedades', () => {
      const client = new Client(validClientData);

      expect(client.id).toBe(1);
      expect(client.name).toBe('João Silva');
      expect(client.email).toBe('joao@example.com');
      expect(client.phone).toBe('11999999999');
      expect(client.address).toBe('Rua Principal, 123');
      expect(client.plan).toBe('Premium');
      expect(client.goal).toBe('Ganhar massa');
    });
  });

  describe('Validação', () => {
    test('deve validar um cliente correto', () => {
      const client = new Client(validClientData);
      const result = client.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve falhar validação quando nome está vazio', () => {
      const data = { ...validClientData, name: '' };
      const client = new Client(data);
      const result = client.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name is required and must be a non-empty string');
    });

    test('deve falhar validação quando email está vazio', () => {
      const data = { ...validClientData, email: '' };
      const client = new Client(data);
      const result = client.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Valid email is required');
    });

    test('deve falhar validação quando formato de email é inválido', () => {
      const data = { ...validClientData, email: 'invalid-email' };
      const client = new Client(data);
      const result = client.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Valid email is required');
    });

    test('deve falhar validação quando telefone está vazio', () => {
      const data = { ...validClientData, phone: '' };
      const client = new Client(data);
      const result = client.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Phone is required and must be a non-empty string');
    });

    test('deve falhar validação quando endereço está vazio', () => {
      const data = { ...validClientData, address: '' };
      const client = new Client(data);
      const result = client.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Address is required and must be a non-empty string'
      );
    });

    test('deve falhar validação quando plano está vazio', () => {
      const data = { ...validClientData, plan: '' };
      const client = new Client(data);
      const result = client.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Plan is required and must be a non-empty string');
    });

    test('deve falhar validação quando meta está vazia', () => {
      const data = { ...validClientData, goal: '' };
      const client = new Client(data);
      const result = client.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Goal is required and must be a non-empty string');
    });

    test('deve ter múltiplos erros quando múltiplos campos são inválidos', () => {
      const data = {
        ...validClientData,
        name: '',
        email: 'invalid',
        phone: ''
      };
      const client = new Client(data);
      const result = client.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('Validação de Email', () => {
    test('deve validar formatos de email corretos', () => {
      const validEmails = [
        'user@example.com',
        'test.user@domain.co.uk',
        'user+tag@example.com'
      ];

      validEmails.forEach((email) => {
        const client = new Client({ ...validClientData, email });
        expect(client.isValidEmail(email)).toBe(true);
      });
    });

    test('deve rejeitar formatos de email inválidos', () => {
      const invalidEmails = [
        'invalid.email',
        '@example.com',
        'user@',
        'user name@example.com'
      ];

      invalidEmails.forEach((email) => {
        const client = new Client({ ...validClientData, email: 'valid@example.com' });
        expect(client.isValidEmail(email)).toBe(false);
      });
    });
  });

  describe('Método toArray', () => {
    test('deve retornar dados como array em ordem correta', () => {
      const client = new Client(validClientData);
      const array = client.toArray();

      expect(array).toEqual([
        'João Silva',
        'joao@example.com',
        '11999999999',
        'Rua Principal, 123',
        'Premium',
        'Ganhar massa'
      ]);
    });

    test('deve retornar array com 6 elementos', () => {
      const client = new Client(validClientData);
      const array = client.toArray();

      expect(array).toHaveLength(6);
    });
  });

  describe('Método toObject', () => {
    test('deve retornar dados como objeto com todas as propriedades', () => {
      const client = new Client(validClientData);
      const obj = client.toObject();

      expect(obj).toEqual(validClientData);
    });

    test('deve incluir id no objeto', () => {
      const client = new Client(validClientData);
      const obj = client.toObject();

      expect(obj).toHaveProperty('id', 1);
    });
  });

  describe('Métodos Estáticos', () => {
    test('fromArray deve criar cliente a partir de array', () => {
      const data = [
        'Maria Santos',
        'maria@example.com',
        '11888888888',
        'Avenida Central, 456',
        'Basic',
        'Perder peso'
      ];

      const client = Client.fromArray(data, 2);

      expect(client.id).toBe(2);
      expect(client.name).toBe('Maria Santos');
      expect(client.email).toBe('maria@example.com');
      expect(client.phone).toBe('11888888888');
      expect(client.address).toBe('Avenida Central, 456');
      expect(client.plan).toBe('Basic');
      expect(client.goal).toBe('Perder peso');
    });

    test('fromArray deve criar cliente sem id se não fornecido', () => {
      const data = [
        'Pedro Costa',
        'pedro@example.com',
        '11777777777',
        'Rua Secundária, 789',
        'Standard',
        'Melhorar saúde'
      ];

      const client = Client.fromArray(data);

      expect(client.id).toBeNull();
      expect(client.name).toBe('Pedro Costa');
    });

    test('fromObject deve criar cliente a partir de objeto', () => {
      const client = Client.fromObject(validClientData);

      expect(client).toEqual(expect.objectContaining(validClientData));
    });
  });
});

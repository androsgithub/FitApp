/**
 * Classe que representa um Cliente no sistema
 * Encapsula a lógica de validação e transformação de dados do cliente
 */
class Client {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.address = data.address;
    this.plan = data.plan;
    this.goal = data.goal;
  }

  /**
   * Valida se todos os campos obrigatórios estão presentes
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    if (!this.name || typeof this.name !== 'string' || this.name.trim().length === 0) {
      errors.push('Name is required and must be a non-empty string');
    }

    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('Valid email is required');
    }

    if (!this.phone || typeof this.phone !== 'string' || this.phone.trim().length === 0) {
      errors.push('Phone is required and must be a non-empty string');
    }

    if (
      !this.address ||
      typeof this.address !== 'string' ||
      this.address.trim().length === 0
    ) {
      errors.push('Address is required and must be a non-empty string');
    }

    if (!this.plan || typeof this.plan !== 'string' || this.plan.trim().length === 0) {
      errors.push('Plan is required and must be a non-empty string');
    }

    if (!this.goal || typeof this.goal !== 'string' || this.goal.trim().length === 0) {
      errors.push('Goal is required and must be a non-empty string');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida o formato do email
   * @param {string} email
   * @returns {boolean}
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Retorna os dados do cliente como array (ordem para INSERT/UPDATE)
   * @returns {Array}
   */
  toArray() {
    return [this.name, this.email, this.phone, this.address, this.plan, this.goal];
  }

  /**
   * Retorna os dados do cliente como objeto
   * @returns {Object}
   */
  toObject() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      address: this.address,
      plan: this.plan,
      goal: this.goal
    };
  }

  /**
   * Cria uma instância de Client a partir de um array de dados
   * @param {Array} data - [name, email, phone, address, plan, goal]
   * @returns {Client}
   */
  static fromArray(data, id = null) {
    return new Client({
      id,
      name: data[0],
      email: data[1],
      phone: data[2],
      address: data[3],
      plan: data[4],
      goal: data[5]
    });
  }

  /**
   * Cria uma instância de Client a partir de um objeto
   * @param {Object} data
   * @returns {Client}
   */
  static fromObject(data) {
    return new Client(data);
  }
}

module.exports = Client;

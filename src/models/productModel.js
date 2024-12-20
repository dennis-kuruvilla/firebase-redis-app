class Product {
  constructor(name, description, price, category, userId) {
    if (!name || !description || !price) {
      throw new Error('name, description, and price are mandatory fields');
    }

    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category || 'general';
    this.createdBy = userId
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  toFirestoreFormat() {
    return {
      name: this.name,
      description: this.description,
      price: this.price,
      category: this.category,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Product;

export default class ProductDTO {
    constructor(title, description, price, code, status, thumbnails, stock, category, owner) {
      this.title = title;
      this.description = description;
      this.price = price;
      this.code = code;
      this.status = status;
      this.thumbnails = thumbnails;
      this.stock = stock;
      this.category = category;
      this.owner = owner;
    }
  }
export default class UserDTO {
  constructor(id, name, email,role, cart) {
    this.id = id
    this.name = name;
    this.email = email;
    this.role = role;
    this.cart = cart;
  }
}

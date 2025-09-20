import { getLocalStorage } from "./utils.mjs";
import { renderListWithTemplate } from "./utils.mjs";

// Template for a cart item
function cartItemTemplate(item) {
  return `
    <li class="cart-item">
      <img src="${item.Image}" alt="${item.Name}">
      <div>
        <h3>${item.Name}</h3>
        <p>Brand: ${item.Brand?.Name || ""}</p>
        <p>Price: $${item.FinalPrice}</p>
        <p>Quantity: ${item.quantity || 1}</p>
      </div>
    </li>
  `;
}

export default class ShoppingCart {
  constructor(listElement, storageKey = "so-cart") {
    this.listElement = listElement;
    this.storageKey = storageKey;
    this.items = [];
  }

  init() {
    this.items = getLocalStorage(this.storageKey) || [];
    this.renderCart(this.items);
  }

  renderCart(items) {
    if (!items.length) {
      this.listElement.innerHTML = "<li>Your cart is empty.</li>";
      return;
    }
    renderListWithTemplate(cartItemTemplate, this.listElement, items, "afterbegin", true);
  }
}
import { getLocalStorage } from "./utils.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    // Calculate subtotal and number of items
    this.itemTotal = this.list.reduce((sum, item) => sum + (item.FinalPrice * (item.quantity || 1)), 0);
    const subtotalElem = document.querySelector(`${this.outputSelector} #subtotal`);
    if (subtotalElem) subtotalElem.innerText = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    // Tax: 6% of subtotal
    this.tax = this.itemTotal * 0.06;
    // Shipping: $10 for first item, $2 for each additional
    const itemCount = this.list.reduce((sum, item) => sum + (item.quantity || 1), 0);
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const summary = document.querySelector(this.outputSelector);
    if (!summary) return;
    const taxElem = summary.querySelector("#tax");
    const shippingElem = summary.querySelector("#shipping");
    const totalElem = summary.querySelector("#order-total");
    if (taxElem) taxElem.innerText = `$${this.tax.toFixed(2)}`;
    if (shippingElem) shippingElem.innerText = `$${this.shipping.toFixed(2)}`;
    if (totalElem) totalElem.innerText = `$${this.orderTotal.toFixed(2)}`;
  }
}
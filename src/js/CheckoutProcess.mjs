import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs"; 

// Helper to convert form data to an object
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

// Helper to package cart items for the order
function packageItems(items) {
  return items.map(item => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: item.quantity || 1
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.services = new ExternalServices();
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
    this.displayOrderTotals();
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce(
      (sum, item) => sum + (item.FinalPrice * (item.quantity || 1)),
      0
    );
    const subtotalElem = document.querySelector(`${this.outputSelector} #subtotal`);
    if (subtotalElem) subtotalElem.innerText = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
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

  // Call this on form submit
  async checkout(form) {
    // 1. Get form data
    const order = formDataToJSON(form);

    // 2. Add required order fields
    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal.toFixed(2);
    order.tax = this.tax.toFixed(2);
    order.shipping = this.shipping;
    order.items = packageItems(this.list);

    // 3. Ensure correct field names for API
    // (If your form uses different names, map them here)
    if (order.firstName) order.fname = order.firstName;
    if (order.lastName) order.lname = order.lastName;
    if (order.streetAddress) order.street = order.streetAddress;
    if (order.exp) order.expiration = order.exp;

    // Remove any extra fields
    delete order.firstName;
    delete order.lastName;
    delete order.streetAddress;
    delete order.exp;

    // 4. POST to server
    try {
      const response = await this.services.checkout(order);
      return response;
    } catch (err) {
      throw err;
    }
  }
}
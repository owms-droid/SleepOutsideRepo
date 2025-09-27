import {
  setLocalStorage,
  getLocalStorage,
  alertMessage,
  removeAllAlerts,
} from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();
function sanitizeInput(input) {
  // Remove any HTML tags and trim whitespace
  return input.replace(/<[^>]*>/g, '').trim();
}

function validateForm(form) {
  const validationRules = {
    fname: {
      required: true,
      minLength: 2,
      pattern: /^[A-Za-z\s-]+$/,
      message: "First name must contain only letters, spaces, or hyphens"
    },
    lname: {
      required: true,
      minLength: 2,
      pattern: /^[A-Za-z\s-]+$/,
      message: "Last name must contain only letters, spaces, or hyphens"
    },
    street: {
      required: true,
      minLength: 3,
      message: "Please enter a valid street address"
    },
    city: {
      required: true,
      pattern: /^[A-Za-z\s.-]+$/,
      message: "City must contain only letters, spaces, periods, or hyphens"
    },
    state: {
      required: true,
      pattern: /^[A-Z]{2}$/,
      message: "State must be a 2-letter code (e.g., UT)"
    },
    zip: {
      required: true,
      pattern: /^\d{5}(-\d{4})?$/,
      message: "ZIP code must be 5 digits or 5+4 format"
    },
    cardNumber: {
      required: true,
      pattern: /^\d{16}$/,
      message: "Card number must be 16 digits"
    },
    expiration: {
      required: true,
      pattern: /^(0[1-9]|1[0-2])\/\d{2}$/,
      message: "Expiration must be in MM/YY format"
    },
    code: {
      required: true,
      pattern: /^\d{3}$/,
      message: "Security code must be 3 digits"
    }
  };

  const errors = [];
  
  for (const [field, rules] of Object.entries(validationRules)) {
    const input = form.elements[field];
    if (!input) continue;

    const value = sanitizeInput(input.value);
    
    if (rules.required && !value) {
      errors.push(`${field} is required`);
      continue;
    }

    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`${field} must be at least ${rules.minLength} characters`);
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(rules.message);
    }
  }

  return errors;
}

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach((value, key) => {
    convertedJSON[key] = sanitizeInput(value);
  });

  return convertedJSON;
}

function packageItems(items) {
  const simplifiedItems = items.map((item) => ({
    id: item.Id,
    price: item.FinalPrice,
    name: item.Name,
    quantity: 1,
  }));
  return simplifiedItems;
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
  }
  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSummary();
  }
  calculateItemSummary() {
    const summaryElement = document.querySelector(
      this.outputSelector + " #cartTotal"
    );
    const itemNumElement = document.querySelector(
      this.outputSelector + " #num-items"
    );
    itemNumElement.innerText = this.list.length;
    // calculate the total of all the items in the cart
    const amounts = this.list.map((item) => item.FinalPrice);
    this.itemTotal = amounts.reduce((sum, item) => sum + item);
    summaryElement.innerText = "$" + this.itemTotal;
  }
  calculateOrderTotal() {
    this.shipping = 10 + (this.list.length - 1) * 2;
    this.tax = parseFloat((this.itemTotal * 0.06).toFixed(2));
    this.orderTotal = parseFloat(
      (this.itemTotal + this.shipping + this.tax).toFixed(2)
    );
    this.displayOrderTotals();
  }
  displayOrderTotals() {
    const shipping = document.querySelector(this.outputSelector + " #shipping");
    const tax = document.querySelector(this.outputSelector + " #tax");
    const orderTotal = document.querySelector(
      this.outputSelector + " #orderTotal"
    );
    shipping.innerText = "$" + this.shipping;
    tax.innerText = "$" + this.tax;
    orderTotal.innerText = "$" + this.orderTotal;
  }
  setLoading(isLoading) {
    const submitBtn = document.querySelector("button[type='submit']");
    if (!submitBtn) return;

    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="loading">Processing...</span>';
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Place Order';
    }
  }

  async checkout() {
    const formElement = document.forms["checkout"];

    // Form validation
    const validationErrors = validateForm(formElement);
    if (validationErrors.length > 0) {
      removeAllAlerts();
      validationErrors.forEach(error => alertMessage(error));
      return;
    }

    this.setLoading(true);
    removeAllAlerts();

    const json = formDataToJSON(formElement);
    // add totals, and item details
    json.orderDate = new Date();
    json.orderTotal = this.orderTotal;
    json.tax = this.tax;
    json.shipping = this.shipping;
    json.items = packageItems(this.list);
    
    try {
      const res = await services.checkout(json);
      if (res.ok) {
        setLocalStorage("so-cart", []);
        alertMessage("Order processed successfully!", "success");
        setTimeout(() => {
          location.assign("/checkout/success.html");
        }, 1500);
      } else {
        throw new Error("Checkout request failed");
      }
    } catch (err) {
      removeAllAlerts();
      if (err.message && typeof err.message === 'object') {
        Object.values(err.message).forEach(message => {
          alertMessage(message);
        });
      } else {
        alertMessage(err.message || "An error occurred during checkout");
      }
    } finally {
      this.setLoading(false);
    }
  }
}
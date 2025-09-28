import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", "#order-summary");
checkout.init();

const form = document.getElementById("checkout-form");
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  checkout.calculateOrderTotal();
  try {
    const result = await checkout.checkout(form);
    alert("Order placed! Confirmation: " + JSON.stringify(result));
    localStorage.removeItem("so-cart");
    // Optionally redirect to a confirmation page
  } catch (err) {
    alert("Order failed: " + err.message);
  }
});
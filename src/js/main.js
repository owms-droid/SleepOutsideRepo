import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { updateCartNum, loadHeaderFooter } from "./utils.mjs";

const dataSource = new ExternalServices();
const element = document.querySelector(".product-list");
const productList = new ProductList("Tents", dataSource, element);

productList.init();

//The number of items in the cart (header)
updateCartNum();

// To call the header and footer partials
loadHeaderFooter();

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("registerModal");
  const closeButton = modal.querySelector(".close-button");

  if (!localStorage.getItem("hasSeenRegisterModal")) {
    modal.classList.remove("hidden");
    localStorage.setItem("hasSeenRegisterModal", "true");
  }

  closeButton.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Newsletter form handling
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const emailInput = document.getElementById("email");
      const email = emailInput.value.trim();

      if(email === ""){
        alert("Please enter a valid email address.");
        return;
      }

      alert(`Thanks for subscribing, ${email}!`);
      newsletterForm.reset();
    });
  }
});
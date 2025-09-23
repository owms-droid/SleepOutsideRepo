import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
} from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  try {
    let cartItems = getLocalStorage("so-cart");
    // Ensure cartItems is an array
    if (!Array.isArray(cartItems)) {
      cartItems = [];
      setLocalStorage("so-cart", cartItems);
    }

    if (cartItems.length > 0) {
      const htmlItems = cartItems.map((item) => cartItemTemplate(item));
      document.querySelector(".product-list").innerHTML = htmlItems.join("");

      // Calculate total
      const total = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.FinalPrice) || 0;
        return sum + price;
      }, 0);

      // Show footer and update total
      const footerElement = document.querySelector(".list-footer");
      footerElement.classList.remove("hide");
      footerElement.querySelector(".list-total").textContent =
        `Total: $${total.toFixed(2)}`;
    } else {
      document.querySelector(".product-list").innerHTML =
        "<li>Your cart is empty</li>";
      document.querySelector(".list-footer").classList.add("hide");
    }
  } catch (error) {
    // Display error to user without console.error
    document.querySelector(".product-list").innerHTML =
      "<li>Error loading cart. Please try again.</li>";
  }
}

function cartItemTemplate(item) {
  // Handle potential missing properties gracefully
  const imageUrl =
    item.Images?.PrimaryMedium || "/public/images/noun_Tent_2517.svg";
  const name = item.Name || "Product Name Not Available";
  const color = item.Colors?.[0]?.ColorName || "Color Not Available";
  const price = item.FinalPrice
    ? `$${parseFloat(item.FinalPrice).toFixed(2)}`
    : "Price Not Available";

  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${imageUrl}"
      alt="${name}"
      onerror="this.onerror=null;this.src='/public/images/noun_Tent_2517.svg';"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${name}</h2>
  </a>
  <p class="cart-card__color">${color}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">${price}</p>
</li>`;

  return newItem;
}

renderCartContents();

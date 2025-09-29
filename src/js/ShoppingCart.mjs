import { getLocalStorage, updateCartNum} from "./utils.mjs";

export function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const quantity = item.quantity || 1;
  const totalPrice = (item.FinalPrice * quantity).toFixed(2);

  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images.PrimaryMedium}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${quantity}</p>
  <p class="cart-card__price">$${totalPrice}</p>
  <button class="remove" aria-label="Delete product" data-id="${item.Id}">×</button>
</li>`;

  return newItem;
}

// function to display the result and show a message when the cart is empty
export function totalOrEmpty(){
  const cart = getLocalStorage("so-cart") || [];
  if (cart.length > 0) {
    document.querySelector('.cart-footer').classList.remove('hide');
    renderCartContents();

      // Calculate and display the total cart value
    const total = cart.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 1;
      const price = Number(item.FinalPrice) || 0;
      return sum + price * quantity;
    }, 0);
    document.querySelector('.cart-total').textContent = `Total: $${total.toFixed(2)}`;

  } else {

      // If the cart is empty, show message
    const emptyMessage = document.querySelector("#empty-message");
    if (emptyMessage) {
      emptyMessage.classList.remove("hide");
      document.querySelector('.cart-total').textContent = `Total: $0`;
    }
  }
}


// ga--Function to eliminate products from the cart
export function deleteProduct(){
  const productsList = document.querySelector(".product-list");
  if (!productsList)
    return;

  productsList.addEventListener("click", function(e){
    if(e.target.classList.contains("remove")){
      const product = e.target.closest("li");
      const productName = product.querySelector(".card__name").textContent;

      let cart = JSON.parse(localStorage.getItem("so-cart")) || [];
      cart = cart.filter((item) => item.Name !== productName);
      localStorage.setItem("so-cart", JSON.stringify(cart));
        renderCartContents();
        updateCartNum();
        totalOrEmpty();
      }
    });
}
// ProductList.mjs
import { renderListWithTemplate } from './utils.mjs';

// Template function for a product card
function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/?product=${product.id}">
      <img src="${product.tents || ''}" alt="Image of ${product.name}">
      <h2 class="card__brand">${product.brand || ''}</h2>
      <h3 class="card__name">${product.name}</h3>
      <p class="product-card__price">$${product.price}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }

  // Use this method to initialize and fetch products asynchronously
  async init() {
    try {
      this.products = await this.dataSource.getData(this.category);
      this.renderList(this.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      this.listElement.innerHTML = '<li>Error loading products.</li>';
    }
  }

  // Render product cards in the listElement using the template function
  renderList(productList) {
    if (!productList.length) {
      this.listElement.innerHTML = '<li>No products found.</li>';
      return;
    }
    renderListWithTemplate(productCardTemplate, this.listElement, productList, "afterbegin", true);
  }
}
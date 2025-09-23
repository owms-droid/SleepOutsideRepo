import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="/product_pages/?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        <h3>${product.Brand.Name}</h3>
        <p>${product.NameWithoutBrand}</p>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
    `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    try {
      // Show loading state
      this.listElement.innerHTML = '<li>Loading products...</li>';
      document.querySelector(".title").textContent = this.category;

      const list = await this.dataSource.getData(this.category);
      
      if (!list || list.length === 0) {
        this.listElement.innerHTML = '<li>No products found for this category.</li>';
        return;
      }

      this.renderList(list);
    } catch (error) {
      console.error('Error loading products:', error);
      this.listElement.innerHTML = '<li>Error loading products. Please try again later.</li>';
    }
  }

  renderList(list) {
    try {
      this.listElement.innerHTML = ''; // Clear loading message
      renderListWithTemplate(productCardTemplate, this.listElement, list);
    } catch (error) {
      console.error('Error rendering product list:', error);
      this.listElement.innerHTML = '<li>Error displaying products. Please try again later.</li>';
    }
  }

}
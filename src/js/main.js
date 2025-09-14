import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

// Create an instance of ProductData
const productData = new ProductData();

// Select the HTML element where the product list will be rendered
const productListElement = document.querySelector('#product-list');

// Create an instance of ProductList for a specific category (e.g., "tents")
const productList = new ProductList('tents', productData, productListElement);

// Initialize and render the product list
productList.init();
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadTemplate, renderWithTemplate } from "./utils.mjs";

const dataSource = new ProductData("tents");

const element = document.querySelector(".product-list");

const productList = new ProductList("Tents", dataSource, element);

async function loadHeaderFooter() {
  const headerHtml = await loadTemplate("../partials/header.html");
  const footerHtml = await loadTemplate("../partials/footer.html");
  renderWithTemplate(headerHtml, document.getElementById("#main-header"));
  renderWithTemplate(footerHtml, document.getElementById("#main-footer"));
}

productList.init();
loadHeaderFooter();
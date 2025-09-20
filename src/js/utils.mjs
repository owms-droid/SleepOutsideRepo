// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// get the product id from the query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product
}

export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);
  // if clear is true we need to clear out the contents of the parent.
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if(callback) {
    callback(data);
  }
}


export async function loadTemplate(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load template: ${path}`);
  return await response.text();
}

 

/**
 * Loads and renders both the header and footer from external HTML files.
 * Assumes:
 *   - Header HTML is located at "../partials/header.html"
 *   - Footer HTML is located at "../partials/footer.html"
 *   - Elements with IDs 'main-header' and 'main-footer' exist in the DOM
 */
export async function loadHeaderFooter() {
  try {
    // Load templates
    const headerTemplate = await loadTemplate("../partials/header.html");
    const footerTemplate = await loadTemplate("../partials/footer.html");

    // Get placeholder elements from the DOM
    const headerElement = document.querySelector("#main-header");
    const footerElement = document.querySelector("#main-footer");

    // Check that elements exist before rendering
    if (!headerElement) console.warn("Missing #main-header in DOM");
    if (!footerElement) console.warn("Missing #main-footer in DOM");

    // Render templates into their respective containers
    if (headerElement) {
      renderWithTemplate(headerTemplate, headerElement, "afterbegin", true);
    }

    if (footerElement) {
      renderWithTemplate(footerTemplate, footerElement, "afterbegin", true);
    }
  } catch (error) {
    console.error("Error loading header/footer:", error);
  }
}
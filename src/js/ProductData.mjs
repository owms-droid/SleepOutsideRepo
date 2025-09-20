const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor() {
    // Validate that we have a server URL
    if (!baseURL) {
      throw new Error('Server URL not configured. Check .env file.');
    }
  }
  async getData(category) {
    try {
      console.log(`Fetching products for category: ${category}`);
      console.log(`URL: ${baseURL}products/search/${category}`);
      const response = await fetch(`${baseURL}products/search/${category}`);
      const data = await convertToJson(response);
      console.log('Products received:', data.Result);
      return data.Result;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
  async findProductById(id) {
    try {
      console.log(`Fetching product with ID: ${id}`);
      const response = await fetch(`${baseURL}product/${id}`);
      const data = await convertToJson(response);
      console.log('Product received:', data.Result);
      return data.Result;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }
}
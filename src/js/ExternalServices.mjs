const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    // Pass the full error details back to the caller
    throw { name: "servicesError", message: jsonResponse };
  }
}

export default class ExternalServices {
  constructor() {}

  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    return await fetch(`${baseURL}checkout/`, options).then(convertToJson);
  }
}

// Usage example (to be removed in the actual module)
(async () => {
  const services = new ExternalServices();
  const order = {}; // Populate with order details
  try {
    await services.checkout(order);
    // Success: redirect to success page, clear cart, etc.
  } catch (err) {
    // err.message will contain the server's error details
    alert(err.message.message || "Order failed. Please check your input.");
  }
})();
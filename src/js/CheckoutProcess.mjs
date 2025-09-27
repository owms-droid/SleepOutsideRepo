export default class CheckoutProcess {
    // Implementation of the checkout process
    constructor(key, outputSelector) {
        // Initialization code here
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() { 
        // Initialization logic here
        this.list = getLocalStorage(this.key);
        this.calculateItemSummary();
    }

    calculateItemSummary() {
        const summaryElement = document.querySelector(this.outputSelector + "#cartTotal");
        const itemNumElement = document.querySelector(this.outputSelector + "#num-items");
        
        itemNumElement.innerText = this.list.length;
        const amounts = this.list.map(item => item.FinalPrice);
        this.itemTotal = amounts.reduce((sum, item) => sum + item);
        summaryElement.innerText = "$" + this.itemTotal;
    }

    calculateOrderTotal() {
        this.tax = (this.itemTotal * 0.06);
        this.shipping = 10 + (this.list.length - 1) * 2;
        this.orderTotal = (
            parseFloat(this.itemTotal) + 
            parseFloat(this.tax) + 
            parseFloat(this.shipping)
        )

        this.displayOrderTotals();
    }

    displayOrderTotals() { 
        const tax = document.querySelector(`${this.outputSelector} #tax`);
        const shipping = document.querySelector(`${this.outputSelector} #shipping`);
        const orderTotal = document.querySelector(`${this.outputSelector} #orderTotal`);

        tax.innerText = `$${this.tax.toFixed(2)}`;
        shipping.innerText = `$${this.shipping.toFixed(2)}`;
        orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
    }

    async checkout() {
        const formElement = document.forms["checkout"];
        const order = formDataToJSON(formElement);

        order.orderDate = new Date().toISOString();
        order.orderTotal = this.orderTotal;
        order.tax = this.tax;
        order.shipping = this.shipping;
        order.items = packageItems(this.list);

        try {
        const response = await services.checkout(order);
        console.log(response);
        } catch (err) {
        console.log(err);
        }
    }
}
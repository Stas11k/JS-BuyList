const form = document.querySelector(".add-form");
const input = document.querySelector("#product-name");
const productsList = document.querySelector(".products-list");

let products = [];

render();

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = input.value.trim();
    if (!name) {
        input.focus();
        return;
    }
    products.push({
        id: Date.now(),
        name: name,
        count: 1,
        bought: false
    });
    input.value = "";
    input.focus();
    render();
});

function render() {
    productsList.textContent = "";
    products.forEach(product => {
        productsList.append(createProductElement(product));
    });
}

function createProductElement(product) {
    const li = document.createElement("li");
    li.classList.add("product");
    const name = document.createElement("p");
    name.classList.add("product-name");
    name.textContent = product.name;
    li.append(name);
    return li;
}
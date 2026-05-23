const form = document.querySelector(".add-form");
const input = document.querySelector("#product-name");
const productsList = document.querySelector(".products-list");
const summarySections = document.querySelectorAll(".summary-section");

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

productsList.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button)  return;
    const productElement = button.closest(".product");
    const id = Number(productElement.dataset.id);
    const product = products.find(item => item.id === id);

    if (!product) return;
    if (button.classList.contains("delete")) products = products.filter(item => item.id !== id);
    if (button.classList.contains("plus")) product.count++;
    if (button.classList.contains("minus") && product.count > 1) product.count--;
    if (button.dataset.action === "buy") product.bought = true;
    if (button.dataset.action === "unbuy") product.bought = false;

    render();
});

function render() {
    productsList.textContent = "";
    products.forEach(product => {
        productsList.append(createProductElement(product));
    });
    renderSummary();
}

function createProductElement(product) {
    const li = document.createElement("li");
    li.classList.add("product");
    li.dataset.id = product.id;
    if (product.bought) {
        li.classList.add("product-bought");
    }
    const name = document.createElement("p");
    name.classList.add("product-name");
    name.textContent = product.name;

    const counter = document.createElement("output");
    counter.classList.add("counter");
    counter.textContent = product.count;

    if (product.bought) {
        const unbuyButton = document.createElement("button");
        unbuyButton.type = "button";
        unbuyButton.textContent = "Не куплено";
        unbuyButton.dataset.action = "unbuy";
        li.append(name, counter, unbuyButton);
        return li;
    }

    const controls = document.createElement("menu");
    controls.classList.add("controls");

    const minusLi = document.createElement("li");
    const minusButton = document.createElement("button");

    minusButton.type = "button";
    minusButton.textContent = "-";
    minusButton.classList.add("minus");

    if (product.count === 1) {
        minusButton.disabled = true;
        minusButton.classList.add("disabled");
    }

    minusLi.append(minusButton);

    const counterLi = document.createElement("li");
    counterLi.append(counter);

    const plusLi = document.createElement("li");
    const plusButton = document.createElement("button");

    plusButton.type = "button";
    plusButton.textContent = "+";
    plusButton.classList.add("plus");

    plusLi.append(plusButton);
    controls.append(minusLi, counterLi, plusLi);

    const buyButton = document.createElement("button");
    buyButton.type = "button";
    buyButton.textContent = "Куплено";
    buyButton.dataset.action = "buy";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.classList.add("delete");

    li.append(name, controls, buyButton, deleteButton);
    return li;
}

function renderSummary() {
    const notBoughtList = summarySections[0].querySelector(".summary-list");
    const boughtList = summarySections[1].querySelector(".summary-list");
    notBoughtList.textContent = "";
    boughtList.textContent = "";
    products.forEach(product => {
        const item = createSummaryItem(product);
        if (product.bought) {
            item.classList.add("bought-label");
            boughtList.append(item);
        } else {
            notBoughtList.append(item);
        }
    });
}

function createSummaryItem(product) {
    const li = document.createElement("li");
    const name = document.createElement("strong");
    name.textContent = product.name;
    const amount = document.createElement("output");
    amount.classList.add("amount");
    amount.textContent = product.count;
    li.append(name, amount);
    return li;
}
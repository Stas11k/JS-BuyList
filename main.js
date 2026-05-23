const form = document.querySelector(".add-form");
const input = document.querySelector("#product-name");
const productsList = document.querySelector(".products-list");
const summarySections = document.querySelectorAll(".summary-section");

const STORAGE_KEY = "buy-list-products";
let products = loadProducts();

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
    saveAndRender();
});

productsList.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    const name = event.target.closest(".product-name");
    if (name) {
        startEditingName(name);
        return;
    }
    if (!button) {
        return;
    }

    const productElement = button.closest(".product");
    const id = Number(productElement.dataset.id);
    const product = products.find(item => item.id === id);

    if (!product) return;
    if (button.classList.contains("delete")) products = products.filter(item => item.id !== id);
    if (button.classList.contains("plus")) product.count++;
    if (button.classList.contains("minus") && product.count > 1) product.count--;
    if (button.dataset.action === "buy") product.bought = true;
    if (button.dataset.action === "unbuy") product.bought = false;

    saveAndRender();
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
        unbuyButton.dataset.tooltip = "Повернути до покупок";
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
    minusButton.dataset.tooltip = "Зменшити кількість";

    if (product.count === 1) {
        minusButton.classList.add("disabled");
        minusButton.disabled = true;
        minusButton.dataset.tooltip = "Мінімальна кількість";
    }

    minusLi.append(minusButton);

    const counterLi = document.createElement("li");
    counterLi.append(counter);

    const plusLi = document.createElement("li");
    const plusButton = document.createElement("button");
    plusButton.type = "button";
    plusButton.textContent = "+";
    plusButton.classList.add("plus");
    plusButton.dataset.tooltip = "Збільшити кількість";
    plusLi.append(plusButton);
    controls.append(minusLi, counterLi, plusLi);

    const buyButton = document.createElement("button");
    buyButton.type = "button";
    buyButton.textContent = "Куплено";
    buyButton.dataset.action = "buy";
    buyButton.dataset.tooltip = "Позначити як куплене";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.classList.add("delete");
    deleteButton.dataset.tooltip = "Видалити товар";

    li.append(name, controls, buyButton, deleteButton);

    return li;
}

function startEditingName(nameElement) {
    const productElement = nameElement.closest(".product");
    const id = Number(productElement.dataset.id);
    const product = products.find(item => item.id === id);

    if (!product || product.bought) return;

    const editInput = document.createElement("input");
    editInput.classList.add("editable");
    editInput.value = product.name;

    nameElement.replaceWith(editInput);
    editInput.focus();

    editInput.addEventListener("blur", () => {
        const newName = editInput.value.trim();
        if (newName) product.name = newName;
        saveAndRender();
    });

    editInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") editInput.blur();
    });
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

function saveAndRender() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    render();
}

function loadProducts() {
    const savedProducts = localStorage.getItem(STORAGE_KEY);

    if (savedProducts) {
        return JSON.parse(savedProducts);
    }

    return [
        {
            id: 1,
            name: "Помідори",
            count: 2,
            bought: true
        },
        {
            id: 2,
            name: "Печиво",
            count: 2,
            bought: false
        },
        {
            id: 3,
            name: "Сир",
            count: 1,
            bought: false
        }
    ];
}
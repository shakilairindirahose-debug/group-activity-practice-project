

function register() {
    let username = document.getElementById("regUsername").value;
    let email = document.getElementById("regEmail").value;
    let password = document.getElementById("regPassword").value;
    let confirm = document.getElementById("confirm").value;

    if (!username || !email || !password || !confirm) {
        alert("Please fill all fields");
        return;
    }

    if (password !== confirm) {
        alert("Passwords do not match");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let userExists = users.find(user => user.email === email);

    if (userExists) {
        alert("User already exists");
        return;
    }

    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", username);

    window.location.href = "dashboard.html";
}

function login() {
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let validUser = users.find(user =>
        user.email === email && user.password === password
    );

    if (validUser) {
        localStorage.setItem("loggedInUser", validUser.username);
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid email or password");
    }
}

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}

function protectDashboard() {
    let currentUser = localStorage.getItem("loggedInUser");

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    let welcome = document.getElementById("welcomeUser");
    if (welcome) {
        welcome.innerText = "Welcome " + currentUser;
    }
}


let products = JSON.parse(localStorage.getItem("products")) || [];
let editIndex = null;

function displayDashboardProducts(list = products) {

    let dashboardBody = document.querySelector("#dashboardTable tbody");
    let productBody = document.querySelector("#productTable tbody");

    if (dashboardBody) dashboardBody.innerHTML = "";
    if (productBody) productBody.innerHTML = "";

    list.forEach((p, index) => {

        let statusText = p.quantity > 0 ? "IN STOCK" : "OUT STOCK";
        let statusClass = p.quantity > 0 ? "in-stock" : "out-stock";
        let rowClass = p.quantity > 0 ? "row-in" : "row-out";

        
        if (dashboardBody) {
            let row = document.createElement("tr");
            row.classList.add(rowClass);

            row.innerHTML = `
                <td>${p.name}</td>
                <td>${p.id}</td>
                <td>${p.quantity}</td>
                <td>${p.price}</td>
                <td class="${statusClass}">${statusText}</td>
                <td>
                    <button onclick="editProduct(${index})">Edit</button>
                    <button onclick="deleteProduct(${index})">Delete</button>
                </td>
            `;

            dashboardBody.appendChild(row);
        }

        
        if (productBody) {
            let row2 = document.createElement("tr");
            row2.classList.add(rowClass);

            row2.innerHTML = `
                <td>${p.name}</td>
                <td>${p.id}</td>
                <td>${p.quantity}</td>
                <td>${p.price}</td>
                <td class="${statusClass}">${statusText}</td>
            `;

            productBody.appendChild(row2);
        }
    });

    updateDashboard();
}

let form = document.getElementById("productForm");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        let product = {
            name: document.getElementById("productName").value,
            id: document.getElementById("productId").value,
            quantity: parseInt(document.getElementById("quantity").value),
            price: document.getElementById("price").value
        };

        if (editIndex !== null) {
            products[editIndex] = product;
            editIndex = null;
        } else {
            products.push(product);
        }

        localStorage.setItem("products", JSON.stringify(products));

        displayDashboardProducts();
        this.reset();
    });
}

function editProduct(index) {
    let product = products[index];

    document.getElementById("productName").value = product.name;
    document.getElementById("productId").value = product.id;
    document.getElementById("quantity").value = product.quantity;
    document.getElementById("price").value = product.price;

    editIndex = index;
}

function deleteProduct(index) {
    if (confirm("Delete this product?")) {
        products.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(products));
        displayDashboardProducts();
        updateDashboard();
    }
}

function searchProduct() {
    let input = document.getElementById("searchInput").value.toLowerCase();

    let filtered = products.filter(p =>
        p.name.toLowerCase().includes(input)
    );

    displayDashboardProducts(filtered);
}


function loadPage(page) {
    let pages = document.querySelectorAll(".page");
    pages.forEach(function (p) {
        p.style.display = "none";
    });

    document.getElementById(page + "Page").style.display = "block";

    displayDashboardProducts();
}

function updateDashboard(){

    let total = products.length;
    let inStock = 0;
    let outStock = 0;

    products.forEach(product => {
        if(product.quantity > 0){
            inStock++;
        }else{
            outStock++;
        }
    });

    let inPercent = total === 0 ? 0 : ((inStock/total)*100).toFixed(1);
    let outPercent = total === 0 ? 0 : ((outStock/total)*100).toFixed(1);

    document.getElementById("totalProduct").innerText = total;
    document.getElementById("inStock").innerText = inStock;
    document.getElementById("outStock").innerText = outStock;

    document.getElementById("inPercent").innerText = inPercent + "%";
    document.getElementById("outPercent").innerText = outPercent + "%";

    let inText = document.getElementById("inStockText");
    let outText = document.getElementById("outStockText");

    if(inText) inText.style.color = inStock > 0 ? "green" : "black";
    if(outText) outText.style.color = outStock > 0 ? "red" : "black";
}


window.onload = function () {

    if (document.getElementById("dashboardTable")) {
        protectDashboard();
    }

    displayDashboardProducts();
    updateDashboard();
};
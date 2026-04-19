let products = JSON.parse(localStorage.getItem("products")) || [];

function displayProductsPage(list = products) {
    let tableBody = document.querySelector("#productPageTable tbody");
    tableBody.innerHTML = "";
    list.forEach(p => {
        tableBody.innerHTML += `<tr>
            <td>${p.name}</td>
            <td>${p.id}</td>
            <td>${p.quantity}</td>
            <td>${p.price}</td>
        </tr>`;
    });
}
function searchProductsPage() {
    let input = document.getElementById("productPageSearch").value.toLowerCase();
    let filtered = products.filter(p => p.name.toLowerCase().includes(input));
    displayProductsPage(filtered);
}
displayProductsPage();

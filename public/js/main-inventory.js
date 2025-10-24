let siteBarBtns = document.querySelectorAll(".btn-site-bar");
let pages = document.querySelectorAll(".page");
let sucsessMass = document.querySelector(".sucsess-mass");
let tbodyDash = document.querySelector(".inner-dash");
let tbodyProduct = document.querySelector(".inner-product");
let input = document.querySelectorAll("input");
let nameInput = document.getElementById("name-input");
let Category = document.getElementById("Category");
let Cost = document.getElementById("Cost-input");
let percentage = document.getElementById("percentage-input");
let sellingPrice = document.getElementById("selling-price-input");
let qun = document.getElementById("qun");
let mainStock = document.getElementById("main-stock");
let save = document.getElementById("save");
let idProductEdite;
let mood = "create";
let searchMood = "dashboard";
let deleteIndex;

Cost.value = "0";
percentage.value = "0";
sellingPrice.value = "0";
qun.value = "0";
mainStock.value = "0";

input.forEach((input) => {
  input.addEventListener("click", (e) => {
    if (input.value === "0") {
      input.select();
    } else {
      e.preventDefault();
    }
  });
  input.addEventListener("input", Calculate);
});
function Calculate() {
  let cost = parseFloat(Cost.value) || 0;
  let perc = parseFloat(percentage.value) || 0;
  let sell = parseFloat(sellingPrice.value) || 0;

  if (document.activeElement === percentage && cost > 0) {
    sellingPrice.value = (cost + (cost * perc) / 100).toFixed(2);
  } else if (document.activeElement === sellingPrice && cost > 0) {
    percentage.value =
      sellingPrice.value || (((sell - cost) / cost) * 100).toFixed(2);
  } else if (document.activeElement === Cost && sell > 0) {
    percentage.value = (((sell - cost) / cost) * 100).toFixed(2);
  }
}

save.disabled = true;
nameInput.addEventListener("input", () => {
  if (nameInput.value.trim() === "") {
    save.disabled = true;
  } else {
    save.disabled = false;
  }
});

siteBarBtns.forEach((btn, i) => {
  btn.addEventListener("click", (event) => {
    siteBarBtns.forEach((e, i) => {
      e.classList.remove("active");
    });
    event.currentTarget.classList.add("active");
    pages.forEach((page, i) => {
      page.classList.remove("active");
    });

    pages[i].classList.add("active");
  });
});



function openAddProductBtns() {
  document.querySelector(".addProductBtns").classList.add("active");
}

function closeAddProductBtns() {
  document.querySelector(".addProductBtns").classList.remove("active");
  save.disabled = true;

  if (mood === "update") {
    mood = "create";
    save.innerHTML = `Save`;
  }

  nameInput.value = "";
  Category.value = "";
  Cost.value = "0";
  percentage.value = "0";
  sellingPrice.value = "0";
  qun.value = "0";
  mainStock.value = "0";
}

// get data

let product = JSON.parse(localStorage.getItem("product") || "[]");

function saveProduct() {
  let nameProduct = nameInput.value;
  let CategoryProduct = Category.value;
  let CostProduct = Cost.value;
  let percentageProduct = percentage.value;
  let sellingPriceProduct = sellingPrice.value;
  let qunProduct = qun.value;
  let mainStockProduct = mainStock.value;

  if (mood === "create") {
    let newProduct = {
      nameProduct: nameProduct,
      CategoryProduct: CategoryProduct,
      CostProduct: CostProduct,
      percentageProduct: percentageProduct,
      sellingPriceProduct: sellingPriceProduct,
      qunProduct: qunProduct,
      mainStockProduct: mainStockProduct,
    };

    product.push(newProduct);
    sucsessMass.innerHTML = `<i class="fa-solid fa-circle-check"></i> add item  successfully
`;
    sucsessMass.classList.add("active");
    setTimeout(() => {
      sucsessMass.classList.remove("active");
    }, 2000);
  } else if (mood === "update") {
    let item = product[idProductEdite];
    item.nameProduct = nameInput.value;
    item.CategoryProduct = Category.value;
    item.CostProduct = Cost.value;
    item.percentageProduct = percentage.value;
    item.sellingPriceProduct = sellingPrice.value;
    item.qunProduct = qun.value;
    item.mainStockProduct = mainStock.value;

    mood = "create";
    save.innerHTML = `Safe`;
    sucsessMass.innerHTML = `<i class="fa-solid fa-circle-check"></i> Item update successfully
`;
    sucsessMass.classList.add("active");
    setTimeout(() => {
      sucsessMass.classList.remove("active");
    }, 2000);
  }

  localStorage.setItem("product", JSON.stringify(product));
  inner();
  closeAddProductBtns();
  allPrice();
  outStock();
  lowStock();
  countItems();
  totalItems();
}

// inner

function inner() {
  let tableDash = "";
  let tableProduct = "";
  if (product.length === 0) {
    tableDash = `
    <tr>
      <td colspan="8" style="text-align:center; padding:10px; color:#999;">
        No items found
      </td>
    </tr>
  `;
    tableProduct = `
    <tr>
      <td colspan="10" style="text-align:center; padding:10px; color:#999;">
        No items found
      </td>
    </tr>
  `;
  }

  for (let i = 0; i < product.length; i++) {
    let stock;
    let bg;

    let qun = parseInt(product[i].qunProduct);
    let min = parseInt(product[i].mainStockProduct);

    if (qun <= 0) {
      stock = "Out of Stock";
      bg = "red";
    } else if (qun < min) {
      stock = "Low Stock";
      bg = "#233037";
    } else {
      stock = "In Stock";
      bg = "#00a00d";
    }

    tableDash += `
        <tr>
                <td>${[i]}</td>
                <td>${product[i].nameProduct}</td>
                <td>${product[i].CategoryProduct}</td>
                <td>${product[i].qunProduct}</td>
                <td>${product[i].mainStockProduct}</td>
                <td>${product[i].sellingPriceProduct}</td>
                <td><span class="in-stock-table"style="background-color:${bg};">${stock}</span></td>
                <td><span class="last-updated-table">10/20/2025</span></td>
              </tr>
        `;

    tableProduct += `
        <tr>
                <td>${[i]}</td>
                <td>${product[i].nameProduct}</td>
                <td>${product[i].CategoryProduct}</td>
                <td>${product[i].qunProduct}</td>
                <td>${product[i].mainStockProduct}</td>
                <td>${product[i].sellingPriceProduct}</td>
                <td><span class="in-stock-table"style="background-color:${bg};">${stock}</span></td>
                <td><span class="last-updated-table">10/20/2025</span></td>
                <td>
                  <span onclick="editeProduct(${[i]})" class="edit-pro-table"
                    ><i class="fa-solid fa-pen"></i
                  ></span>
                </td>
                <td>
                  <span onclick="deleteProduct(${[i]})" class="delete-pro-table"
                    ><i class="fa-solid fa-trash"></i
                  ></span>
                </td>
              </tr>
        `;
  }

  tbodyDash.innerHTML = tableDash;
  tbodyProduct.innerHTML = tableProduct;
}

function deleteProduct(i) {
  deleteIndex = i;
  document.querySelector(".alert-con").classList.add("active");
}

document.querySelector(".yes-delete").addEventListener("click", () => {
  sucsessMass.innerHTML = `<i class="fa-solid fa-circle-check"></i> Item deleted successfully
`;
  sucsessMass.classList.add("active");
  setTimeout(() => {
    sucsessMass.classList.remove("active");
  }, 2000);
  document.querySelector(".alert-con").classList.remove("active");

  product.splice(deleteIndex, 1);
  localStorage.setItem("product", JSON.stringify(product));

  inner();
  allPrice();
  outStock();
  lowStock();
  countItems();
  totalItems();
  deleteIndex = null;
});
document.querySelector(".no-cancel").addEventListener("click", () => {
  document.querySelector(".alert-con").classList.remove("active");
  deleteIndex = null;
});
function editeProduct(i) {
  save.disabled = false;
  mood = "update";
  save.innerHTML = `Update`;

  idProductEdite = i;

  let item = product[i];
  openAddProductBtns();

  nameInput.value = item.nameProduct;
  Category.value = item.CategoryProduct;
  Cost.value = item.CostProduct;
  percentage.value = item.percentageProduct;
  sellingPrice.value = item.sellingPriceProduct;
  qun.value = item.qunProduct;
  mainStock.value = item.mainStockProduct;
}

function allPrice() {
  let allPrice = product.reduce(
    (total, item) =>
      parseInt(total) +
      parseInt(item.sellingPriceProduct) * parseInt(item.qunProduct),
    0
  );

  document.querySelector(".count-Total").innerHTML = `${allPrice} EGP`;
}
function outStock() {
  let outStock = product.filter((item) => parseInt(item.qunProduct) <= 0);
  console.log(outStock);

  document.querySelector(
    ".count-Out-stock-dash"
  ).innerHTML = `${outStock.length}`;

  let innerOutinstock = "";
  for (i = 0; i < outStock.length; i++) {
    innerOutinstock += `
             <tr class="tr-out-in-stock">
                    <td>${[i]}</td>
                    <td>${outStock[i].nameProduct}</td>
                    <td>${outStock[i].CategoryProduct}</td>
                    <td>${outStock[i].qunProduct}</td>
                    <td>${outStock[i].mainStockProduct}</td>
                    <td>${outStock[i].sellingPriceProduct}</td>
                    <td><span class="in-stock-table"style="background-color:red;">out in stock</span></td>
                    <td><span class="last-updated-table">10/20/2025</span></td>
                </tr>
    `;
  }
  let containerOut = document.querySelector(".inner-out-in-stock");
  if (containerOut) {
    containerOut.innerHTML =
      innerOutinstock ||
      `<tr><td colspan="8" style="text-align:center;color:#999;">No items found</td></tr>`;
  }
}
function lowStock() {
  let lowStock = product.filter(
    (item) =>
      parseInt(item.qunProduct) < parseFloat(item.mainStockProduct) &&
      parseInt(item.qunProduct) > 0
  );

  document.querySelector(
    ".count-low-stock-dash"
  ).innerHTML = `${lowStock.length}`;

  
  let innerLowinstock = "";
  for (i = 0; i < lowStock.length; i++) {
    innerLowinstock += `
             <tr class="tr-out-in-stock">
                    <td>${[i]}</td>
                    <td>${lowStock[i].nameProduct}</td>
                    <td>${lowStock[i].CategoryProduct}</td>
                    <td>${lowStock[i].qunProduct}</td>
                    <td>${lowStock[i].mainStockProduct}</td>
                    <td>${lowStock[i].sellingPriceProduct}</td>
                    <td><span class="in-stock-table"style="background-color:#233037;">Low stock</span></td>
                    <td><span class="last-updated-table">10/20/2025</span></td>
                </tr>
    `;
  }
  let containerOut = document.querySelector(".inner-low-in-stock");
  if (containerOut) {
    containerOut.innerHTML =
      innerLowinstock ||
      `<tr><td colspan="8" style="text-align:center;color:#999;">No items found</td></tr>`;
  }
}

function totalItems() {
  let totalItems = product.reduce(
    (total, item) => parseInt(total) + parseInt(item.qunProduct),
    0
  );

  document.querySelector(".count-total-dash").innerHTML = `${totalItems}`;
}
function countItems() {
  let countItems = product.map((item) => item.nameProduct);

  document.querySelector(
    ".count-items-dash"
  ).innerHTML = `${countItems.length} products`;
}

// search

function dashboardMood() {
  searchMood = "dashboard";
  console.log(searchMood);
}
function productsMood() {
  searchMood = "products";
  console.log(searchMood);
  document.querySelector(".icon-ive").style.color = "#f7c855"
}

function search(value) {
  let tableDash = "";
  let tableProduct = "";

  if (searchMood === "dashboard") {
    for (i = 0; i < product.length; i++) {
      let stock;
      let bg;

    let qun = parseInt(product[i].qunProduct);
let min = parseInt(product[i].mainStockProduct);

if (qun <= 0) {
  stock = "Out of Stock";
  bg = "red";
} else if (qun < min) {
  stock = "Low Stock";
  bg = "#233037";
} else {
  stock = "In Stock";
  bg = "#00a00d";
}

      if (product[i].nameProduct.includes(value)) {
        tableDash += `
        <tr>
                <td>${[i]}</td>
                <td>${product[i].nameProduct}</td>
                <td>${product[i].CategoryProduct}</td>
                <td>${product[i].qunProduct}</td>
                <td>${product[i].mainStockProduct}</td>
                <td>${product[i].sellingPriceProduct}</td>
                <td><span class="in-stock-table"style="background-color:${bg};">${stock}</span></td>
                <td><span class="last-updated-table">10/20/2025</span></td>
              </tr>
        `;
      }
    }
    tbodyDash.innerHTML =
      tableDash ||
      `<tr><td colspan="8" style="text-align:center;color:#999;">No items found</td></tr>`;
  } else if (searchMood === "products") {
    for (i = 0; i < product.length; i++) {
      let stock;
      let bg;

      if (product[i].mainStockProduct > product[i].qunProduct) {
        stock = "Low Stock";
        bg = "#233037";
      } else if (
        product[i].mainStockProduct <= product[i].qunProduct &&
        product[i].qunProduct > 0
      ) {
        stock = "In Stock";
        bg = "#00a00d";
      } else if (product[i].qunProduct <= 0) {
        stock = "Out of Stock";
        bg = "red";
      }

      if (product[i].nameProduct.includes(value)) {
        tableProduct += `
        <tr>
                <td>${[i]}</td>
                <td>${product[i].nameProduct}</td>
                <td>${product[i].CategoryProduct}</td>
                <td>${product[i].qunProduct}</td>
                <td>${product[i].mainStockProduct}</td>
                <td>${product[i].sellingPriceProduct}</td>
                <td><span class="in-stock-table"style="background-color:${bg};">${stock}</span></td>
                <td><span class="last-updated-table">10/20/2025</span></td>
                <td>
                  <span onclick="editeProduct(${[i]})" class="edit-pro-table"
                    ><i class="fa-solid fa-pen"></i
                  ></span>
                </td>
                <td>
                  <span onclick="deleteProduct(${[i]})" class="delete-pro-table"
                    ><i class="fa-solid fa-trash"></i
                  ></span>
                </td>
              </tr>
        `;
      }
    }
    tbodyProduct.innerHTML =
      tableProduct ||
      `<tr><td colspan="10" style="text-align:center;color:#999;">No items found</td></tr>`;
  }
}

function openOutInStockCon() {
  document.querySelector(".out-in-stock-con").classList.add("active");
}
function closeOutInStockCon() {
  document.querySelector(".out-in-stock-con").classList.remove("active");
}
function openLowInStockCon() {
  document.querySelector(".low-in-stock-con").classList.add("active");
}
function closeLowInStockCon() {
  document.querySelector(".low-in-stock-con").classList.remove("active");
}


countItems();
totalItems();
outStock();
lowStock();

allPrice();

inner();

outStock();

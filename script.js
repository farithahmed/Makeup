let BASE_URL = "http://makeup-api.herokuapp.com/api/v1/";
let PRODUCT_URL = "products.json";
let products = [];
// Fetching product data

getProductList();

async function getProductList() {
    let productList = await fetch(BASE_URL + PRODUCT_URL);
    //let productList = await fetch('http://127.0.0.1:5500/product.json');
    products = await productList.json();
    let html = ''
    let categories = [...new Set(products.map((x) => { return x.category }).filter((x) => { return x!=null && x!=""}))];
    let brands = [...new Set(products.map((x) => { return x.brand }).filter((x) => x != null  && x!=""))];
    let htmlCategories = "<option  value=''>Select Categories</option>";
    categories.forEach((x) => {
        htmlCategories += `<option value="${x}">${x}</option>`;
        let categories = document.querySelector('.categories');
        categories.innerHTML = htmlCategories;
    })
    let htmlbrands = "<option value=''>Select Brands</option>";
    brands.forEach((x) => {
        htmlbrands += `<option value="${x}">${x}</option>`;
        let brands = document.querySelector('.brands');
        brands.innerHTML = htmlbrands;
    })
    constructProducts();

    document.getElementById("loading").classList.remove('loading');
}

function constructProducts(limit=10,offset=0) {
    let Items = JSON.parse(JSON.stringify(products));
    let slicedItems = Items.slice(offset, limit);
    let html = "";
    let brandFilter = document.querySelector('.brands').value;
    let categoryFilter = document.querySelector('.categories').value;
    if (brandFilter !== "") {
        slicedItems = slicedItems.filter((x) => x.brand == brandFilter)
    }
    if (categoryFilter !== "") {
        slicedItems = slicedItems.filter((x) => x.category == categoryFilter)
    }
    slicedItems.forEach((result,i) => {
        html += constructItems(result); 
    })
   // console.log(html);
    let productClass = document.querySelector('.products');
    productClass.innerHTML = html;
}

function constructItems(result) {
    let price_sign = result.price_sign == null ? '$' : result.price_sign; 
    let price = result.price == null ? 0 : result.price; 
    console.log(result.description);
    return `<div class="col-md-3">
    <div class="dress-card">
      <div class="dress-card-head">
        <img class="dress-card-img-top" src="https:${result.api_featured_image}" alt="">
        
      </div>
      <div class="dress-card-body">
        <h4 class="dress-card-title">${result.name}</h4>
        <p class="dress-card-para">${result.brand} | ${result.category}</p>
        <p class="dress-card-para"><span class="dress-card-price">${price_sign}${price} &ensp;</span></p>
        <p class="dress-card-para">${result.description !== null && result.description !== "" && result.description ? result.description.slice(0,100):""}...</p>
      </div>
    </div>
  </div>
                `;
}

function filterCategories(data) {
    if (data !== "") {
        let brandFilter = document.querySelector('.brands').value;
        let Items = JSON.parse(JSON.stringify(products));
        let filteredData = Items.filter((x) => x.category === data);
        if (brandFilter !== "") {
            filteredData = filteredData.filter((x) => x.brand == brandFilter)
        }
        let html = "";
        filteredData.forEach((result) => {
            html += constructItems(result);
        })
        let productClass = document.querySelector('.products');
        productClass.innerHTML = html;
    } else {
        constructProducts();
    }
}

function filterBrands(data) {
    if (data !== "") {
        let categoryFilter = document.querySelector('.categories').value;
        let Items = JSON.parse(JSON.stringify(products));
        let filteredData = Items.filter((x) => x.brand === data);
        if (categoryFilter !== "") {
            filteredData = filteredData.filter((x) => x.category == categoryFilter)
        }
        let html = "";
        filteredData.forEach((result) => {
            html += constructItems(result);
        })
        let productClass = document.querySelector('.products');
        productClass.innerHTML = html;
    } else {
        constructProducts();
    }
}

function pagination() {
    let totalRows = document.getElementsByClassName('dress-card').length;
    console.log(totalRows);
    constructProducts(10 + (totalRows), 0);
}

const itemsPerPage = 5;
let currentPage = 1;
let userRole = 0;
let totalRowsAmount = 0;

//Selectors
const totalAmountElement = document.querySelector('#rows-amount');
const searchButton = document.querySelector('#search');
const modalSelector = document.querySelector('#deleteProduct');
const resultModal = new bootstrap.Modal(modalSelector);

const infoModalSelector = document.querySelector('#infoModal');
const infoModal = new bootstrap.Modal(infoModalSelector);
const infoTitleSelector = document.querySelector('#infoModalTitle');
const infoBodySelector = document.querySelector('#infoModalBody');

const deleteProductBtnSelector = document.querySelector('#deleteProductBtn');

//Filter Selectors
const productIdInput = document.querySelector('#productId');
const textInput = document.querySelector('#searchByText');
const categorySelector = document.querySelector('#productCategory');
const sortBySelect = document.querySelector('#sortBy');
const orderBySelect = document.querySelector('#orderBy');

//Filter values
let productIdValue = productIdInput.value;
let textValue = encodeURIComponent(textInput.value);
let categoryValue = categorySelector.value;
let sortByValue = sortBySelect.value;
let orderByValue = orderBySelect.value;

searchButton.onclick = async function () {
  updateInputValues();
  currentPage = 1;

  await loadTableData(generateFetchURL(currentPage), currentPage);
  await loadPagination(currentPage);
};

function generateFetchURL(currentPage) {
  return `/api/products/search?limit=${itemsPerPage}&page=${currentPage}&productId=${productIdValue}&text=${textValue}&categoryNumber=${categoryValue}&sortBy=${sortByValue}&order=${orderByValue}`;
}

function updateInputValues() {
  productIdValue = productIdInput.value;
  textValue = encodeURIComponent(textInput.value);
  categoryValue = categorySelector.value;
  sortByValue = sortBySelect.value;
  orderByValue = orderBySelect.value;
}

fetchUserRole().then((role) => {
  userRole = role;
});

async function fetchUserRole() {
  const response = await fetch('/api/user');
  const userData = await response.json();
  return userData.employee_role;
}

window.onload = init;
async function init() {
  await loadTableData(generateFetchURL(currentPage), currentPage);
  await loadPagination(currentPage);
  handlePrintButton();
}

async function generateInteractionButtons(product_id) {
  let htmlContent = `<button class="btn btn-primary" data-id="${product_id}" onclick="openProductInfo(this)"><i class="fa-solid fa-info"></i></button>`;
  if (userRole === 1 || userRole === 2) {
    htmlContent = htmlContent.concat(
      `<button class="btn btn-warning" data-id="${product_id}" onclick="openEditProduct(this)"><i class="fa-solid fa-pen-to-square"></i></button>` +
        `<button class="btn btn-danger" data-id="${product_id}" onclick="openDeleteProduct(this)"><i class="fa-solid fa-trash"></i></button>`,
    );
  }

  return htmlContent;
}

async function loadTableData(fetchUrl, currentPage) {
  const response = await fetch(fetchUrl);
  const data = await response.json();
  const tableBody = document.querySelector('#data-table tbody');
  const rowTemplate = document.createElement('tr');

  for (let i = 0; i < 6; i++) {
    const td = document.createElement('td');
    rowTemplate.appendChild(td);
  }
  tableBody.innerHTML = '';
  totalRowsAmount = data.amount;
  totalAmountElement.innerText = data.amount;

  let counter = 0;
  data.rows.forEach((product) => {
    let rowClone = rowTemplate.cloneNode(true);
    let rowColumns = rowClone.querySelectorAll('td');
    rowColumns[0].innerText = (currentPage - 1) * itemsPerPage + 1 + counter++;
    rowColumns[1].innerText = product.product_id;
    rowColumns[2].innerText = product.category_name;
    rowColumns[3].innerText = product.product_name;
    rowColumns[4].innerText = product.characteristics;
    generateInteractionButtons(product.product_id).then((res) => {
      rowColumns[5].innerHTML = `<div class="actions-container">${res}</div>`;
    });

    tableBody.appendChild(rowClone);
  });
}

async function loadPagination(currentPage) {
  const totalPages = Math.ceil(totalRowsAmount / itemsPerPage);

  const paginationContainer = document.querySelector('.pagination');
  paginationContainer.innerHTML = '';

  const previousPageButton = document.createElement('li');
  previousPageButton.classList.add('page-item');
  if (currentPage === 1) {
    previousPageButton.classList.add('disabled');
  }
  const previousPageLink = document.createElement('a');
  previousPageLink.classList.add('page-link');
  previousPageLink.style['user-select'] = 'none';
  previousPageLink.innerText = 'Минула';
  previousPageLink.onclick = async () => {
    if (currentPage > 1) {
      currentPage--;
      await loadTableData(generateFetchURL(currentPage), currentPage);
      await loadPagination(currentPage);
    }
  };
  previousPageButton.appendChild(previousPageLink);
  paginationContainer.appendChild(previousPageButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('li');
    pageButton.classList.add('page-item');
    if (i === currentPage) {
      pageButton.classList.add('active');
      pageButton.setAttribute('aria-current', 'page');
    }
    const pageLink = document.createElement('a');
    pageLink.classList.add('page-link');
    pageLink.innerText = i;
    pageLink.onclick = async () => {
      currentPage = i;
      await loadTableData(generateFetchURL(currentPage), currentPage);
      await loadPagination(currentPage);
    };
    pageButton.appendChild(pageLink);
    paginationContainer.appendChild(pageButton);
  }

  const nextPageButton = document.createElement('li');
  nextPageButton.classList.add('page-item');
  nextPageButton.style['user-select'] = 'none';
  if (currentPage === totalPages) {
    nextPageButton.classList.add('disabled');
  }
  const nextPageLink = document.createElement('a');
  nextPageLink.classList.add('page-link');
  nextPageLink.innerText = 'Наступна';
  nextPageLink.onclick = async () => {
    if (currentPage < totalPages) {
      currentPage++;
      await loadTableData(generateFetchURL(currentPage), currentPage);
      await loadPagination(currentPage);
    }
  };
  nextPageButton.appendChild(nextPageLink);
  paginationContainer.appendChild(nextPageButton);
}

let addProductButton = document.querySelector('#addProductBtn');

addProductButton.onclick = function () {
  window.open('/products/add-product', '_blank');
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function openProductInfo(button) {
  let id = button.getAttribute('data-id');

  let newTab = window.open('/products/about?id=' + id, '_blank');

  newTab.focus();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function openEditProduct(button) {
  let id = button.getAttribute('data-id');

  let newTab = window.open('/products/edit-product?id=' + id, '_blank');

  newTab.focus();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function openDeleteProduct(button) {
  let id = button.getAttribute('data-id');
  resultModal.hide();
  resultModal.show();

  deleteProductBtnSelector.onclick = async () => {
    let response = await fetch(`api/products/delete?id=${id}`, {
      method: 'DELETE',
    });
    resultModal.hide();

    let jsonResponse = await response.json();
    console.log(jsonResponse);

    infoTitleSelector.textContent = jsonResponse.title;
    infoBodySelector.textContent = jsonResponse.description;
    infoModal.show();

    loadTableData(generateFetchURL(1), 1);
    loadPagination(1);
  };
}

function handlePrintButton() {
  let printButton = document.getElementById('print-button');
  printButton.onclick = async function () {
    const response = await fetch(
      `/api/products/search?productId=${productIdValue}&text=${textValue}&categoryNumber=${categoryValue}&sortBy=${sortByValue}&order=${orderByValue}`,
    );
    const data = await response.json();
    const tableBodyToPrint = document.getElementById('table-body-to-print');
    tableBodyToPrint.setAttribute('data-table-theme', 'default');
    const rowTemplate = document.createElement('tr');
    for (let i = 0; i < 5; i++) {
      const td = document.createElement('td');
      rowTemplate.appendChild(td);
    }
    tableBodyToPrint.innerHTML = '';
    totalRowsAmount = data.amount;
    totalAmountElement.innerText = data.amount;

    let counter = 0;
    data.rows.forEach((product) => {
      let rowClone = rowTemplate.cloneNode(true);
      let rowColumns = rowClone.querySelectorAll('td');
      rowColumns[0].innerText =
        (currentPage - 1) * itemsPerPage + 1 + counter++;
      rowColumns[1].innerText = product.product_id;
      rowColumns[2].innerText = product.category_name;
      rowColumns[3].innerText = product.product_name;
      rowColumns[4].innerText = product.characteristics;

      tableBodyToPrint.appendChild(rowClone);
    });

    let content = document.getElementById('content-to-print').innerHTML;
    let printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(
      '<html><head>' +
        '<style>table {  color: black;  background: white;  border: 1px solid #0e0d0d;' +
        'font-size: 10pt;  border-collapse: collapse;}' +
        'table thead th,table tfoot th {  color: black;  background: rgba(0,0,0,.1);}' +
        'table caption {  padding:.5em;}' +
        'table th,table td {  padding: .5em;  border: 1px solid lightgrey;}' +
        '</style>' +
        '<title>Print</title></head><body>' +
        content +
        '</body></html>',
    );
    printWindow.document.close();
    printWindow.print();
    tableBodyToPrint.innerHTML = '';
  };
}

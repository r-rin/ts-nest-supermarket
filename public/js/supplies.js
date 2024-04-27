const itemsPerPage = 7;
let currentPage = 1;
let totalRowsAmount = 0;

let userRole = 0;

//Selectors
const totalAmountElement = document.querySelector('#rows-amount');
const searchButton = document.querySelector('#search');
const modalSelector = document.querySelector('#deleteSupply');
const resultModal = new bootstrap.Modal(modalSelector);

const infoModalSelector = document.querySelector('#infoModal');
const infoModal = new bootstrap.Modal(infoModalSelector);
const infoTitleSelector = document.querySelector('#infoModalTitle');
const infoBodySelector = document.querySelector('#infoModalBody');

const deleteSupplyBtnSelector = document.querySelector('#deleteSupplyBtn');

//Filter Selectors
const supplyUPCInput = document.querySelector('#supplyUPC');
const textInput = document.querySelector('#searchByText');
const typeSelector = document.querySelector('#supplyType');
const sortBySelect = document.querySelector('#sortBy');
const orderBySelect = document.querySelector('#orderBy');

//Filter values
let supplyUPCValue = supplyUPCInput.value;
let textValue = encodeURIComponent(textInput.value);
let typeValue = typeSelector.value;
let sortByValue = sortBySelect.value;
let orderByValue = orderBySelect.value;

searchButton.onclick = async function () {
  updateInputValues();
  currentPage = 1;

  await loadTableData(generateFetchURL(currentPage), currentPage);
  await loadPagination(currentPage);
};

function generateFetchURL(currentPage) {
  return `/api/supplies/search?limit=${itemsPerPage}&page=${currentPage}&UPC=${supplyUPCValue}&text=${textValue}&type=${typeValue}&sortBy=${sortByValue}&order=${orderByValue}`;
}

function updateInputValues() {
  supplyUPCValue = supplyUPCInput.value;
  textValue = encodeURIComponent(textInput.value);
  typeValue = typeSelector.value;
  sortByValue = sortBySelect.value;
  orderByValue = orderBySelect.value;
}

fetchUserRole().then((role) => {
  userRole = role;
});

// PAGINATION SELECTORS
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

async function generateInteractionButtons(UPC, isProm, UPC_prom) {
  let htmlContent = `<button class="btn btn-primary" data-upc="${UPC}" onclick="openSupplyInfo(this)"><i class="fa-solid fa-info"></i></button>`;

  if (userRole === 0) {
    htmlContent = htmlContent.concat(
      `<button class="btn btn-outline-success" data-upc="${UPC}" onclick="addToCart(this)"><i class="fa-solid fa-basket-shopping"></i></button>`,
    );
  }

  if (userRole === 1 || userRole === 2) {
    htmlContent = htmlContent.concat(
      `<button class="btn btn-warning" data-upc="${UPC}" onclick="openEditSupply(this)"><i class="fa-solid fa-pen-to-square"></i></button>` +
        `<button class="btn btn-danger" data-upc="${UPC}" onclick="openDeleteSupply(this)"><i class="fa-solid fa-trash"></i></button>`,
    );

    if (!isProm && UPC_prom == null) htmlContent += `<button class="btn btn-success" data-upc="${UPC}" onclick="openCreateProm(this)"><i class="fa-solid fa-percent"></i></button>`;
  }

  return htmlContent;
}

async function loadTableData(fetchURL, currentPage) {
  const response = await fetch(fetchURL);
  const data = await response.json();
  const tableBody = document.querySelector('#data-table tbody');
  const rowTemplate = document.querySelector('#row-template').content;

  tableBody.innerHTML = '';

  totalRowsAmount = data.amount;
  totalAmountElement.innerText = data.amount;

  let counter = 0;
  data.rows.forEach((supply) => {
    let rowClone = rowTemplate.querySelector('tr').cloneNode(true);
    let rowColumns = rowClone.querySelectorAll('td');

    rowColumns[0].innerText = (currentPage - 1) * itemsPerPage + 1 + counter++;
    rowColumns[1].innerText = supply.UPC;
    rowColumns[2].innerText = supply.UPC_prom ? supply.UPC_prom : 'Відсутній';
    rowColumns[3].innerText = supply.product_name;
    rowColumns[4].innerText = supply.selling_price;
    rowColumns[5].innerText = supply.products_amount;
    rowColumns[6].innerText = supply.is_promotional ? 'Так' : 'Ні';
    generateInteractionButtons(supply.UPC, supply.is_promotional, supply.UPC_prom).then((res) => {
      rowColumns[7].innerHTML = `<div class="actions-container">${res}</div>`;
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

let addSupplyButton = document.querySelector('#addSupplyBtn');

if (addSupplyButton) {
  addSupplyButton.onclick = function () {
    window.open('/supplies/add-supply', '_blank');
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function openSupplyInfo(button) {
  let upc = button.getAttribute('data-upc');

  let newTab = window.open('/supplies/about?upc=' + upc, '_blank');

  newTab.focus();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function openEditSupply(button) {
  let upc = button.getAttribute('data-upc');

  let newTab = window.open('/supplies/edit-supply?upc=' + upc, '_blank');

  newTab.focus();
}

function addToCart(button) {
  let upc = button.getAttribute('data-upc');
  let checkoutObj = JSON.parse(localStorage.getItem('checkout'));

  if (checkoutObj[upc]) {
    checkoutObj[upc] += 1;
  } else {
    checkoutObj[upc] = 1;
  }

  localStorage.setItem('checkout', JSON.stringify(checkoutObj));
}

function openCreateProm(button) {
  let upc = button.getAttribute('data-upc');

  let newTab = window.open('/supplies/create-promotional?upc=' + upc, '_blank');

  newTab.focus();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function openDeleteSupply(button) {
  let upc = button.getAttribute('data-upc');
  resultModal.hide();
  resultModal.show();

  deleteSupplyBtnSelector.onclick = async () => {
    let response = await fetch(`api/supplies/delete?upc=${upc}`, {
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
      `/api/supplies/search?UPC=${supplyUPCValue}&text=${textValue}&type=${typeValue}&sortBy=${sortByValue}&order=${orderByValue}`,
    );

    const data = await response.json();
    const tableBodyToPrint = document.getElementById('table-body-to-print');
    tableBodyToPrint.setAttribute('data-table-theme', 'default');
    const rowTemplate = document.createElement('tr');
    for (let i = 0; i < 10; i++) {
      const td = document.createElement('td');
      rowTemplate.appendChild(td);
    }
    tableBodyToPrint.innerHTML = '';
    totalRowsAmount = data.amount;
    totalAmountElement.innerText = data.amount;

    let counter = 0;
    data.rows.forEach((supply) => {
      let rowClone = rowTemplate.cloneNode(true);
      let rowColumns = rowClone.querySelectorAll('td');
      rowColumns[0].innerText =
        (currentPage - 1) * itemsPerPage + 1 + counter++;
      rowColumns[1].innerText = supply.UPC;
      rowColumns[2].innerText = supply.UPC_prom ? supply.UPC_prom : 'Відсутній';
      rowColumns[3].innerText = supply.product_id;
      rowColumns[4].innerText = supply.product_name;
      rowColumns[5].innerText = supply.selling_price;
      rowColumns[6].innerText = supply.products_amount;
      rowColumns[7].innerText = supply.is_promotional ? 'Так' : 'Ні';
      rowColumns[8].innerText = formatDate(supply.manufacturing_date);
      rowColumns[9].innerText = formatDate(supply.expiration_date);
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
function formatDate(inputDate) {
  const date = new Date(inputDate);
  return date.toLocaleDateString('en-GB');
}

document.querySelector("#basketBtn").onclick = () => {
  loadCheckoutItems().then(r => {checkoutSidebar.style.transform = "translateX(0px)";});
}
const itemsPerPage = 7;
let currentPage = 1;
let totalRowsAmount = 0;

let userRole = 0;

//Selectors
const totalAmountElement = document.querySelector('#rows-amount');
const searchButton = document.querySelector('#search');

//Filter Selectors
const supplyUPCInput = document.querySelector('#supplyUPC');
const textInput = document.querySelector('#searchByText');
const typeSelector = document.querySelector('#supplyType');
const sortBySelect = document.querySelector('#sortBy');
const orderBySelect = document.querySelector('#orderBy');

//Filter values
let supplyUPCValue = supplyUPCInput.value;
let textValue = textInput.value;
let typeValue = typeSelector.value;
let sortByValue = sortBySelect.value;
let orderByValue = orderBySelect.value;

searchButton.onclick = async function() {
  updateInputValues();
  currentPage = 1;

  await loadTableData(generateFetchURL(currentPage));
  await loadPagination(currentPage);
}

function generateFetchURL(currentPage) {
  return `/api/supplies/search?limit=${itemsPerPage}&page=${currentPage}&UPC=${supplyUPCValue}&text=${textValue}&type=${typeValue}&sortBy=${sortByValue}&order=${orderByValue}`;
}

function updateInputValues() {
  supplyUPCValue = supplyUPCInput.value;
  textValue = textInput.value;
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
  await loadTableData(generateFetchURL(currentPage));
  await loadPagination(currentPage);
}

async function generateInteractionButtons(UPC) {
  let htmlContent = `<button class="btn btn-primary" data-upc="${UPC}" onclick="openSupplyInfo(this)"><i class="fa-solid fa-info"></i></button>`;

  if (userRole === 0) {
    htmlContent = htmlContent.concat(
      `<button class="btn btn-outline-success"><i class="fa-solid fa-basket-shopping"></i></button>`,
    );
  }

  if (userRole === 1 || userRole === 2) {
    htmlContent = htmlContent.concat(
      `<button class="btn btn-warning" data-upc="${UPC}" onclick="openEditSupply(this)"><i class="fa-solid fa-pen-to-square"></i></button>` +
        `<button class="btn btn-danger"><i class="fa-solid fa-trash"></i></button>`,
    );
  }

  return htmlContent;
}

async function loadTableData(fetchURL) {
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
    generateInteractionButtons(supply.UPC).then((res) => {
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
      await loadTableData(generateFetchURL(currentPage));
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
      await loadTableData(generateFetchURL(currentPage));
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
      await loadTableData(generateFetchURL(currentPage));
      await loadPagination(currentPage);
    }
  };
  nextPageButton.appendChild(nextPageLink);
  paginationContainer.appendChild(nextPageButton);
}

let addSupplyButton = document.querySelector('#addSupplyBtn');

addSupplyButton.onclick = function () {
  window.open('/supplies/add-supply', '_blank');
};

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

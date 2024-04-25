const itemsPerPage = 7;
let currentPage = 1;
let userRole = 0;
let totalRowsAmount = 0;

//Selectors
const modalSelector = document.querySelector('#deleteReceipt');
const resultModal = new bootstrap.Modal(modalSelector);

const infoModalSelector = document.querySelector('#infoModal');
const infoModal = new bootstrap.Modal(infoModalSelector);
const infoTitleSelector = document.querySelector('#infoModalTitle');
const infoBodySelector = document.querySelector('#infoModalBody');

const deleteReceiptBtnSelector = document.querySelector('#deleteReceiptBtn');

fetchUserRole().then((role) => {
  userRole = role;
});

const totalAmountElement = document.querySelector('#rows-amount');

async function fetchUserRole() {
  const response = await fetch('/api/user');
  const userData = await response.json();
  return userData.employee_role;
}

window.onload = init;
async function init() {
  await loadTableData(currentPage);
  loadPagination(currentPage);
  handlePrintButton();
}

async function generateInteractionButtons(receipt_id) {
  let htmlContent = `<button class="btn btn-primary" data-id="${receipt_id}" onclick="openReceiptInfo(this)"><i class="fas fa-info"></i></button>`;

  if (userRole === 1 || userRole === 2) {
    htmlContent = htmlContent.concat(
      `<button class="btn btn-warning" data-id="${receipt_id}" onclick="openEditReceipt(this)"><i class="fa-solid fa-pen-to-square"></i></button>` +
        `<button class="btn btn-danger" data-id="${receipt_id}" onclick="openDeleteReceipt(this)"><i class="fa-solid fa-trash"></i></button>`,
    );
  }

  return htmlContent;
}

async function loadTableData(currentPage) {
  const response = await fetch(
    `/api/receipts/all?limit=${itemsPerPage}&page=${currentPage}`,
  );
  const data = await response.json();
  const tableBody = document.querySelector('#data-table tbody');
  const rowTemplate = document.createElement('tr');

  for (let i = 0; i < 7; i++) {
    const td = document.createElement('td');
    rowTemplate.appendChild(td);
  }
  tableBody.innerHTML = '';
  totalRowsAmount = data.amount;
  totalAmountElement.innerText = data.amount;

  let counter = 0;
  data.rows.forEach((receipt) => {
    let rowClone = rowTemplate.cloneNode(true);
    let rowColumns = rowClone.querySelectorAll('td');
    console.log(data);
    rowColumns[0].innerText = (currentPage - 1) * itemsPerPage + 1 + counter++;
    rowColumns[1].innerText = receipt.receipt_id;
    rowColumns[2].innerText = receipt.employee_id;
    rowColumns[3].innerText = receipt.card_number;
    rowColumns[4].innerText = receipt.print_date;
    rowColumns[5].innerText = receipt.sum_total;

    generateInteractionButtons(receipt.receipt_id).then((res) => {
      rowColumns[6].innerHTML = `<div class="actions-container">${res}</div>`;
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
  previousPageLink.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      loadTableData(currentPage);
      loadPagination(currentPage);
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
    pageLink.onclick = () => {
      currentPage = i;
      loadTableData(currentPage);
      loadPagination(currentPage);
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
  nextPageLink.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      loadTableData(currentPage);
      loadPagination(currentPage);
    }
  };
  nextPageButton.appendChild(nextPageLink);
  paginationContainer.appendChild(nextPageButton);
}

let addReceiptButton = document.querySelector('#addReceiptBtn');

addReceiptButton.onclick = function () {
  window.open('/receipts/add-receipt', '_blank');
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function openReceiptInfo(button) {
  let id = button.getAttribute('data-id');

  let newTab = window.open('/receipts/about?id=' + id, '_blank');

  newTab.focus();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function openEditReceipt(button) {
  let id = button.getAttribute('data-id');

  let newTab = window.open('/receipts/edit-receipt?id=' + id, '_blank');

  newTab.focus();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function openDeleteReceipt(button) {
  let id = button.getAttribute('data-id');
  resultModal.hide();
  resultModal.show();

  deleteReceiptBtnSelector.onclick = async () => {
    let response = await fetch(`api/receipts/delete?id=${id}`, {
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
  printButton.onclick = function () {
    window.print();
  };
}

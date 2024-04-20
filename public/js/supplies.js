const itemsPerPage = 7;
let currentPage = 1;
let totalRowsAmount = 0;

let userRole = 0;
fetchUserRole().then((role) => {
  userRole = role;
});

// SELECTORS
const totalAmountSpan = document.querySelector('#rows-amount');

// PAGINATION SELECTORS

async function fetchUserRole() {
  const response = await fetch('/api/user');
  const userData = await response.json();
  return userData.employee_role;
}

window.onload = init;
async function init() {
  await loadTableData(currentPage);
  loadPagination(currentPage);
}

async function generateInteractionButtons(UPC) {
  let htmlContent = `<button class="btn btn-primary" data-upc="${UPC}"><i class="fa-solid fa-info"></i></button>`;

  if (userRole === 0) {
    htmlContent = htmlContent.concat(
      '<button class="btn btn-outline-success"><i class="fa-solid fa-basket-shopping"></i></button>',
    );
  }

  if (userRole === 1 || userRole === 2) {
    htmlContent = htmlContent.concat(
      '<button class="btn btn-warning" href="/"><i class="fa-solid fa-pen-to-square"></i></button>' +
        '<button class="btn btn-danger"><i class="fa-solid fa-trash"></i></button>',
    );
  }

  return htmlContent;
}

async function loadTableData(currentPage) {
  const response = await fetch(
    `/api/supplies/all?limit=${itemsPerPage}&page=${currentPage}`,
  );
  const data = await response.json();
  const tableBody = document.querySelector('#data-table tbody');
  const rowTemplate = document.querySelector('#row-template').content;

  tableBody.innerHTML = '';

  totalRowsAmount = data.amount;
  totalAmountSpan.innerText = data.amount;

  let counter = 0;
  data.rows.forEach((supply) => {
    let rowClone = rowTemplate.querySelector('tr').cloneNode(true);
    let rowColumns = rowClone.querySelectorAll('td');

    rowColumns[0].innerText = (currentPage - 1) * itemsPerPage + 1 + counter++;
    rowColumns[1].innerText = supply.UPC;
    rowColumns[2].innerText = supply.UPC_prom ? supply.UPC_prom : 'Відсутній';
    rowColumns[3].innerText = supply.product_id;
    rowColumns[4].innerText = supply.selling_price;
    rowColumns[5].innerText = supply.products_amount;
    rowColumns[6].innerText = supply.is_promotional ? 'Так' : 'Ні';
    generateInteractionButtons(supply.UPC).then((res) => {
      rowColumns[7].innerHTML = `<div class="actions-container">${res}</div>`;
    });

    tableBody.appendChild(rowClone);
  });
}

function loadPagination(currentPage) {

}

let addSupplyButton = document.querySelector('#addSupplyBtn');

addSupplyButton.onclick = function () {
  window.open('/supplies/add-supply', '_blank');
};

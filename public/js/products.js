const itemsPerPage = 5;
let currentPage = 1;
let userRole = 0;
let totalRowsAmount = 0;

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
}

async function generateInteractionButtons(product_id) {
  let htmlContent = `<button class="btn btn-primary" data-id="${product_id}" onclick="openProductInfo(this)"><i class="fa-solid fa-info"></i></button>`;

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
    `/api/products/all?limit=${itemsPerPage}&page=${currentPage}`,
  );
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
  data.rows.forEach((supply) => {
    let rowClone = rowTemplate.cloneNode(true);
    let rowColumns = rowClone.querySelectorAll('td');
    console.log(data);
    rowColumns[0].innerText = (currentPage - 1) * itemsPerPage + 1 + counter++;
    rowColumns[1].innerText = supply.product_id;
    rowColumns[2].innerText = supply.category_number;
    rowColumns[3].innerText = supply.product_name;
    rowColumns[4].innerText = supply.characteristics;
    generateInteractionButtons(supply.product_id).then((res) => {
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

const itemsPerPage = 7;
let currentPage = 1;
let userRole = 0;
let totalRowsAmount = 0;

//Selectors
const totalAmountElement = document.querySelector('#rows-amount');
const searchButton = document.querySelector('#search');

//Filter Selectors
const categoryIdInput = document.querySelector('#categoryId');
const textInput = document.querySelector('#searchByText');
const sortBySelect = document.querySelector('#sortBy');
const orderBySelect = document.querySelector('#orderBy');

//Filter values
let categoryIdValue = categoryIdInput.value;
let textValue = textInput.value;
let sortByValue = sortBySelect.value;
let orderByValue = orderBySelect.value;

searchButton.onclick = async function() {
  updateInputValues();
  currentPage = 1;

  await loadTableData(generateFetchURL(currentPage));
  await loadPagination(currentPage);
}

function generateFetchURL(currentPage) {
  return `/api/categories/search?limit=${itemsPerPage}&page=${currentPage}&id=${categoryIdValue}&text=${textValue}&&sortBy=${sortByValue}&order=${orderByValue}`;
}

function updateInputValues() {
  categoryIdValue = categoryIdInput.value;
  textValue = textInput.value;
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
  await loadTableData(generateFetchURL(currentPage));
  await loadPagination(currentPage);
  handlePrintButton();
}

async function generateInteractionButtons(category_number) {
  let htmlContent = `<button class="btn btn-primary" data-id="${category_number}" onclick="openCategoryInfo(this)"><i class="fas fa-info"></i></button>`;
  if (userRole === 1 || userRole === 2) {
    htmlContent = htmlContent.concat(
      `<button class="btn btn-warning" data-id="${category_number}" onclick="openEditCategory(this)"><i class="fa-solid fa-pen-to-square"></i></button>` +
        `<button class="btn btn-danger"><i class="fa-solid fa-trash"></i></button>`,
    );
  }

  return htmlContent;
}

async function loadTableData(fetchURL) {
  const response = await fetch(fetchURL);
  const data = await response.json();
  const tableBody = document.querySelector('#data-table tbody');
  const rowTemplate = document.createElement('tr');

  for (let i = 0; i < 4; i++) {
    const td = document.createElement('td');
    rowTemplate.appendChild(td);
  }
  tableBody.innerHTML = '';
  totalRowsAmount = data.amount;
  totalAmountElement.innerText = data.amount;

  let counter = 0;
  data.rows.forEach((category) => {
    let rowClone = rowTemplate.cloneNode(true);
    let rowColumns = rowClone.querySelectorAll('td');
    console.log(data);
    rowColumns[0].innerText = (currentPage - 1) * itemsPerPage + 1 + counter++;
    rowColumns[1].innerText = category.category_number;
    rowColumns[2].innerText = category.category_name;

    generateInteractionButtons(category.category_number).then((res) => {
      rowColumns[3].innerHTML = `<div class="actions-container">${res}</div>`;
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

let addCategoryButton = document.querySelector('#addCategoryBtn');

addCategoryButton.onclick = function () {
  window.open('/categories/add-category', '_blank');
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function openCategoryInfo(button) {
  let id = button.getAttribute('data-id');

  let newTab = window.open('/categories/about?id=' + id, '_blank');

  newTab.focus();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function openEditCategory(button) {
  let id = button.getAttribute('data-id');

  let newTab = window.open('/categories/edit-category?id=' + id, '_blank');

  newTab.focus();
}

function handlePrintButton() {
  let printButton = document.getElementById('print-button');
  printButton.onclick = function () {
    window.print();
  };
}

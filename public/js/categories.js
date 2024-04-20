const itemsPerPage = 1;
let currentPage = 1;
const totalAmount = document.querySelector('#rows-amount');
let userRole = 0;
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
  await loadTableData(currentPage);
  loadPagination(currentPage);
}

async function generateInteractionButtons(category_name) {
  let htmlContent = `<button class="btn btn-primary" href="/api/categories/find/${category_name}"><i class="fa-solid fa-info"></i></button>`;

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
    `/api/categories/all?limit=${itemsPerPage}&page=${currentPage}`,
  );
  const data = await response.json();
  const tableBody = document.querySelector('#data-table tbody');
  const rowTemplate = document.createElement('tr');
  for (let i = 0; i < 4; i++) {
    const td = document.createElement('td');
    rowTemplate.appendChild(td);
  }
  tableBody.innerHTML = '';
  totalAmount.innerText = data.amount;
  console.log(data);
  let counter = 0;
  data.rows.forEach((supply) => {
    let rowClone = rowTemplate.cloneNode(true);
    let rowColumns = rowClone.querySelectorAll('td');
    console.log(data);
    rowColumns[0].innerText = (currentPage - 1) * itemsPerPage + 1 + counter++;
    rowColumns[1].innerText = supply.category_number;
    rowColumns[2].innerText = supply.category_name;

    generateInteractionButtons(supply.category_name).then((res) => {
      rowColumns[3].innerHTML = res;
    });

    tableBody.appendChild(rowClone);
  });
}

async function loadPagination(currentPage) {
  const response = await fetch(
    `/api/categories/all?limit=${itemsPerPage}&page=${currentPage}`,
  );
  const data = await response.json();
  const totalAmount = data.amount;
  const totalPages = Math.ceil(totalAmount / itemsPerPage);

  const paginationContainer = document.querySelector('.pagination');
  paginationContainer.innerHTML = '';

  const previousPageButton = document.createElement('li');
  previousPageButton.classList.add('page-item');
  if (currentPage === 1) {
    previousPageButton.classList.add('disabled');
  }
  const previousPageLink = document.createElement('a');
  previousPageLink.classList.add('page-link');
  previousPageLink.innerText = 'Минула';
  previousPageLink.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadTableData(currentPage);
      loadPagination(currentPage);
    }
  });
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
    pageLink.href = `javascript:void(0);`;
    pageLink.addEventListener('click', () => {
      currentPage = i;
      loadTableData(currentPage);
      loadPagination(currentPage);
    });
    pageButton.appendChild(pageLink);
    paginationContainer.appendChild(pageButton);
  }

  const nextPageButton = document.createElement('li');
  nextPageButton.classList.add('page-item');
  if (currentPage === totalPages) {
    nextPageButton.classList.add('disabled');
  }
  const nextPageLink = document.createElement('a');
  nextPageLink.classList.add('page-link');
  nextPageLink.innerText = 'Наступна';
  nextPageLink.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      loadTableData(currentPage);
      loadPagination(currentPage);
    }
  });
  nextPageButton.appendChild(nextPageLink);
  paginationContainer.appendChild(nextPageButton);
}

const itemsPerPage = 7;
let currentPage = 1;
let userRole = 0;
let totalRowsAmount = 0;

//Selectors
const totalAmountElement = document.querySelector('#rows-amount');
const searchButton = document.querySelector('#search');

/// Roles Dictionary
let rolesDict = {};

//Filter Selectors
const employeeIdInput = document.querySelector('#employeeId');
const textInput = document.querySelector('#searchByText');
const employeeRoleInput = document.querySelector('#employeeRole');
const employeeCityInput = document.querySelector('#employeeCity');
const sortBySelect = document.querySelector('#sortBy');
const orderBySelect = document.querySelector('#orderBy');

//Filter values
let employeeIdValue = employeeIdInput.value;
let textValue = textInput.value;
let employeeRoleValue = employeeRoleInput.value;
let employeeCityValue = employeeCityInput.value;
let sortByValue = sortBySelect.value;
let orderByValue = orderBySelect.value;

searchButton.onclick = async function () {
  updateInputValues();
  currentPage = 1;

  await loadTableData(generateFetchURL(currentPage));
  loadPagination(currentPage);
};

function generateFetchURL(currentPage) {
  return `/api/employees/search?limit=${itemsPerPage}&page=${currentPage}&employeeId=${employeeIdValue}&text=${textValue}&employeeRole=${employeeRoleValue}&employeeCity=${employeeCityValue}&sortBy=${sortByValue}&order=${orderByValue}`;
}

function updateInputValues() {
  employeeIdValue = employeeIdInput.value;
  textValue = textInput.value;
  employeeRoleValue = employeeRoleInput.value;
  employeeCityValue = employeeCityInput.value;
  sortByValue = sortBySelect.value;
  orderByValue = orderBySelect.value;
}

getRoles().then((dict) => {
  rolesDict = dict;
});

fetchUserRole().then((role) => {
  userRole = role;
});

async function getRoles() {
  const response = await fetch('/api/allRoles');
  return await response.json();
}

async function fetchUserRole() {
  const response = await fetch('/api/user');
  const userData = await response.json();
  return userData.employee_role;
}

window.onload = init;
async function init() {
  await loadTableData(generateFetchURL(currentPage));
  loadPagination(currentPage);
  handlePrintButton();
}

async function generateInteractionButtons(employee_id) {
  let htmlContent = `<button class="btn btn-primary" data-id="${employee_id}" onclick="openEmployeeInfo(this)"><i class="fa-solid fa-info"></i></button>`;
  if (userRole === 1 || userRole === 2) {
    htmlContent = htmlContent.concat(
      `<button class="btn btn-warning" data-id="${employee_id}" onclick="openEditEmployee(this)"><i class="fa-solid fa-pen-to-square"></i></button>` +
        `<button class="btn btn-danger"><i class="fa-solid fa-trash"></i></button>`,
    );
  }

  return htmlContent;
}

async function loadTableData(fetchUrl) {
  const response = await fetch(fetchUrl);
  const data = await response.json();
  const tableBody = document.querySelector('#data-table tbody');
  const rowTemplate = document.createElement('tr');
  for (let i = 0; i < 10; i++) {
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
    rowColumns[0].innerText = (currentPage - 1) * itemsPerPage + 1 + counter++;
    rowColumns[1].innerText = supply.employee_id;
    rowColumns[2].innerText = supply.employee_surname;
    rowColumns[3].innerText = supply.employee_name;
    rowColumns[4].innerText = rolesDict[supply.employee_role];
    rowColumns[5].innerText = supply.employee_salary;
    rowColumns[6].innerText = formatDate(supply.employee_start_date);
    rowColumns[7].innerText = formatDate(supply.employee_birth_date);
    rowColumns[8].innerText = supply.employee_city;
    generateInteractionButtons(supply.employee_id).then((res) => {
      rowColumns[9].innerHTML = `<div class="actions-container">${res}</div>`;
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
      loadTableData(generateFetchURL(currentPage));
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
      loadTableData(generateFetchURL(currentPage));
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
      loadTableData(generateFetchURL(currentPage));
      loadPagination(currentPage);
    }
  };
  nextPageButton.appendChild(nextPageLink);
  paginationContainer.appendChild(nextPageButton);
}

let addEmployeeButton = document.querySelector('#addEmployeeBtn');

addEmployeeButton.onclick = function () {
  window.open('/employees/add-employee', '_blank');
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function openEmployeeInfo(button) {
  let id = button.getAttribute('data-id');

  let newTab = window.open('/profile?id=' + id, '_blank');

  newTab.focus();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function openEditEmployee(button) {
  let id = button.getAttribute('data-id');

  let newTab = window.open('/employees/edit-employee?id=' + id, '_blank');

  newTab.focus();
}

function formatDate(inputDate) {
  const date = new Date(inputDate);
  return date.toLocaleDateString('en-GB');
}

function handlePrintButton() {
  let printButton = document.getElementById('print-button');
  printButton.onclick = async function () {
    const response = await fetch(
      `/api/employees/search?employeeId=${employeeIdValue}&text=${textValue}&employeeRole=${employeeRoleValue}&employeeCity=${employeeCityValue}&sortBy=${sortByValue}&order=${orderByValue}`,
    );
    const data = await response.json();
    const tableBodyToPrint = document.getElementById('table-to-print');

    const rowTemplate = document.createElement('tr');
    for (let i = 0; i < 9; i++) {
      const td = document.createElement('td');
      rowTemplate.appendChild(td);
    }
    tableBodyToPrint.innerHTML = '';
    totalRowsAmount = data.amount;
    totalAmountElement.innerText = data.amount;

    let counter = 0;
    data.rows.forEach((employee) => {
      let rowClone = rowTemplate.cloneNode(true);
      let rowColumns = rowClone.querySelectorAll('td');
      rowColumns[0].innerText =
        (currentPage - 1) * itemsPerPage + 1 + counter++;
      rowColumns[1].innerText = employee.employee_id;
      rowColumns[2].innerText = employee.employee_surname;
      rowColumns[3].innerText = employee.employee_name;
      rowColumns[4].innerText = rolesDict[employee.employee_role];
      rowColumns[5].innerText = employee.employee_salary;
      rowColumns[6].innerText = formatDate(employee.employee_start_date);
      rowColumns[7].innerText = formatDate(employee.employee_birth_date);
      rowColumns[8].innerText = employee.employee_city;

      tableBodyToPrint.appendChild(rowClone);
    });
    data.rows.forEach((employee) => {
      let rowClone = rowTemplate.cloneNode(true);
      let rowColumns = rowClone.querySelectorAll('td');
      rowColumns[0].innerText =
        (currentPage - 1) * itemsPerPage + 1 + counter++;
      rowColumns[1].innerText = employee.employee_id;
      rowColumns[2].innerText = employee.employee_surname;
      rowColumns[3].innerText = employee.employee_name;
      rowColumns[4].innerText = rolesDict[employee.employee_role];
      rowColumns[5].innerText = employee.employee_salary;
      rowColumns[6].innerText = formatDate(employee.employee_start_date);
      rowColumns[7].innerText = formatDate(employee.employee_birth_date);
      rowColumns[8].innerText = employee.employee_city;

      tableBodyToPrint.appendChild(rowClone);
    });

    const table2BodyToPrint = document.getElementById('table-to-print-test');

    const row2Template = document.createElement('tr');
    for (let i = 0; i < 9; i++) {
      const td = document.createElement('td');
      row2Template.appendChild(td);
    }
    table2BodyToPrint.innerHTML = '';
    totalRowsAmount = data.amount;
    totalAmountElement.innerText = data.amount;

    data.rows.forEach((employee) => {
      let rowClone = row2Template.cloneNode(true);
      let rowColumns = rowClone.querySelectorAll('td');
      rowColumns[0].innerText =
        (currentPage - 1) * itemsPerPage + 1 + counter++;
      rowColumns[1].innerText = employee.employee_id;
      rowColumns[2].innerText = employee.employee_surname;
      rowColumns[3].innerText = employee.employee_name;
      rowColumns[4].innerText = rolesDict[employee.employee_role];
      rowColumns[5].innerText = employee.employee_salary;
      rowColumns[6].innerText = formatDate(employee.employee_start_date);
      rowColumns[7].innerText = formatDate(employee.employee_birth_date);
      rowColumns[8].innerText = employee.employee_city;

      table2BodyToPrint.appendChild(rowClone);
    });
    window.print();
  };
}

const itemsPerPage = 8;
let currentPage = 1;
let userRole = 0;
let totalRowsAmount = 0;

//Selectors
const totalAmountElement = document.querySelector('#rows-amount');
const searchButton = document.querySelector('#search');
const modalSelector = document.querySelector('#deleteClient');
const resultModal = new bootstrap.Modal(modalSelector);
const deleteClientBtnSelector = document.querySelector('#deleteClientBtn');

//Filter Selectors
const cardNumberInput = document.querySelector('#cardNumber');
const textInput = document.querySelector('#searchByText');
const sortBySelect = document.querySelector('#sortBy');
const orderBySelect = document.querySelector('#orderBy');

//Filter values
let cardNumberValue = cardNumberInput.value;
let textValue = encodeURIComponent(textInput.value);
let sortByValue = sortBySelect.value;
let orderByValue = orderBySelect.value;

searchButton.onclick = async function () {
  updateInputValues();
  currentPage = 1;

  await loadTableData(generateFetchURL(currentPage), currentPage);
  await loadPagination(currentPage);

};

function generateFetchURL(currentPage) {
  return `/api/clients/search?limit=${itemsPerPage}&page=${currentPage}&id=${cardNumberValue}&text=${textValue}&&sortBy=${sortByValue}&order=${orderByValue}`;
}

function updateInputValues() {
  cardNumberValue = cardNumberInput.value;
  textValue = encodeURIComponent(textInput.value);
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

async function generateInteractionButtons(card_number) {
  let htmlContent = `<button class="btn btn-primary" data-id="${card_number}" onclick="openCardInfo(this)"><i class="fa-solid fa-info"></i></button>`;

  if (userRole === 1 || userRole === 2) {
    htmlContent = htmlContent.concat(
      `<button class="btn btn-warning" data-id="${card_number}" onclick="openEditCard(this)"><i class="fa-solid fa-pen-to-square"></i></button>` +
        `<button class="btn btn-danger" data-id="${card_number}" onclick="openDeleteCard(this)"><i class="fa-solid fa-trash"></i></button>`,
    );
  }

  return htmlContent;
}

async function loadTableData(fetchURL, currentPage) {
  const response = await fetch(fetchURL);
  const data = await response.json();
  const tableBody = document.querySelector('#data-table tbody');
  const rowTemplate = document.createElement('tr');
  for (let i = 0; i < 8; i++) {
    const td = document.createElement('td');
    rowTemplate.appendChild(td);
  }
  tableBody.innerHTML = '';
  totalRowsAmount = data.amount;
  totalAmountElement.innerText = data.amount;

  let counter = 0;
  data.rows.forEach((client) => {
    let rowClone = rowTemplate.cloneNode(true);
    let rowColumns = rowClone.querySelectorAll('td');
    console.log(data);
    rowColumns[0].innerText = (currentPage - 1) * itemsPerPage + 1 + counter++;
    rowColumns[1].innerText = client.card_number;
    rowColumns[2].innerText = client.customer_surname;
    rowColumns[3].innerText = client.customer_name;
    rowColumns[4].innerText = client.customer_phone_number;
    rowColumns[5].innerText = client.customer_city;
    rowColumns[6].innerText = client.customer_percent;

    generateInteractionButtons(client.card_number).then((res) => {
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

let addClientButton = document.querySelector('#addClientBtn');

addClientButton.onclick = function () {
  window.open('/clients/add-client', '_blank');
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function openCardInfo(button) {
  let id = button.getAttribute('data-id');

  let newTab = window.open('/clients/about?id=' + id, '_blank');

  newTab.focus();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function openEditCard(button) {
  let id = button.getAttribute('data-id');

  let newTab = window.open('/clients/edit-client?id=' + id, '_blank');

  newTab.focus();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function openDeleteCard(button) {
  let id = button.getAttribute('data-id');
  resultModal.hide();
  resultModal.show();

  // Видалення категорії при підтвердженні
  deleteClientBtnSelector.onclick = () => {
    fetch(`/delete-client/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          console.log(`Клієнта з ID ${id} успішно видалено`);
        } else {
          console.error(`Помилка при видаленні клієнта з ID ${id}`);
        }
      })
      .catch((error) => {
        console.error('Помилка при виконанні запиту:', error);
      })
      .finally(() => {
        resultModal.hide();
      });
  };
}

function handlePrintButton() {
  let printButton = document.getElementById('print-button');
  printButton.onclick = async function () {
    const response = await fetch(
      `/api/clients/search?id=${cardNumberValue}&text=${textValue}&&sortBy=${sortByValue}&order=${orderByValue}`,
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
    data.rows.forEach((client) => {
      let rowClone = rowTemplate.cloneNode(true);
      let rowColumns = rowClone.querySelectorAll('td');
      rowColumns[0].innerText =
        (currentPage - 1) * itemsPerPage + 1 + counter++;
      rowColumns[1].innerText = client.card_number;
      rowColumns[2].innerText = client.customer_surname;
      rowColumns[3].innerText = client.customer_name;
      rowColumns[4].innerText = client.customer_patronymic;
      rowColumns[5].innerText = client.customer_phone_number;
      rowColumns[6].innerText = client.customer_city;
      rowColumns[7].innerText = client.customer_street;
      rowColumns[8].innerText = client.customer_zip_code;
      rowColumns[9].innerText = client.customer_percent;
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
  };
}

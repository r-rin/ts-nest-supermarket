todayDate = new Date();

window.onload = init;

function init() {
  handleSearchButtonSearchSumCertainCashier();
  handleSearchButtonGetTotalUnitsSoldForProductInPeriod();
  handleSearchButtonGoodsOfEachCategoryInReceipt();
  handleSearchButtonGetTotalSalesPerCategoryForPeriod();
  getSalesCountPerItemPerEmployee();

}

function handleSearchButtonSearchSumCertainCashier() {
  let searchForm = document.getElementById('searchSumCertainCashier');
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    getTotalSumOfGoodsFromReceipts(searchForm);
  });
}

function getTotalSumOfGoodsFromReceipts(searchForm) {
  const formData = new FormData(searchForm);
  const formDataObj = {};
  formData.forEach((value, key) => {
    if (typeof value == 'string') value = value.trim();
    formDataObj[key] = value;
  });
  let cashierId = document.getElementById('cashier').value;
  const fetchURL = generateFetchURLForSearchButtonSearchSumCertainCashier(
    formDataObj.date_start,
    formDataObj.date_end,
    cashierId,
  );

  fetch(fetchURL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let resSumSpan = document.getElementById('sumAfterSearch');
      resSumSpan.innerText = String(data) + ' грн.';
    })
    .catch((error) => {
      // Обробка помилки
      console.error('Error:', error);
    });
}

function generateFetchURLForSearchButtonSearchSumCertainCashier(
  startDate,
  endDate,
  cashierId,
) {
  const baseUrl = 'api/statistics/total-amount-by-cashier-and-date-range';
  return `${baseUrl}?startDate=${startDate}&endDate=${endDate}&cashierId=${cashierId}`;
}

function handleSearchButtonGetTotalUnitsSoldForProductInPeriod() {
  let searchForm = document.getElementById('searchSumCertainProduct');
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    getTotalUnitsSoldForProductInPeriod(searchForm);
  });
}
function getTotalUnitsSoldForProductInPeriod(searchForm) {
  const formData = new FormData(searchForm);
  const formDataObj = {};
  formData.forEach((value, key) => {
    if (typeof value == 'string') value = value.trim();
    formDataObj[key] = value;
  });
  console.log(formDataObj);
  const fetchURL = `api/statistics/total-units-sold-for-product-in-period?startDate=${formDataObj.date_start}&endDate=${formDataObj.date_end}&productID=${formDataObj.supply}`;

  fetch(fetchURL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let resSumSpan = document.getElementById('numberAfterSearch');
      resSumSpan.innerText = data[0].total_units_sold;
    })
    .catch((error) => {
      // Обробка помилки
      console.error('Error:', error);
    });

}


function handleSearchButtonGoodsOfEachCategoryInReceipt() {
  let searchForm = document.getElementById('goodsOfEachCategoryInReceipt');
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    getGoodsOfEachCategoryInReceipt();
  });
}

function getGoodsOfEachCategoryInReceipt() {
  let receiptId = document.getElementById('receipt').value;
  const fetchURL = `api/statistics/the-amount-of-goods-of-each-category-in-a-specific-check?receiptNum=${receiptId}`;

  fetch(fetchURL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      renderTableGoodsOfEachCategoryInReceipt(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
function renderTableGoodsOfEachCategoryInReceipt(data) {
  let tableBody = document.getElementById('body-category-receipt');
  const rowTemplate = document.createElement('tr');
  for (let i = 0; i < 4; i++) {
    const td = document.createElement('td');
    rowTemplate.appendChild(td);
  }
  tableBody.innerHTML = '';
  let counter = 0;
  data.forEach((receipt) => {
    let rowClone = rowTemplate.cloneNode(true);
    let rowColumns = rowClone.querySelectorAll('td');
    rowColumns[0].innerText = 1 + counter++;
    rowColumns[1].innerText = receipt.receipt_id;
    rowColumns[2].innerText = receipt.category_name;
    rowColumns[3].innerText = receipt.TotalProducts;

    tableBody.appendChild(rowClone);
  });
}

function handleSearchButtonGetTotalSalesPerCategoryForPeriod() {
  let searchForm = document.getElementById('salesAmountOfEachCategory');
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    getTotalSalesPerCategoryForPeriod(searchForm);
  });
}

function getTotalSalesPerCategoryForPeriod(searchForm) {
  const formData = new FormData(searchForm);
  const formDataObj = {};
  formData.forEach((value, key) => {
    if (typeof value == 'string') value = value.trim();
    formDataObj[key] = value;
  });
  console.log(formDataObj);
  const fetchURL = `api/statistics/total-sales-per-category-for-period?startDate=${formDataObj.date_start}&endDate=${formDataObj.date_end}`;

  fetch(fetchURL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      renderTableTotalSalesPerCategoryForPeriod(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function renderTableTotalSalesPerCategoryForPeriod(data) {
  let tableBody = document.getElementById('bodySalesAmountOfEachCategory');
  const rowTemplate = document.createElement('tr');
  for (let i = 0; i < 3; i++) {
    const td = document.createElement('td');
    rowTemplate.appendChild(td);
  }
  tableBody.innerHTML = '';
  let counter = 0;
  data.forEach((obj) => {
    let rowClone = rowTemplate.cloneNode(true);
    let rowColumns = rowClone.querySelectorAll('td');
    rowColumns[0].innerText = 1 + counter++;
    rowColumns[1].innerText = obj.category_name;
    rowColumns[2].innerText = obj.TotalSales;

    tableBody.appendChild(rowClone);
  });
}

function getSalesCountPerItemPerEmployee(){
  fetch('api/statistics/sales-count-per-item-per-employee')
    .then((response) => response.json())
    .then((data) => {
      renderTableTotalSalesPerCategoryForPeriod(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function renderTableTotalSalesPerCategoryForPeriod(data) {
  let tableBody = document.getElementById('bodySalesPerCategoryForPeriod');
  const rowTemplate = document.createElement('tr');
  for (let i = 0; i < 6; i++) {
    const td = document.createElement('td');
    rowTemplate.appendChild(td);
  }
  tableBody.innerHTML = '';
  let counter = 0;
  data.forEach((obj) => {
    let rowClone = rowTemplate.cloneNode(true);
    let rowColumns = rowClone.querySelectorAll('td');
    rowColumns[0].innerText = 1 + counter++;
    rowColumns[1].innerText = obj.employee_id;
    rowColumns[2].innerText = obj.employee_surname;
    rowColumns[3].innerText = obj.employee_name;
    rowColumns[4].innerText = obj.product_name;
    rowColumns[5].innerText = obj.TotalSalesCount;
    tableBody.appendChild(rowClone);
  });
}

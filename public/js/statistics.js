todayDate = new Date();

window.onload = init;

function init() {
  handleSearchButtonSearchSumCertainCashier();
  handleSearchButtonGoodsOfEachCategoryInReceipt();
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
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

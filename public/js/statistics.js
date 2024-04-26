todayDate = new Date();

window.onload = init;

function init() {
  handleSearchButton();
}

function handleSearchButton() {
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
  const fetchURL = generateFetchURL(
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

function generateFetchURL(startDate, endDate, cashierId) {
  const baseUrl = 'api/statistics/total-amount-by-cashier-and-date-range';
  return `${baseUrl}?startDate=${startDate}&endDate=${endDate}&cashierId=${cashierId}`;
}

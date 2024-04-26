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
  console.log(formDataObj);
  console.log(formDataObj.date_end);
  console.log(formDataObj.date_start);
  let cashierId = document.getElementById('cashier').value;

  let res = {};

  const fetchURL = generateFetchURL(formDataObj.date_end, formDataObj.date_start, cashierId);

  // Виконуємо запит fetch і передаємо URL
  fetch(fetchURL)
    .then(response => response.json())
    .then(data => {
      // Обробка отриманих даних
      console.log(data);
      res = data;
    })
    .catch(error => {
      // Обробка помилки
      console.error('Error:', error);
    });
  let resSumSpan = document.getElementById('sumAfterSearch').value;
  resSumSpan.value = res.value;
}

function generateFetchURL(startDate, endDate, cashierId) {
  // Формуємо URL для виконання запиту на сервер
  const baseUrl = 'api/statistics/total-amount-by-cashier-and-date-range';
  const url = `${baseUrl}?startDate=${startDate}&endDate=${endDate}&cashierId=${cashierId}`;
  return url;
}

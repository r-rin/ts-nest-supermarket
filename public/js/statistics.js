window.onload = init;
function init() {
  handleSearchButton();
}

function handleSearchButton() {
  let searchButton = document.getElementById('searchButton');
  searchButton.onclick = totalSumOfGoodsFromReceipts();
}
function totalSumOfGoodsFromReceipts() {

}
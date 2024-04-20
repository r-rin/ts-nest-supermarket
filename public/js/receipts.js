let addReceiptButton = document.querySelector('#addReceiptBtn');

addReceiptButton.onclick = function () {
  window.open('/receipts/add-receipt', '_blank');
};

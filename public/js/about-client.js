function handlePrintButton() {
  let printButton = document.getElementById('print-button');
  printButton.onclick = function () {
    window.print();
  };
}
window.onload = handlePrintButton;

let printButton = document.getElementById('print-button');
printButton.addEventListener.onclick = function () {
  let content = document.getElementById('content-to-print').innerHTML;
  let printWindow = window.open('', '_blank');
  printWindow.document.open();
  printWindow.document.write(
    '<html><head><title>Print</title></head><body>' +
      content +
      '</body></html>',
  );
  printWindow.document.close();
  printWindow.print();
};

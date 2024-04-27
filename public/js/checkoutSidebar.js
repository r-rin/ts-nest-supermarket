if (localStorage.getItem('checkout') == null) {
  localStorage.setItem('checkout', JSON.stringify({}));
}
//SELECTORS
let checkoutSidebar = document.querySelector("#checkoutSidebar");
let checkoutItemTemplate = document.querySelector('#checkoutItemTemplate');
let checkoutBody = document.querySelector("#checkoutBody")
let closeCheckout = document.querySelector("#closeCheckout");

closeCheckout.onclick = () => {
  checkoutSidebar.style.transform = "translateX(350px)";
}

function increaseItemAmount(button) {
  let upc = button.parentNode.parentNode.parentNode.getAttribute('upc');
  let checkoutObj = JSON.parse(localStorage.getItem('checkout'));
  checkoutObj[upc] += 1;
  localStorage.setItem('checkout', JSON.stringify(checkoutObj));

  loadCheckoutItems().then(r => {});
}

function decreaseItemAmount(button) {
  let upc = button.parentNode.parentNode.parentNode.getAttribute('upc');
  let checkoutObj = JSON.parse(localStorage.getItem('checkout'));
  if (checkoutObj[upc] < 2) {
    delete checkoutObj[upc];
  } else {
    checkoutObj[upc] -= 1;
  }
  localStorage.setItem('checkout', JSON.stringify(checkoutObj));

  loadCheckoutItems().then(r => {});
}

function removeCheckoutItem(button) {
  let upc = button.parentNode.parentNode.parentNode.getAttribute('upc');
  let checkoutObj = JSON.parse(localStorage.getItem('checkout'));
  delete checkoutObj[upc];
  localStorage.setItem('checkout', JSON.stringify(checkoutObj));

  loadCheckoutItems().then(r => {});
}

async function loadCheckoutItems() {
  checkoutBody.innerHTML = '';
  let checkoutObj = JSON.parse(localStorage.getItem('checkout'));
  let totalSum = 0;
  for (const [key, value] of Object.entries(checkoutObj)) {
    var clonedItem = checkoutItemTemplate.content.querySelector('.checkoutItem').cloneNode(true);
    let fetchUPCInfo = await fetch(`/api/supplies/find/${key}`)
    let UPCObj = await fetchUPCInfo.json();

    if (!UPCObj) {
      delete checkoutObj[key];
      continue;
    }

    clonedItem.setAttribute('upc', key);
    clonedItem.querySelector('.checkoutProductName').innerText = UPCObj.product_name;
    clonedItem.querySelector('.checkoutProductId').innerText = `(${UPCObj.product_id})`;
    clonedItem.querySelector('.productQuantity').innerText = `x${value}`;
    clonedItem.querySelector('.pricePerItem').innerText = `${Number(UPCObj.selling_price).toFixed(2)} грн.`;
    clonedItem.querySelector('.checkoutMultiplyResult').innerText = `${Number(UPCObj.selling_price * value).toFixed(2)} грн.`;
    totalSum += UPCObj.selling_price * value;
    clonedItem.querySelector('.checkoutItemUPC').innerText = `(UPC: ${UPCObj.UPC})`;

    checkoutBody.appendChild(clonedItem);
  }

  document.querySelector('#checkOutSum').textContent = Number(totalSum).toFixed(2);
  localStorage.setItem('checkout', JSON.stringify(checkoutObj));
}

function openCreateReceipt() {
  let newTab = window.open('/receipts/create-receipt', '_blank');
  newTab.focus();
}
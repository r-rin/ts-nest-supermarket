const formSelector = document.querySelector('#editSupplyForm');
const modalSelector = document.querySelector('#infoModal');
const resultModal = new bootstrap.Modal(modalSelector);
const modalTitleSelector = document.querySelector('#infoModalTitle');
const modalBodySelector = document.querySelector('#infoModalBody');

function sendForm() {
  resultModal.hide();

  const formData = new FormData(formSelector);
  const formDataObj = {};

  formData.forEach((value, key) => {
    formDataObj[key] = value;
  });

  fetch(`/api/supplies/edit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formDataObj),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((errorData) => {
          errorData.message.forEach((string) => {
            return string.toLowerCase();
          });
          return {
            success: false,
            title: 'Виникла помилка',
            description: errorData.message.toString(),
          };
        });
      }
      return res.json();
    })
    .then((response) => {
      modalTitleSelector.textContent = response.title;
      modalBodySelector.textContent = response.description;
      resultModal.show();
    });
}
formSelector.addEventListener('submit', (event) => {
  event.preventDefault();
  sendForm();
});

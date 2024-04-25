const formSelector = document.querySelector("#addEmployeeForm");
const modalSelector = document.querySelector("#form-result");
const resultModal = new bootstrap.Modal(modalSelector)
const modalTitleSelector = document.querySelector("#form-result-title");
const modalBodySelector = document.querySelector("#form-result-body");


function sendForm() {
  resultModal.hide();
  const formData = new FormData(formSelector);
  const formDataObj = {};
  formData.forEach((value, key) => {
    formDataObj[key] = value;
  });

  formDataObj.employee_id = formDataObj.employee_id.padEnd(10, '0');
  document.querySelector("#employeeId").value = formDataObj.employee_id;

  fetch('/api/employees/add', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formDataObj)
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((errorData) => {
          errorData.message.forEach((string) => {
            return string.toLowerCase();
          })
          return { success: false, title: "Виникла помилка!", description: errorData.message.toString() };
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
})


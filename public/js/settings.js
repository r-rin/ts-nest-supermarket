const formSelector = document.querySelector('#changePassword');
const passwordInputSelector = document.getElementById('newPassword');

const modalSelector = document.querySelector('#infoModal');
const resultModal = new bootstrap.Modal(modalSelector);
const modalTitleSelector = document.querySelector('#infoModalTitle');
const modalBodySelector = document.querySelector('#infoModalBody');

formSelector.addEventListener('submit', async (event) => {
  event.preventDefault();
  await changePassword(passwordInputSelector.value);
})

async function changePassword(passwordToChange) {
  const updatePasswordDto = {
    newPassword: passwordToChange,
  };

  fetch(`/update-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatePasswordDto),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((errorData) => {
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

window.onload = init;

function init() {
  handleNewPasswordButton();
}

function handleNewPasswordButton() {
  let passwordButton = document.getElementById('changePasswordButton');
  passwordButton.addEventListener('click', () => {
    let passwordInput = document.getElementById('newPassword').value;
    changePassword(passwordInput);
  });
}

async function changePassword(passwordToChange) {
  const updatePasswordDto = {
    newPassword: passwordToChange,
  };

  try {
    const response = await fetch('/update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatePasswordDto),
    });

    if (!response.ok) {
      throw new Error('Failed to update password');
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

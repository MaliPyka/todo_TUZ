function login() {
    const passwordField = document.getElementById('passwordInput');
    const loginField = document.getElementById('loginInput');
    const loginBtn = document.getElementById('btnLogin');
    const errorBlock = document.getElementById('error-message');


    const showError = (text) => {
            errorBlock.innerText = text;
            errorBlock.style.display = 'block';
        }
    const hideError = () => {
        if (errorBlock) errorBlock.style.display = 'none';
    };

    loginBtn.onclick = async (event) => {
        event.preventDefault();
        hideError();

        const userData = {
            login: loginField.value,
            password: passwordField.value
        }

        const response = await fetch('/users/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userData)
        });

        const result = await response.json()
        console.log(result);

        if (result.status == 'ok') {
            errorBlock.classList.add('success');
            showError("Успешный вход");
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        } else {
            errorBlock.classList.remove('success');
            showError(result.Message);
        }
    }
}

document.addEventListener('DOMContentLoaded', login);
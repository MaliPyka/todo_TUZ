function registration() {
    const loginField = document.getElementById('loginInput');
    const passwordField = document.getElementById('passwordInput');
    const repeatField = document.getElementById('repeatPasswordInput');
    const btnRegistration = document.getElementById('btnRegistration');
    const errorBlock = document.getElementById('error-message');

    const showError = (text) => {
        if (errorBlock) {
            errorBlock.innerText = text;
            errorBlock.style.display = 'block';
        } else {
            console.error("Ошибка:", text);
            alert(text);
        }
    };

    const hideError = () => {
        if (errorBlock) {
            errorBlock.style.display = 'none';
            errorBlock.classList.remove('success');
        }
    };

    if (!btnRegistration) return;

    btnRegistration.onclick = async (event) => {
        event.preventDefault();
        hideError();

        const login = loginField.value.trim();
        const password = passwordField.value;
        const repeat = repeatField.value;


        if (!login || !password) return showError("Заполните все поля!");
        if (login.length < 3) return showError("Логин не меньше 3 символов!");
        if (password.length < 6) return showError("Пароль не меньше 6 символов!");
        if (password !== repeat) return showError("Пароли не совпадают!");

        try {
            const response = await fetch('/users/registration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login, password })
            });

            const result = await response.json();
            console.log(result);

            if (response.ok) {
                errorBlock.classList.add('success');
                showError("Успешная регистрация!");
                setTimeout(() => window.location.href = "/login", 1000);
            } else {
                errorBlock.classList.remove('success');
                showError(result.detail);
            }
        } catch (error) {
            showError("Не удалось соединиться с сервером");
        }
    };
}

document.addEventListener('DOMContentLoaded', registration);
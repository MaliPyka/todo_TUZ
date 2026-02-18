function registration() {
    // Находим все элементы
    const loginField = document.getElementById('loginInput');
    const passwordField = document.getElementById('passwordInput');
    const repeatField = document.getElementById('repeatPasswordInput');
    const btnRegistration = document.getElementById('btnRegistration');
    const errorBlock = document.getElementById('error-message');


    const showError = (text) => {
        if (errorBlock) {
            errorBlock.innerText = text;
            errorBlock.style.display = 'block';
        } else
            console.error("Ошибка:", text);
            alert(text);
        }
    };


    const hideError = () => {
        if (errorBlock) errorBlock.style.display = 'none';
    };


    if (!btnRegistration) {
        console.error("КРИТИЧЕСКАЯ ОШИБКА: Кнопка с id='btnRegistration' не найдена!");
        return;
    }

    btnRegistration.onclick = async (event) => {
        // Сразу блокируем перезагрузку страницы
        event.preventDefault();
        hideError();

        // Проверяем пустые поля
        if (!loginField.value || !passwordField.value) {
            showError("Заполните все поля!");
            return;
        }

        // Проверяем совпадение паролей
        if (passwordField.value !== repeatField.value) {
            showError("Пароли не совпадают!");
            return;
        }

        const password = passwordField.value;
        const checkLogin = loginField.value;

        if (password.length < 6) {
            showError("Пароль должен быть больше 6 символов!");
            return;
        }

        if (checkLogin.length < 3) {
            showError("Логин не может быть меньше 3 символов!");
            return;
        }

        // Собираем данные
        const userData = {
            login: loginField.value,
            password: passwordField.value
        };

        console.log("Отправка данных:", userData);

        try {
            const response = await fetch('/users/registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (response.ok) {
                errorBlock.classList.add('success');
                showError("Успешная регистрация!");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 1000);
            } else {
                errorBlock.classList.remove('success');
                const result = await response.json();
                showError(result.detail || "Ошибка при регистрации");
            }

        } catch (error) {
            console.error("Ошибка fetch:", error);
            showError("Не удалось соединиться с сервером");
        }
    };
}


document.addEventListener('DOMContentLoaded', registration);
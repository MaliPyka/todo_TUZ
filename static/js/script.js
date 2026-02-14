// Функция для отрисовки задачи в списке
function renderTask(text, id) {
    const list = document.getElementById('taskList');
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-item';
    taskDiv.dataset.id = id;

    taskDiv.innerHTML = `
        <input type="checkbox" class="task-checkbox">
        <span class="task-text">${text}</span>
        <button class="task-delete">⛔</button>
    `;

    // Удаление пока только с экрана (для удаления из БД нужен DELETE запрос)
    taskDiv.querySelector('.task-delete').onclick = () => taskDiv.remove();

    const checkbox = taskDiv.querySelector('.task-checkbox');
    const taskText = taskDiv.querySelector('.task-text');
    checkbox.onchange = () => {
        taskText.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
        taskText.style.color = checkbox.checked ? 'gray' : 'black';
    };

    list.prepend(taskDiv);
}

// Добавление задачи
async function addTask() {
    const input = document.getElementById('taskInput');
    const taskValue = input.value.trim();

    if (!taskValue) return;

    try {
        // ОБЯЗАТЕЛЬНО начинаем путь со слэша /
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: taskValue }) // text совпадает с твоей схемой
        });

        if (response.ok) {
            // Твой сервер возвращает {"message": "Task Created"}, ID там нет
            renderTask(taskValue, null);
            input.value = "";
        } else {
            const err = await response.json();
            console.error("Ошибка валидации (422):", err);
        }
    } catch (e) {
        console.error("Сервер выключен или ошибка сети", e);
    }
}

// Загрузка задач при старте
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/tasks');
        if (response.ok) {
            const tasks = await response.json();
            // Очищаем список перед загрузкой, чтобы не дублировать
            document.getElementById('taskList').innerHTML = '';
            tasks.forEach(task => {
                // Предполагаем, что из базы приходят объекты {text: "...", id: ...}
                renderTask(task.text, task.id);
            });
        }
    } catch (e) {
        console.error("Не удалось загрузить задачи");
    }
});
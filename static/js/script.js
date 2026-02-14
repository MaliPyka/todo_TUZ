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

    const deleteBtn = taskDiv.querySelector('.task-delete');

    // Делаем функцию удаления асинхронной
    deleteBtn.onclick = async () => {
        if (!id) {
            taskDiv.remove();
            return;
        }

        const response = await fetch(`/tasks/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            //удаляет задачу с экрана
            taskDiv.remove();
        } else {
            alert("Ошибка при удалении из базы");
        }
    };

    list.prepend(taskDiv);
}


async function addTask() {
    const input = document.getElementById('taskInput');
    const title = input.value.trim(); // веденный текст

    if (title === "") return;

    try {
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: title })
        });

        if (response.ok) {
            const result = await response.json();
            renderTask(title, result.id);
            input.value = "";
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

// Загрузка задач при старте
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/tasks');
        if (response.ok) {
            const tasks = await response.json();
            document.getElementById('taskList').innerHTML = '';
            tasks.forEach(task => {
                renderTask(task.text, task.id);
            });
        }
    } catch (e) {
        console.error("Не удалось загрузить задачи");
    }


});
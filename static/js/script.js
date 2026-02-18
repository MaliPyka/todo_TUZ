// Функция для отрисовки задачи в списке
function renderTask(text, id, is_completed) {
    const list = document.getElementById('taskList');
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-item';
    taskDiv.dataset.id = id;

    taskDiv.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${is_completed ? 'checked' : ''}>
        <span class="task-text ${is_completed ? 'strikethrough' : ''}">${text}</span>
        <button class="task-delete">⛔</button>
    `;

    const deleteBtn = taskDiv.querySelector('.task-delete');
    const checkboxBtn = taskDiv.querySelector('.task-checkbox');
    const textSpan = taskDiv.querySelector('.task-text');

    if (is_completed) {
        textSpan.style.textDecoration = 'line-through';
        textSpan.style.color = 'gray';
    }

    checkboxBtn.addEventListener('change',async function(){
        textSpan.style.textDecoration = this.checked ? 'line-through' : 'none';
        textSpan.style.color = this.checked ? 'gray' : 'black';

        const response = await fetch(`/tasks/${id}/status?status=${this.checked}`, {
            method: "PATCH"
        });

        if (!response.ok) {
            alert("Не удалось изменить статус!")
        }
    });
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
                renderTask(task.text, task.id, task.is_completed);
            });
        }
    } catch (e) {
        console.error("Не удалось загрузить задачи");
    }

});
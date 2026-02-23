// Функция для отрисовки задачи в списке
function renderTask(text, id, is_completed, tagName = null) {
    const list = document.getElementById('taskList');
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-item';
    taskDiv.dataset.id = id;

    // ВНИМАНИЕ: Я удалил отсюда setAttribute('draggable', true)

    taskDiv.innerHTML = `
        <div class="drag-handle">⠿</div>
        
        <input type="checkbox" class="task-checkbox" ${is_completed ? 'checked' : ''}>

        <div class="task-content">
            <span class="task-text ${is_completed ? 'strikethrough' : ''}">${text}</span>
        </div>

        <div class="tag-container">
            <span class="task-tag-container"></span>
            <button class="tag-menu-btn">🔖</button>
            <div class="tag-dropdown">
                <div class="tag-list"></div>
                <hr>
                <div class="add-tag-wrapper">
                    <button class="add-tag-btn">+ Создать тег</button>
                    <input type="text" class="tag-input-field" placeholder="Название тега...">
                </div>
            </div>
        </div>

        <button class="task-delete">⛔</button>
    `;

    const deleteBtn = taskDiv.querySelector('.task-delete');
    const checkboxBtn = taskDiv.querySelector('.task-checkbox');
    const textSpan = taskDiv.querySelector('.task-text');
    const tagBtn = taskDiv.querySelector('.tag-menu-btn');
    const tagDropdown = taskDiv.querySelector('.tag-dropdown');
    const addTagBtn = taskDiv.querySelector('.add-tag-btn');
    const tagInput = taskDiv.querySelector('.tag-input-field');
    const tagContainer = taskDiv.querySelector('.task-tag-container');

    if (is_completed) {
        textSpan.style.textDecoration = 'line-through';
        textSpan.style.color = 'gray';
    }

    checkboxBtn.addEventListener('change', async function() {
        textSpan.style.textDecoration = this.checked ? 'line-through' : 'none';
        textSpan.style.color = this.checked ? 'gray' : 'black';

        const response = await fetch(`/tasks/${id}/status?status=${this.checked}`, {
            method: "PATCH"
        });

        if (!response.ok) {
            alert("Не удалось изменить статус!")
        }
    });

    tagBtn.onclick = async (e) => {
        e.stopPropagation();
        const isActive = tagDropdown.classList.contains('active');
        document.querySelectorAll('.tag-dropdown.active').forEach(d => d.classList.remove('active'));

        if (!isActive) {
            tagDropdown.classList.add('active');
            await loadTagsForMenu(tagDropdown.querySelector('.tag-list'), id, tagContainer, tagDropdown);
        }
    };

    addTagBtn.onclick = (e) => {
        e.stopPropagation();
        addTagBtn.style.display = 'none';
        tagInput.classList.add('active');
        tagInput.focus();
    };

    tagInput.onkeydown = async (e) => {
        if (e.key === 'Enter') {
            const name = tagInput.value.trim();
            if (name) {
                const response = await fetch('/tasks/tags/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tag_name: name, task_id: 0 })
                });

                if (response.ok) {
                    tagInput.value = '';
                    tagInput.classList.remove('active');
                    addTagBtn.style.display = 'block';
                    await loadTagsForMenu(tagDropdown.querySelector('.tag-list'), id, tagContainer, tagDropdown);
                }
            }
        }
    };

    tagInput.onblur = () => {
        if (!tagInput.value) {
            tagInput.classList.remove('active');
            addTagBtn.style.display = 'block';
        }
    };

    deleteBtn.onclick = async () => {
        if (!id) {
            taskDiv.remove();
            return;
        }
        const response = await fetch(`/tasks/${id}`, { method: 'DELETE' });
        if (response.ok) taskDiv.remove();
    };

    if (tagName !== "none" && tagName !== "null" && tagName !== null) {
        tagContainer.innerHTML = `<span class="task-tag-badge">${tagName}</span>`;
    }

    // ВНИМАНИЕ: Я удалил отсюда все старые обработчики (dragstart, dragend, dragover)!
    // Теперь всем управляет библиотека.

    list.prepend(taskDiv);
}

// ВНИМАНИЕ: Я удалил функцию getDragAfterElement, она больше не нужна

async function loadTagsForMenu(container, taskId, badgeElement, dropdownElement) {
    container.innerHTML = '<div style="font-size: 0.8rem; padding: 5px;">Загрузка...</div>';

    try {
        const response = await fetch('/tasks/tags');
        const tags = await response.json();

        container.innerHTML = '';

        tags.forEach((tag, index) => {
            const item = document.createElement('div');
            item.className = 'tag-item';
            item.style.transitionDelay = `${index * 0.05}s`;
            item.innerHTML = `
                <div class="tag-item-left" style="display: flex; align-items: center;">
                    <span class="tag-color-circle"></span>
                    <span class="tag-name">${tag.tag_name}</span>
                </div>
                <span class="delete-tag-icon">×</span>
            `;

            item.onclick = async (e) => {
                e.stopPropagation();
                const response = await fetch('/tasks/tags/update', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tag_name: tag.tag_name, task_id: taskId })
                });

                if (response.ok) {
                    badgeElement.innerHTML = `<span class="task-tag-badge">${tag.tag_name}</span>`;
                    dropdownElement.classList.remove('active');
                }
            };

            const deleteIcon = item.querySelector('.delete-tag-icon');
            deleteIcon.onclick = async (e) => {
                e.stopPropagation();

                const delResponse = await fetch(`/tasks/tags/delete/${tag.id}`, {
                    method: 'DELETE'
                });

                if (delResponse.ok) {
                    item.remove();

                    document.querySelectorAll('.task-tag-badge').forEach(badge => {
                        if (badge.textContent === tag.tag_name) {
                            badge.remove();
                        }
                    });

                    if (badgeElement.textContent === tag.tag_name) {
                        badgeElement.innerHTML = '';
                    }
                }
            };

            container.appendChild(item);
        });

        if (tags.length === 0) {
            container.innerHTML = '<div style="font-size: 0.8rem; padding: 5px; color: gray;">Тегов пока нет</div>';
        }

    } catch (e) {
        console.error("Ошибка загрузки тегов:", e);
        container.innerHTML = '<div style="color: red; padding: 5px;">Ошибка загрузки</div>';
    }
}

document.addEventListener('click', () => {
    document.querySelectorAll('.tag-dropdown.active').forEach(d => d.classList.remove('active'));
});

async function addTask() {
    const input = document.getElementById('taskInput');
    const title = input.value.trim();
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
        } else if (response.status === 401) {
            window.location.href = "/login";
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
                renderTask(task.text, task.id, task.is_completed, task.tag);
            });
        }
    } catch (e) {
        console.error("Не удалось загрузить задачи");
    }
});

// Инициализация библиотеки SortableJS
document.addEventListener('DOMContentLoaded', function() {
    const taskList = document.getElementById('taskList');

    if (taskList) {
        Sortable.create(taskList, {
            animation: 150,
            handle: '.drag-handle', // Тянем ТОЛЬКО за ручку
            ghostClass: 'sortable-ghost',
            dragClass: 'sortable-drag',
            chosenClass: 'sortable-chosen',
            swapThreshold: 0.65,

            // Здесь в будущем ты добавишь логику сохранения порядка в БД
            onEnd: function (evt) {
                console.log(`Задача перемещена с ${evt.oldIndex} на ${evt.newIndex} позицию`);
                // const movedElement = evt.item;
                // const taskId = movedElement.dataset.id;
                // fetch('/tasks/reorder', ...)
            }
        });
    }
});
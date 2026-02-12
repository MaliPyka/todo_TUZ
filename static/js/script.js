function addTask() {
    const input = document.getElementById('taskInput');
    const list = document.getElementById('taskList');

    if (input.value.trim() == "") return;

    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-item';
    taskDiv.innerHTML = `
    <input type="checkbox" class="task-checkbox">
    <span class="task-text">${input.value}</span>
`;

    list.prepend(taskDiv);

    input.value = "";

}
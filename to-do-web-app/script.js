let tasks = [];

function addTask() {
    const taskName = document.getElementById('taskName').value.trim();
    const taskTime = document.getElementById('taskTime').value;
    if (!taskName || !taskTime) {
        alert('Please enter task and date/time');
        return;
    }

    const task = {
        id: Date.now(),
        name: taskName,
        time: taskTime,
        completed: false
    };

    tasks.push(task);
    document.getElementById('taskName').value = '';
    document.getElementById('taskTime').value = '';
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById('taskList');
    list.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');
        li.setAttribute('data-id', task.id);

        const taskText = document.createElement('span');
        taskText.innerText = `${task.name} - ${new Date(task.time).toLocaleString()}`;

        const controls = document.createElement('div');
        controls.className = 'task-controls';

        const completeBtn = document.createElement('button');
        completeBtn.innerText = task.completed ? 'Undo' : 'Complete';
        completeBtn.onclick = () => playBlastBeforeComplete(task.id, li);

        const editBtn = document.createElement('button');
        editBtn.innerText = 'Edit';
        editBtn.onclick = () => editTask(task.id);

        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete';
        deleteBtn.onclick = () => deleteTask(task.id);

        controls.append(completeBtn, editBtn, deleteBtn);
        li.append(taskText, controls);
        list.appendChild(li);
    });
}

function playBlastBeforeComplete(id, li) {
    // Trigger reflow to restart animation if needed
    li.classList.remove('blast');
    void li.offsetWidth; // Force reflow

    li.classList.add('blast');

    // Wait for animation to finish
    setTimeout(() => {
        toggleComplete(id);
    }, 400); // Match animation duration in CSS
}

function toggleComplete(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newName = prompt('Edit task name:', task.name);
    const newTime = prompt('Edit task time (YYYY-MM-DDTHH:MM):', task.time);

    if (newName && newTime) {
        task.name = newName.trim();
        task.time = newTime;
        renderTasks();
    }
}

// Initial render
renderTasks();

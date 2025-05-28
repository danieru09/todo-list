let taskCounter = 0;
let tasks = [];

// DOM elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const progressList = document.getElementById('progressList');
const doneList = document.getElementById('doneList');

// Add task functionality
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const task = {
        id: ++taskCounter,
        text: taskText,
        status: 'todo'
    };

    tasks.push(task);
    createTaskElement(task);
    taskInput.value = '';
    updateEmptyStates();
}

// Create task element
function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    taskElement.draggable = true;
    taskElement.dataset.taskId = task.id;

    taskElement.innerHTML = `
        <div class="task-content">
            <span class="task-text">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;

    // Add drag event listeners
    taskElement.addEventListener('dragstart', handleDragStart);
    taskElement.addEventListener('dragend', handleDragEnd);

    // Add to appropriate list
    const targetList = getListByStatus(task.status);
    targetList.appendChild(taskElement);
}

// Get list element by status
function getListByStatus(status) {
    switch(status) {
        case 'todo': return todoList;
        case 'progress': return progressList;
        case 'done': return doneList;
        default: return todoList;
    }
}

// Delete task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskElement) {
        taskElement.remove();
    }
    updateEmptyStates();
}

// Drag and drop functionality
let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    draggedElement = null;
}

// Set up drop zones
[todoList, progressList, doneList].forEach(list => {
    list.addEventListener('dragover', handleDragOver);
    list.addEventListener('drop', handleDrop);
    list.addEventListener('dragenter', handleDragEnter);
    list.addEventListener('dragleave', handleDragLeave);
});

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    e.preventDefault();
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    if (!this.contains(e.relatedTarget)) {
        this.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');

    if (draggedElement && this !== draggedElement.parentNode) {
        // Update task status
        const taskId = parseInt(draggedElement.dataset.taskId);
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
            // Determine new status based on target list
            if (this === todoList) task.status = 'todo';
            else if (this === progressList) task.status = 'progress';
            else if (this === doneList) task.status = 'done';

            // Move element
            this.appendChild(draggedElement);
            updateEmptyStates();
        }
    }
}

// Update empty state messages
function updateEmptyStates() {
    [todoList, progressList, doneList].forEach(list => {
        const hasItems = list.querySelectorAll('.task-item').length > 0;
        const emptyState = list.querySelector('.empty-state');
        
        if (hasItems && emptyState) {
            emptyState.style.display = 'none';
        } else if (!hasItems && !emptyState) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-state';
            
            if (list === todoList) emptyDiv.textContent = 'Drop new tasks here';
            else if (list === progressList) emptyDiv.textContent = 'Tasks being worked on';
            else emptyDiv.textContent = 'Completed tasks';
            
            list.appendChild(emptyDiv);
        } else if (!hasItems && emptyState) {
            emptyState.style.display = 'block';
        }
    });
}

// Event listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Initialize empty states
updateEmptyStates();
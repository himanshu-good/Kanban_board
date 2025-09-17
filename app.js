// Complete app.js with enhancements
import { createElement, HistoryManager } from './utils.js';
import { saveTasks, loadTasks } from './storage.js';
import { setupDragAndDrop } from './dragDrop.js';

const form = document.getElementById('task-form');
const titleInput = document.getElementById('task-title');
const descInput = document.getElementById('task-desc');
const board = document.getElementById('board');
const editModal = document.getElementById('edit-modal');
const viewMoreModal = document.getElementById('view-more-modal');
const editTitle = document.getElementById('edit-title');
const editDesc = document.getElementById('edit-desc');
const updateBtn = document.getElementById('update-btn');
const closeEditModalBtn = document.getElementById('close-edit-modal');
const closeViewModalBtn = document.getElementById('close-view-modal');
const viewMoreContent = document.getElementById('view-more-content');

let tasks = loadTasks();
const history = new HistoryManager();
let editTaskId = null;

function saveState() {
    history.push(tasks);
}

function renderTasks() {
    ['todo', 'inprogress', 'done'].forEach(status => {
        const container = document.getElementById(`${status}-list`);
        container.innerHTML = '';
        tasks.filter(task => task.status === status)
            .forEach(task => container.appendChild(createTaskElement(task)));
    });
}

function createTaskElement(task) {
    const el = createElement('div', 'task');
    el.dataset.id = task.id;
    el.draggable = true;

    const title = createElement('h4', '', task.title);
    const desc = createElement('p', '', truncateText(task.description));

    const container = createElement('div');
    container.appendChild(title);
    container.appendChild(desc);

    if (task.description.length > 100) {
        const viewMore = createElement('div', 'view-more', 'View more...');
        viewMore.addEventListener('click', () => openViewMoreModal(task));
        container.appendChild(viewMore);
    }

    const actions = createElement('div', 'task-actions');
    const editBtn = createElement('button', '', '');
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.title = 'Edit';
    editBtn.addEventListener('click', () => openEditModal(task.id));

    const deleteBtn = createElement('button', '', '');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.title = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    el.appendChild(container);
    el.appendChild(actions);
    return el;
}

function truncateText(text) {
    if (text.length > 100) {
        return text.substring(0, 100) + '...';
    }
    return text;
}

function addTask(title, description) {
    saveState();
    const newTask = {
        id: 'task-' + Date.now(),
        title,
        description,
        status: 'todo'
    };
    tasks.push(newTask);
    saveTasks(tasks);
    renderTasks();
}

function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    editTaskId = taskId;
    editTitle.value = task.title;
    editDesc.value = task.description;
    editModal.classList.add('show');
}

function closeEditModal() {
    editModal.classList.remove('show');
}

function openViewMoreModal(task) {
    viewMoreContent.innerHTML = `<h4>${task.title}</h4><p>${task.description}</p>`;
    viewMoreModal.classList.add('show');
}

function closeViewMoreModal() {
    viewMoreModal.classList.remove('show');
}

function updateTask() {
    const task = tasks.find(t => t.id === editTaskId);
    if (!task) return;
    saveState();
    task.title = editTitle.value.trim();
    task.description = editDesc.value.trim();
    saveTasks(tasks);
    renderTasks();
    closeEditModal();
}

function deleteTask(taskId) {
    saveState();
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks(tasks);
    renderTasks();
}

function handleTaskDrop(taskId, newStatus, order) {
    saveState();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = newStatus;
    }
    tasks.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
    saveTasks(tasks);
    renderTasks();
}


function init() {
renderTasks();
form.addEventListener('submit', e => {
e.preventDefault();
const title = titleInput.value.trim();
const desc = descInput.value.trim();
if (title && desc) {
addTask(title, desc);
form.reset();
}
});


closeEditModalBtn.addEventListener('click', closeEditModal);
updateBtn.addEventListener('click', updateTask);


closeViewModalBtn.addEventListener('click', closeViewMoreModal);
viewMoreModal.addEventListener('click', e => {
if (e.target === viewMoreModal) closeViewMoreModal();
});
editModal.addEventListener('click', e => {
if (e.target === editModal) closeEditModal();
});


setupDragAndDrop(board, handleTaskDrop);
}


init();

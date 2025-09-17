export function setupDragAndDrop(board, onTaskDrop) {
    let draggedTask = null;
    board.addEventListener('dragstart', e => {
        if (e.target.classList.contains('task')) {
            draggedTask = e.target;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', e.target.dataset.id);
            setTimeout(() => e.target.classList.add('dragging'), 0);
        }
    });

    board.addEventListener('dragend', e => {
        if (draggedTask) {
            draggedTask.classList.remove('dragging');
            draggedTask = null;
        }
    });

    const columns = board.querySelectorAll('.column');
    columns.forEach(column => {
        column.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(column, e.clientY);
            const dragging = board.querySelector('.dragging');
            const taskList = column.querySelector('.task-list');
            if (afterElement == null) {
                taskList.appendChild(dragging);
            } else {
                taskList.insertBefore(dragging, afterElement);
            }
        });

        column.addEventListener('drop', e => {
            e.preventDefault();
            const taskId = e.dataTransfer.getData('text/plain');
            const taskList = column.querySelector('.task-list');
            const order = Array.from(taskList.children).map(el => el.dataset.id);
            onTaskDrop(taskId, column.dataset.status, order);
        });
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

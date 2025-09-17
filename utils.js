export function createElement(tag, className = '', text = '') {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
}

export class HistoryManager {
    constructor() {
        this.stack = [];
    }

    push(state) {
        const snapshot = JSON.stringify(state);
        this.stack.push(snapshot);
    }

    pop() {
        if (this.stack.length > 1) {
            this.stack.pop();
            return JSON.parse(this.stack[this.stack.length - 1]);
        }
        return null;
    }
}

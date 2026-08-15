// To-Do List Application with Local Storage

class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.render();
    }

    // Local Storage Methods
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('todos');
            this.todos = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading from storage:', error);
            this.todos = [];
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('todos', JSON.stringify(this.todos));
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    // Event Listeners
    setupEventListeners() {
        const addBtn = document.getElementById('addBtn');
        const todoInput = document.getElementById('todoInput');
        const clearBtn = document.getElementById('clearBtn');
        const filterBtns = document.querySelectorAll('.filter-btn');

        addBtn.addEventListener('click', () => this.addTodo());
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
        clearBtn.addEventListener('click', () => this.clearCompleted());
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });
    }

    // Add Todo
    addTodo() {
        const todoInput = document.getElementById('todoInput');
        const text = todoInput.value.trim();

        if (text === '') {
            alert('Please enter a task!');
            return;
        }

        if (text.length > 100) {
            alert('Task is too long! Please keep it under 100 characters.');
            return;
        }

        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toLocaleString()
        };

        this.todos.unshift(newTodo);
        this.saveToStorage();
        todoInput.value = '';
        todoInput.focus();
        this.render();
    }

    // Toggle Todo Completion
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToStorage();
            this.render();
        }
    }

    // Delete Todo
    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveToStorage();
        this.render();
    }

    // Clear Completed Todos
    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        if (completedCount === 0) {
            alert('No completed tasks to clear!');
            return;
        }

        if (confirm(`Clear ${completedCount} completed task(s)?`)) {
            this.todos = this.todos.filter(t => !t.completed);
            this.saveToStorage();
            this.render();
        }
    }

    // Set Filter
    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        this.render();
    }

    // Get Filtered Todos
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    // Update Task Count
    updateTaskCount() {
        const activeCount = this.todos.filter(t => !t.completed).length;
        const taskCountEl = document.getElementById('taskCount');
        const taskWord = activeCount === 1 ? 'task' : 'tasks';
        taskCountEl.textContent = `${activeCount} ${taskWord}`;
    }

    // Render Todo List
    render() {
        const todoList = document.getElementById('todoList');
        const filteredTodos = this.getFilteredTodos();

        todoList.innerHTML = '';

        if (filteredTodos.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = '<p>📭 No tasks yet. Add one to get started!</p>';
            todoList.appendChild(emptyState);
        } else {
            filteredTodos.forEach(todo => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <input 
                        type="checkbox" 
                        class="checkbox" 
                        ${todo.completed ? 'checked' : ''}
                        onchange="app.toggleTodo(${todo.id})"
                    >
                    <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                    <button class="delete-btn" onclick="app.deleteTodo(${todo.id})">Delete</button>
                `;
                todoList.appendChild(li);
            });
        }

        this.updateTaskCount();
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize App
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TodoApp();
});

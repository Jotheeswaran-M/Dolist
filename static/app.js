const API_URL = '/api';

// Load todos when page loads
document.addEventListener('DOMContentLoaded', loadTodos);

async function loadTodos() {
    try {
        const response = await fetch(`${API_URL}/todos`);
        const todos = await response.json();
        const todoList = document.getElementById('todoList');
        todoList.innerHTML = '';
        
        todos.forEach(todo => {
            addTodoToDOM(todo);
        });
    } catch (error) {
        console.error('Error loading todos:', error);
    }
}

async function addTodo() {
    const input = document.getElementById('todoInput');
    const title = input.value.trim();
    
    if (!title) return;
    
    try {
        const response = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
        });
        
        const todo = await response.json();
        addTodoToDOM(todo);
        input.value = '';
    } catch (error) {
        console.error('Error adding todo:', error);
    }
}

function addTodoToDOM(todo) {
    const todoList = document.getElementById('todoList');
    const li = document.createElement('li');
    li.innerHTML = `
        <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${todo.id}, this.checked)">
        <span>${todo.title}</span>
        <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
    `;
    if (todo.completed) {
        li.classList.add('completed');
    }
    todoList.appendChild(li);
}

async function toggleTodo(id, completed) {
    try {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed })
        });
        
        if (response.ok) {
            const li = document.querySelector(`li:has(input[onchange*="toggleTodo(${id},"])`);
            if (completed) {
                li.classList.add('completed');
            } else {
                li.classList.remove('completed');
            }
        }
    } catch (error) {
        console.error('Error updating todo:', error);
    }
}

async function deleteTodo(id) {
    try {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            const li = document.querySelector(`li:has(input[onchange*="toggleTodo(${id},"])`);
            li.remove();
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

// Add todo when Enter key is pressed
document.getElementById('todoInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTodo();
    }
}); 
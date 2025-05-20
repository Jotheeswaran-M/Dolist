from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json

app = Flask(__name__, static_folder='static')
CORS(app)

# Initialize todos list
todos = []

# Serve static files
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

# Get all todos
@app.route('/api/todos', methods=['GET'])
def get_todos():
    return jsonify(todos)

# Add a new todo
@app.route('/api/todos', methods=['POST'])
def add_todo():
    try:
        data = request.get_json()
        if not data or 'title' not in data:
            return jsonify({'error': 'Title is required'}), 400
        
        todo = {
            'id': len(todos) + 1,
            'title': data['title'],
            'completed': False
        }
        todos.append(todo)
        return jsonify(todo), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Update a todo
@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    try:
        data = request.get_json()
        for todo in todos:
            if todo['id'] == todo_id:
                todo['completed'] = data['completed']
                return jsonify(todo)
        return jsonify({'error': 'Todo not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Delete a todo
@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    for todo in todos:
        if todo['id'] == todo_id:
            todos.remove(todo)
            return '', 204
    return jsonify({'error': 'Todo not found'}), 404

if __name__ == '__main__':
    app.run(debug=True) 
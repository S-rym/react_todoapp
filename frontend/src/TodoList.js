import React from 'react'
import Todo from './Todo.js'

function TodoList({ todos, toggleTodo }) {
  return (
    <>
      {todos.map((todo) => (
        <li
          key={todo.id}
          className={`todo-item ${todo.completed ? "completed" : ""}`}
        >
          <label>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            {todo.name}
          </label>
        </li>
      ))}
    </>
  );
}

export default TodoList;
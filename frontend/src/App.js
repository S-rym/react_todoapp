import { useState, useRef, useEffect } from "react";
import TodoList from "./TodoList";
import { v4 as uuidv4 } from "uuid";
import "./App.css"; // CSSをインポート

function App() {
  const [todos, setTodos] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState("");

  const todoNameRef = useRef();

    //タスクの取得
    useEffect(() => {
      fetch("http://localhost:5000/todos")
        .then(res => res.json())
        .then(data => setTodos(data));
    }, []);  

  // 現在の日付と時刻を更新する関数
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      setCurrentDateTime(formattedDateTime);
    };

    updateDateTime(); // 初期表示
    const intervalId = setInterval(updateDateTime, 1000); // 1秒ごとに更新

    return () => clearInterval(intervalId); // クリーンアップ
  }, []);

  // 新しいタスクを追加する関数
  const handleAddTodo = () => {
    const name = todoNameRef.current.value;
    if (name === "") return;
  
    const newTodo = { id: uuidv4(), name, completed: false };
  
    fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    })
      .then((res) => res.json())
      .then((data) => {
        setTodos((prevTodos) => [...prevTodos, data]);
      });
  
    todoNameRef.current.value = null;
  };
  
  

  // タスクの完了状態を切り替える関数
  const toggleTodo = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    const updated = updatedTodos.find(todo => todo.id === id);
  
    fetch(`http://localhost:5000/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: updated.completed })
    }).then(() => setTodos(updatedTodos));
  };
  

  // 完了したタスクを削除する関数
  const handleClear = () => {
    fetch("http://localhost:5000/todos/completed", {
      method: "DELETE"
    }).then(() =>
      setTodos(todos.filter(todo => !todo.completed))
    );
  };

  
  return (
    <div className="container">
      <h1>タスク管理アプリ</h1>
      {/* 現在の日付と時刻を表示 */}
      <div className="current-datetime">現在の日時: {currentDateTime}</div>
      <div className="todo-input">
        <input type="text" ref={todoNameRef} placeholder="新しいタスクを入力" />
        <button onClick={handleAddTodo}>追加</button>
      </div>
      <ul className="todo-list">
        <TodoList todos={todos} toggleTodo={toggleTodo} />
      </ul>
      <button className="clear-button" onClick={handleClear}>
        完了したタスクを削除
      </button>
      <div className="remaining-tasks">
        残りのタスク: {todos.filter((todo) => !todo.completed).length}
      </div>
    </div>
  );
}

export default App;

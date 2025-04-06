import { useState, useRef, useEffect } from "react";
import TodoList from "./TodoList";
import { v4 as uuidv4 } from "uuid";
import "./App.css"; // CSSをインポート

function App() {
  const [todos, setTodos] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState("");

  const todoNameRef = useRef();

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
    setTodos((prevTodos) => {
      return [...prevTodos, { id: uuidv4(), name: name, completed: false }];
    });
    todoNameRef.current.value = null;
  };

  // タスクの完了状態を切り替える関数
  const toggleTodo = (id) => {
    const newTodos = [...todos];
    const todo = newTodos.find((todo) => todo.id === id);
    todo.completed = !todo.completed;
    setTodos(newTodos);
  };

  // 完了したタスクを削除する関数
  const handleClear = () => {
    const newTodos = todos.filter((todo) => !todo.completed);
    setTodos(newTodos);
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

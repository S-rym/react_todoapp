const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 5000;

// メモリ内のタスクデータ
let todos = [];

// ミドルウェア
app.use(cors());
app.use(express.json());

// タスクを取得するエンドポイント
app.get("/todos", (req, res) => {
  res.json(todos);
});

// 新しいタスクを追加するエンドポイント
app.post("/todos", (req, res) => {
  const { name, completed = false } = req.body;
  if (!name) {
    return res.status(400).json({ error: "タスク名が必要です" });
  }

  const newTodo = { id: uuidv4(), name, completed };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// タスクの完了状態を更新するエンドポイント
app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  const todo = todos.find((todo) => todo.id === id);
  if (!todo) {
    return res.status(404).json({ error: "タスクが見つかりません" });
  }

  todo.completed = completed;
  res.json(todo);
});

// 完了したタスクを削除するエンドポイント
app.delete("/todos/completed", (req, res) => {
  todos = todos.filter((todo) => !todo.completed);
  res.status(204).send();
});

// サーバーを起動
app.listen(PORT, () => {
  console.log(`サーバーがポート ${PORT} で起動しました`);
});

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let todos = [];
let nextId = 1;

// Create a new TODO
app.post('/todos', (req, res) => {
  const { title, completed = false } = req.body;
  const todo = { id: nextId++, title, completed };
  todos.push(todo);
  res.status(201).json(todo);
});

// Get all TODOs
app.get('/todos', (req, res) => {
  res.json(todos);
});

// Get a TODO by ID
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: 'TODO not found' });
  res.json(todo);
});

// Update a TODO
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: 'TODO not found' });

  const { title, completed } = req.body;
  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;

  res.json(todo);
});

// Delete a TODO
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'TODO not found' });

  const deleted = todos.splice(index, 1)[0];
  res.json(deleted);
});

app.listen(PORT, () => {
  console.log(`✅ TODO API running at http://localhost:${PORT}`);
});

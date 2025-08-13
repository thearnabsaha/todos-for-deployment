'use client';
import { useEffect, useState } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const API_BASE = 'http://localhost:3000'; // Express backend

  const fetchTodos = async () => {
    const res = await fetch(`${API_BASE}/todos`, { credentials: 'include' });
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!newTodo) return;
    const res = await fetch(`${API_BASE}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTodo }),
      credentials: 'include',
    });
    const data = await res.json();
    setTodos([...todos, data]);
    setNewTodo('');
  };

  const toggleTodo = async (id: number) => {
    const res = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'PATCH',
      credentials: 'include',
    });
    const data = await res.json();
    setTodos(todos.map(t => (t.id === id ? data : t)));
  };

  const deleteTodo = async (id: number) => {
    await fetch(`${API_BASE}/todos/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div style={{ maxWidth: 500, margin: '50px auto', padding: 20 }}>
      <h1>Todo App</h1>
      <div style={{ display: 'flex', marginBottom: 20 }}>
        <input value={newTodo} onChange={e => setNewTodo(e.target.value)} placeholder="Enter todo" style={{ flex: 1, marginRight: 10, padding: 10 }} />
        <button onClick={addTodo} style={{ padding: 10 }}>Add</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 10, textDecoration: todo.completed ? 'line-through' : 'none' }}>
            <div>
              <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} style={{ marginRight: 10 }} />
              {todo.title}
            </div>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

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

  const fetchTodos = async () => {
    const res = await fetch('/api/todos');
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!newTodo) return;
    const res = await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ title: newTodo }),
    });
    const data = await res.json();
    setTodos([...todos, data]);
    setNewTodo('');
  };

  const toggleTodo = async (id: number) => {
    const res = await fetch('/api/todos', {
      method: 'PATCH',
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    setTodos(todos.map(t => (t.id === id ? data : t)));
  };

  const deleteTodo = async (id: number) => {
    await fetch('/api/todos', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div style={{ maxWidth: 500, margin: '50px auto', padding: 20, background: '#fff', borderRadius: 12, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center' }}>Todo App</h1>
      <div style={{ display: 'flex', marginBottom: 20 }}>
        <input
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          style={{ flex: 1, padding: 10, marginRight: 10, borderRadius: 8, border: '1px solid #ccc' }}
          placeholder="Enter todo"
        />
        <button onClick={addTodo} style={{ padding: 10, borderRadius: 8, background: '#0070f3', color: '#fff', fontWeight: 'bold' }}>
          Add
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 10, borderBottom: '1px solid #eee', textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#888' : '#000' }}>
            <div>
              <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} style={{ marginRight: 10 }} />
              {todo.title}
            </div>
            <button onClick={() => deleteTodo(todo.id)} style={{ background: '#f00', color: '#fff', borderRadius: 8, padding: '5px 10px', border: 'none' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

let todos: Todo[] = [];
let nextId = 1;

export function getTodos() {
    return todos;
}

export function addTodo(title: string) {
    const todo = { id: nextId++, title, completed: false };
    todos.push(todo);
    return todo;
}

export function toggleTodo(id: number) {
    const todo = todos.find(t => t.id === id);
    if (todo) todo.completed = !todo.completed;
    return todo;
}

export function deleteTodo(id: number) {
    todos = todos.filter(t => t.id !== id);
}

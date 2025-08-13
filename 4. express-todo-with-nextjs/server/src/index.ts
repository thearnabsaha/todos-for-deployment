import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

dotenv.config();

if (!process.env.PORT) {
    console.error('❌ Missing PORT in .env file');
    process.exit(1);
}
if (!process.env.CORS_ORIGIN) {
    console.error('❌ Missing CORS_ORIGIN in .env file');
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;
const morganFormat = ':method :url :status :response-time ms';

app.use(morgan(morganFormat));
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// Root route
app.get('/', (req, res) => {
    res.send('hello from simple server :)');
});

// Health check route
app.get('/health', (req, res) => {
    const start = Date.now();
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: new Date(),
        responseTime: `${Date.now() - start}ms`,
    };
    res.status(200).json(healthcheck);
});

// ----------------------
// In-memory TODO routes
// ----------------------
if (!process.env.ENABLE_TODO) {
    console.warn('⚠️ Todo API disabled — set ENABLE_TODO in .env to enable it');
} else {
    type Todo = { id: number; title: string; completed: boolean };
    let todos: Todo[] = [];
    let nextId = 1;

    // Get all todos
    app.get('/todos', (req, res) => {
        res.json(todos);
    });

    // Create a new todo
    app.post('/todos', (req, res) => {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }
        const newTodo: Todo = { id: nextId++, title, completed: false };
        todos.push(newTodo);
        res.status(201).json(newTodo);
    });

    // Toggle complete status
    app.patch('/todos/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const todo = todos.find(t => t.id === id);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        todo.completed = !todo.completed;
        res.json(todo);
    });

    // Delete a todo
    app.delete('/todos/:id', (req, res) => {
        const id = parseInt(req.params.id);
        todos = todos.filter(t => t.id !== id);
        res.status(204).send();
    });
}

app.listen(port, () => console.log(`> Server is running on port: ${port}`));

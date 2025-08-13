import { NextRequest, NextResponse } from 'next/server';
import { getTodos, addTodo, toggleTodo, deleteTodo } from './store';

// Helper to check if todos are enabled
function checkEnabled() {
    if (process.env.ENABLE_TODO !== 'true') {
        return NextResponse.json({ error: 'Todo API is disabled' }, { status: 403 });
    }
}

export async function GET() {
    const blocked = checkEnabled();
    if (blocked) return blocked;
    return NextResponse.json(getTodos());
}

export async function POST(req: NextRequest) {
    const blocked = checkEnabled();
    if (blocked) return blocked;

    const { title } = await req.json();
    if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 });

    const newTodo = addTodo(title);
    return NextResponse.json(newTodo, { status: 201 });
}

export async function PATCH(req: NextRequest) {
    const blocked = checkEnabled();
    if (blocked) return blocked;

    const { id } = await req.json();
    const todo = toggleTodo(id);
    if (!todo) return NextResponse.json({ error: 'Todo not found' }, { status: 404 });

    return NextResponse.json(todo);
}

export async function DELETE(req: NextRequest) {
    const blocked = checkEnabled();
    if (blocked) return blocked;

    const { id } = await req.json();
    deleteTodo(id);
    return NextResponse.json({}, { status: 204 });
}

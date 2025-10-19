import { useCallback, useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { Todo, TodoFilter, TodoId } from '../types/todo';

function createTodo(title: string): Todo {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState<string>('');
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [editingId, setEditingId] = useState<TodoId | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((t) => !t.completed);
      case 'completed':
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const remainingCount = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos]
  );

  const addTodo = useCallback(() => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    setTodos((prev) => [createTodo(trimmed), ...prev]);
    setNewTitle('');
  }, [newTitle]);

  const deleteTodo = useCallback((id: TodoId) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTodo = useCallback((id: TodoId) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed, updatedAt: Date.now() } : t
      )
    );
  }, []);

  const startEdit = useCallback((id: TodoId, title: string) => {
    setEditingId(id);
    setEditingTitle(title);
  }, []);

  const commitEdit = useCallback(() => {
    if (!editingId) return;
    const trimmed = editingTitle.trim();
    if (!trimmed) {
      // If empty on save, delete the todo
      setTodos((prev) => prev.filter((t) => t.id !== editingId));
    } else {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === editingId ? { ...t, title: trimmed, updatedAt: Date.now() } : t
        )
      );
    }
    setEditingId(null);
    setEditingTitle('');
  }, [editingId, editingTitle]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditingTitle('');
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  const handleNewTodoKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') addTodo();
    },
    [addTodo]
  );

  const handleEditKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') commitEdit();
      if (e.key === 'Escape') cancelEdit();
    },
    [commitEdit, cancelEdit]
  );

  return (
    <div className="mx-auto w-full max-w-2xl rounded-xl bg-white p-6 shadow-md">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">Todo List</h1>

      <div className="mb-4 flex items-center gap-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={handleNewTodoKeyDown}
          placeholder="Add a new task"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        <button
          onClick={addTodo}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Add
        </button>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <div className="flex gap-2">
          {(['all', 'active', 'completed'] as TodoFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                'rounded-full px-3 py-1 text-xs font-medium ' +
                (filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
              }
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="text-xs text-gray-500">
          {remainingCount} item{remainingCount === 1 ? '' : 's'} left
        </div>
      </div>

      <ul className="divide-y divide-gray-200">
        {filteredTodos.length === 0 && (
          <li className="py-6 text-center text-sm text-gray-500">No todos</li>
        )}
        {filteredTodos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-3 py-3">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />

            {editingId === todo.id ? (
              <input
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onKeyDown={handleEditKeyDown}
                onBlur={commitEdit}
                autoFocus
                className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            ) : (
              <span
                className={
                  'flex-1 text-sm ' + (todo.completed ? 'text-gray-400 line-through' : 'text-gray-800')
                }
              >
                {todo.title}
              </span>
            )}

            {editingId === todo.id ? (
              <div className="flex gap-2">
                <button
                  onClick={commitEdit}
                  className="rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="rounded-md bg-gray-300 px-2 py-1 text-xs font-medium text-gray-800 hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(todo.id, todo.title)}
                  className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="rounded-md bg-rose-600 px-2 py-1 text-xs font-medium text-white hover:bg-rose-700"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={clearCompleted}
          className="text-xs text-gray-600 hover:text-gray-800"
        >
          Clear completed
        </button>
        <div className="text-xs text-gray-400">
          Total: {todos.length}
        </div>
      </div>
    </div>
  );
}

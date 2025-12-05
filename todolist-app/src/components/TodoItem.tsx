import { memo, useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { Todo, TodoId } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: TodoId) => void;
  onDelete: (id: TodoId) => void;
  onUpdateTitle: (id: TodoId, title: string) => void;
}

function TodoItemComponent({ todo, onToggle, onDelete, onUpdateTitle }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isEditing) {
      setDraftTitle(todo.title);
    }
  }, [todo.title, isEditing]);

  useEffect(() => {
    if (!isEditing) return;
    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
    return () => cancelAnimationFrame(frame);
  }, [isEditing]);

  const handleStartEdit = useCallback(() => {
    setDraftTitle(todo.title);
    setIsEditing(true);
  }, [todo.title]);

  const commitEdit = useCallback(() => {
    const trimmed = draftTitle.trim();
    if (!trimmed) {
      onDelete(todo.id);
    } else if (trimmed !== todo.title) {
      onUpdateTitle(todo.id, trimmed);
    }
    setIsEditing(false);
  }, [draftTitle, onDelete, onUpdateTitle, todo.id, todo.title]);

  const cancelEdit = useCallback(() => {
    setDraftTitle(todo.title);
    setIsEditing(false);
  }, [todo.title]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        commitEdit();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        cancelEdit();
      }
    },
    [commitEdit, cancelEdit]
  );

  const handleBlur = useCallback(() => {
    if (isEditing) {
      commitEdit();
    }
  }, [commitEdit, isEditing]);

  return (
    <li className="flex items-center gap-3 py-3">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        aria-label={`Mark ${todo.title} as ${todo.completed ? 'incomplete' : 'complete'}`}
      />

      {isEditing ? (
        <input
          ref={inputRef}
          value={draftTitle}
          onChange={(event) => setDraftTitle(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
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

      <div className="flex gap-2">
        {isEditing ? (
          <>
            <button
              onMouseDown={(event) => event.preventDefault()}
              onClick={commitEdit}
              className="rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
            >
              Save
            </button>
            <button
              onMouseDown={(event) => event.preventDefault()}
              onClick={cancelEdit}
              className="rounded-md bg-gray-300 px-2 py-1 text-xs font-medium text-gray-800 hover:bg-gray-400"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleStartEdit}
              className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="rounded-md bg-rose-600 px-2 py-1 text-xs font-medium text-white hover:bg-rose-700"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
}

export default memo(TodoItemComponent);

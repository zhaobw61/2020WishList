export type TodoId = string;

export type TodoFilter = 'all' | 'active' | 'completed';

export interface Todo {
  id: TodoId;
  title: string;
  completed: boolean;
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
}

import TodoList from './components/TodoList';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 shadow-sm">
          💡 顶部提示：合理拆分任务并为每个行动设定清晰的下一步，可以让你的待办列表发挥最大价值。
        </div>
        <TodoList />
      </div>
    </div>
  );
}

export default App

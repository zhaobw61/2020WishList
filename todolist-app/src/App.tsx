import { useState } from 'react';

import Alert from './components/Alert';
import TodoList from './components/TodoList';

function App() {
  const [showTip, setShowTip] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-3xl px-4">
        {showTip && (
          <Alert
            variant="info"
            title="💡 顶部提示"
            dismissible
            onClose={() => setShowTip(false)}
            className="mb-6"
          >
            合理拆分任务并为每个行动设定清晰的下一步，可以让你的待办列表发挥最大价值。
          </Alert>
        )}
        <TodoList />
      </div>
    </div>
  );
}

export default App;

import ArchiveTab from './Archive/ArchiveTab';

const TaskManager = ({ tasks }) => {
  const [activeTab, setActiveTab] = useState('kanban'); // Estado para controlar a aba ativa

  // Filtra as tarefas concluídas
  const completedTasks = tasks.filter(task => task.status === 'Complete');

  // Ao marcar uma tarefa como concluída
  const completeTask = async (taskId) => {
    await api.updateTask(taskId, {
      status: 'Complete',
      completedAt: new Date().toISOString() // Adiciona a data de conclusão
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Abas de navegação */}
      <div className="flex space-x-4 border-b border-slate-700 px-4">
        <button
          className={`py-2 px-4 ${activeTab === 'kanban' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-slate-400'}`}
          onClick={() => setActiveTab('kanban')}
        >
          Kanban
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'archive' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-slate-400'}`}
          onClick={() => setActiveTab('archive')}
        >
          Arquivo
        </button>
      </div>

      {/* Conteúdo das abas */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'kanban' ? (
          <KanbanBoard tasks={tasks.filter(task => task.status !== 'Complete')} />
        ) : (
          <ArchiveTab completedTasks={completedTasks} />
        )}
      </div>
    </div>
  );
};

export default TaskManager; 
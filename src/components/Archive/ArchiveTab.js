import React from 'react';
import { format } from 'date-fns';

const ArchiveTab = ({ completedTasks }) => {
  console.log('Tarefas concluídas recebidas:', completedTasks);

  // Ordena as tarefas por data de conclusão (mais recente primeiro)
  const sortedTasks = [...completedTasks].sort((a, b) => 
    new Date(b.completedAt) - new Date(a.completedAt)
  );

  return (
    <div className="h-full overflow-y-auto p-4">
      <h2 className="text-xl font-semibold text-slate-200 mb-6">Arquivo de Tarefas</h2>
      
      {sortedTasks.length > 0 ? (
        <ul className="space-y-4">
          {sortedTasks.map((task) => (
            <li key={task.id} className="glass-card p-4 hover:bg-slate-800/50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-slate-200">{task.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Concluída em: {format(new Date(task.completedAt), 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>
                <div className="text-sm text-slate-400">
                  Atribuída para: {task.assignedToName || 'Ninguém'}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-400">Nenhuma tarefa concluída encontrada.</p>
      )}
    </div>
  );
};

export default ArchiveTab; 
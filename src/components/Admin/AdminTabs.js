import React, { useState } from 'react';
import TaskManagementList from './TaskManagementList';
import ArchiveTab from '../Archive/ArchiveTab';

const AdminTabs = ({ tasks }) => {
  const [activeTab, setActiveTab] = useState('management'); // Estado para controlar a aba ativa

  // Filtra as tarefas concluídas
  const completedTasks = tasks.filter(task => task.status === 'Complete');

  console.log('Tarefas recebidas:', tasks);
  console.log('Tarefas concluídas:', completedTasks);

  return (
    <div className="h-full flex flex-col">
      {/* Abas de navegação */}
      <div className="flex space-x-4 border-b border-slate-700 px-4">
        <button
          className={`py-2 px-4 ${activeTab === 'management' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-slate-400'}`}
          onClick={() => setActiveTab('management')}
        >
          Gerenciamento
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
        {activeTab === 'management' ? (
          <TaskManagementList tasks={tasks.filter(task => task.status !== 'Complete')} />
        ) : (
          <ArchiveTab completedTasks={completedTasks} />
        )}
      </div>
    </div>
  );
};

export default AdminTabs;
import React, { useState } from 'react';
import AdminMenu from './AdminMenu';
import TaskManagementList from './TaskManagementList';

const AdminPage = ({ tasks }) => {
  const [activeTab, setActiveTab] = useState('management'); // Estado para controlar a aba ativa

  return (
    <div className="h-full flex flex-col">
      {/* Menu de navegação */}
      <AdminMenu activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Conteúdo das abas */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'management' ? (
          <TaskManagementList tasks={tasks} />
        ) : (
          <div className="p-4">
            <h2 className="text-xl font-semibold text-slate-200">Arquivo de Tarefas</h2>
            <p className="text-slate-400 mt-2">Aqui estarão as tarefas concluídas.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage; 
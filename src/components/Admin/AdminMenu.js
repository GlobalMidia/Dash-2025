import React from 'react';

const AdminMenu = ({ activeTab, setActiveTab }) => {
  return (
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
  );
};

export default AdminMenu; 
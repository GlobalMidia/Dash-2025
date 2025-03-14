import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getData, setData, dataKeys } from '../../data/localStorageUtils';

const ArchivedTasks = () => {
  const [archivedTasks, setArchivedTasks] = useState([]);

  // Função para limpar tarefas antigas (mais de 1 mês)
  const cleanOldTasks = () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const currentTasks = getData(dataKeys.TASK_HISTORY) || [];
    const recentTasks = currentTasks.filter(task => 
      new Date(task.completedAt) > oneMonthAgo
    );

    setData(dataKeys.TASK_HISTORY, recentTasks);
    setArchivedTasks(recentTasks);
  };

  // Carregar tarefas e verificar data de limpeza
  useEffect(() => {
    const history = getData(dataKeys.TASK_HISTORY) || [];
    const lastCleanup = localStorage.getItem('lastArchiveCleanup');
    const today = new Date();
    
    // Se nunca limpou ou se já passou um mês desde a última limpeza
    if (!lastCleanup || new Date(lastCleanup).getMonth() !== today.getMonth()) {
      cleanOldTasks();
      localStorage.setItem('lastArchiveCleanup', today.toISOString());
    } else {
      // Sort descending by completion time
      const sorted = [...history].sort((a, b) => 
        new Date(b.completedAt) - new Date(a.completedAt)
      );
      setArchivedTasks(sorted);
    }
  }, []);

  // Função para limpar manualmente todo o histórico
  const handleClearAll = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o histórico?')) {
      setData(dataKeys.TASK_HISTORY, []);
      setArchivedTasks([]);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold gradient-text">Tarefas Arquivadas</h2>
        {archivedTasks.length > 0 && (
          <button
            onClick={handleClearAll}
            className="btn btn-danger text-sm px-3 py-1"
          >
            Limpar Histórico
          </button>
        )}
      </div>

      {archivedTasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-400">Nenhuma tarefa arquivada.</p>
          <p className="text-xs text-slate-500 mt-2">
            O histórico é limpo automaticamente todo mês
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-400 mb-4">
            Mostrando {archivedTasks.length} tarefas dos últimos 30 dias
          </p>
          <ul className="space-y-3">
            {archivedTasks.map(task => (
              <motion.li
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-3 shadow-md rounded-md"
              >
                <h3 className="text-lg font-semibold text-slate-100">{task.title}</h3>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-slate-400">
                    Arquivada em: {new Date(task.completedAt).toLocaleDateString()}
                  </p>
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded-full">
                    Concluída
                  </span>
                </div>
              </motion.li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ArchivedTasks;

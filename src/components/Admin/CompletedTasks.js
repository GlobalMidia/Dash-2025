import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getData, dataKeys } from '../../data/localStorageUtils';

const CompletedTasks = () => {
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const history = getData(dataKeys.TASK_HISTORY) || [];
    // Sort descending by completion time
    const sorted = history.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    setCompletedTasks(sorted);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold gradient-text mb-4">Tarefas Concluídas</h2>
      {completedTasks.length === 0 ? (
        <p className="text-slate-400">Nenhuma tarefa concluída.</p>
      ) : (
        <ul className="space-y-3">
          {completedTasks.map(task => (
            <motion.li
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-3 shadow-md rounded-md"
            >
              <h3 className="text-lg font-semibold text-slate-100">{task.title}</h3>
              <p className="text-xs text-slate-400">
                Concluída em: {new Date(task.completedAt).toLocaleDateString()}
              </p>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompletedTasks;

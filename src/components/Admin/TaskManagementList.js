import React from 'react';
import { motion } from 'framer-motion';

const TaskManagementList = ({ tasks, onTaskClick, onDeleteTask }) => {
  return (
    <div className="h-full overflow-y-auto pr-2">
      <ul className="space-y-1">
        {tasks.map((task, index) => (
          <motion.li
            key={task.id || `task-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="glass-card p-2 hover:bg-slate-800/50 transition-colors duration-200"
          >
            <div className="flex items-center">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200 line-clamp-1">
                  {task.title || 'Untitled Task'}
                </p>
                <div className="text-xs text-slate-400 flex items-center space-x-2">
                  <span>{task.status}</span>
                  <span>•</span>
                  <span className="line-clamp-1">
                    Atribuído para: {task.assignedToName || 'Ninguém'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <button
                  onClick={() => onTaskClick(task)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                  title="Editar"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                  title="Excluir"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className="text-xs text-slate-400 ml-4 whitespace-nowrap">
                {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Sem prazo'}
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManagementList;
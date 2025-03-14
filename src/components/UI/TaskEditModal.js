import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TaskEditModal = ({ isOpen, task, onClose, onStatusChange }) => {
  if (!task) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6 z-10"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-slate-100">{task.title}</h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-300"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Status
                </label>
                <select
                  value={task.status}
                  onChange={(e) => onStatusChange(task, e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-2"
                >
                  <option value="Not Started">Não Iniciado</option>
                  <option value="In Progress">Em Andamento</option>
                  <option value="Complete">Concluído</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Descrição
                </label>
                <p className="text-sm text-slate-300 bg-slate-700/30 rounded-lg p-3">
                  {task.description || 'Sem descrição'}
                </p>
              </div>

              <div className="flex justify-between text-sm text-slate-400">
                <span>Criado em: {new Date(task.createdAt).toLocaleDateString()}</span>
                <span>Vence em: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskEditModal;

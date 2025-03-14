import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../services/api';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.getTasks();
        setTasks(response.data);
      } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const active = tasks.find(task => 
      task.assignedTo === currentUser.id && 
      task.status !== 'Complete'
    );
    setActiveTask(active);
  }, [tasks, currentUser.id]);

  const handleTaskAssignment = async (taskId, userId) => {
    try {
      const updatedTask = await api.updateTask(taskId, { 
        assignedTo: userId,
        status: 'In Progress'
      });

      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, assignedTo: userId } : task
        )
      );

      if (userId === currentUser.id) {
        setActiveTask(updatedTask);
      }

      forceDashboardUpdate();

    } catch (error) {
      console.error('Erro ao atribuir tarefa:', error);
      showErrorNotification('Erro ao atribuir tarefa');
    }
  };

  return (
    <div className="h-full overflow-y-auto pr-2">
      <ul className="space-y-1">
        {tasks.map((task, index) => (
          <motion.li
            key={task.id || `task-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="glass-card p-2 hover:bg-slate-800/50 transition-colors duration-200 cursor-pointer"
            onClick={() => handleTaskAssignment(task.id, currentUser.id)}
          >
            <div className="flex items-center justify-between">
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
              <div className="text-xs text-slate-400 ml-2 whitespace-nowrap">
                {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Sem prazo'}
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default KanbanBoard; 
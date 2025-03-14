import React, { useEffect, useState } from 'react';
import { useApi } from '../../contexts/ApiContext';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { eventBus } from '../../contexts/EventBusContext';

const ActiveTask = () => {
  const api = useApi();
  const currentUser = useCurrentUser();
  const [activeTask, setActiveTask] = useState(null);

  useEffect(() => {
    const fetchActiveTask = async () => {
      try {
        const response = await api.getTasks({
          assignedTo: currentUser.id,
          status: { $in: ['In Progress', 'Pending'] }
        });

        const sortedTasks = response.data.sort((a, b) => {
          if (a.priority !== b.priority) return b.priority - a.priority;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setActiveTask(sortedTasks[0] || null);

      } catch (error) {
        console.error('Erro ao buscar task ativa:', error);
        showErrorNotification('Erro ao carregar tarefas');
      }
    };

    fetchActiveTask();
    const updateListener = eventBus.on('task-updated', fetchActiveTask);
    return () => eventBus.off('task-updated', updateListener);

  }, [currentUser.id]);

  return (
    <div>
      {/* Renderização do componente com base no estado activeTask */}
    </div>
  );
};

export default ActiveTask; 
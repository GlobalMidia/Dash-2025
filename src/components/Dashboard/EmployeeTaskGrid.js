import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getData, dataKeys } from '../../data/localStorageUtils'; // Import dataKeys

const EmployeeTaskGrid = ({ employees = [], tasks = [] }) => {
  // Se os props employees e tasks estiverem vazios, carregamos do localStorage
  const [localEmployees, setLocalEmployees] = useState(employees);
  const [localTasks, setLocalTasks] = useState(tasks);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    // Se os props não estiverem vazios, usamos eles
    if (employees.length > 0) {
      setLocalEmployees(employees);
    } else {
      // Caso contrário, carregamos do localStorage
      const storedEmployees = getData(dataKeys.EMPLOYEES) || [];
      setLocalEmployees(storedEmployees);
    }

    if (tasks.length > 0) {
      setLocalTasks(tasks);
    } else {
      const storedTasks = getData(dataKeys.TASKS) || [];
      setLocalTasks(storedTasks);
    }

    // Sempre carregamos os clientes do localStorage
    const storedClients = getData(dataKeys.CLIENTS) || [];
    setClients(storedClients);
  }, [employees, tasks]);

  // Get the client name for a task
  const getClientInfo = (clientId) => {
    if (!clientId) return { name: 'Unknown Client', color: '#4B5563' };

    // Convert clientId to number for comparison if it's a string
    const parsedClientId =
      typeof clientId === 'string' ? parseInt(clientId, 10) : clientId;

    const client = clients.find((client) => client.id === parsedClientId);
    return client
      ? { name: client.name, color: client.color || '#4B5563' }
      : { name: 'Unknown Client', color: '#4B5563' };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {localEmployees.slice(0, 8).map((employee, index) => { // Limit to 8 employees
        if (!employee) return null;
        // Alteração: Seleciona a tarefa ativa como a primeira cronológica
        const getActiveTask = (employeeId) => {
          if (!employeeId || localTasks.length === 0) return null;
          const employeeTasks = localTasks.filter(
            (task) => task.employeeId === employeeId
          );
          if (employeeTasks.length === 0) return null;
          // Ordena as tarefas pela data de criação (mais antiga primeiro)
          const sortedTasks = [...employeeTasks].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          return sortedTasks[0];
        };
        const activeTask = getActiveTask(employee.id);
        const employeeColor = employee.color || '#4B5563';
        const employeeName = employee.name || 'Unknown Employee';
        const profilePicture = employee.profile_picture || '/default-avatar.png';

        // Calculate animation delay based on row and column position
        const row = Math.floor(index / 2);
        const col = index % 2;
        const animationDelay = (row * 0.1) + (col * 0.05);

        return (
          <motion.div
            key={employee.id || `employee-${Math.random()}`}
            className="glass-card p-2 flex items-center h-20 relative overflow-hidden"
            style={{
              borderLeft: `4px solid ${employeeColor}`,
              boxShadow: `inset 0 0 8px ${employeeColor}33`,
            }}
            whileHover={{
              y: -4,
              boxShadow: '0 12px 20px -5px rgba(0, 0, 0, 0.3)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: animationDelay }}
          >
            <div className="flex items-center w-full pl-1">
              <div 
                className="w-20 h-20 rounded-full overflow-hidden shadow-lg mr-2 border-4"
                style={{ borderColor: employeeColor }}
              >
                <img
                  src={profilePicture}
                  alt={employeeName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"64\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%23ffffff\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"8\" r=\"5\"/><path d=\"M20 21a8 8 0 0 0-16 0\"/></svg>';
                  }}
                />
              </div>
              <div className="text-left flex-1">
                <h3
                  className="text-lg font-semibold mb-1"
                  style={{ color: employeeColor }}
                >
                  {employeeName}
                </h3>
                {activeTask ? (
                  <div>
                    <p className="text-sm text-slate-200 line-clamp-1">
                      {activeTask.title || 'Untitled Task'}
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      para {getClientInfo(activeTask.clientId).name}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Nenhuma tarefa ativa</p>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default EmployeeTaskGrid;

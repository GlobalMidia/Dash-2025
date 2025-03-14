import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getData, setData, dataKeys } from '../../data/localStorageUtils';
import { Link } from 'react-router-dom';
import { useKanban } from '../../contexts/KanbanContext';
import ConfirmationModal from '../UI/ConfirmationModal';
import TaskEditModal from '../UI/TaskEditModal';

const KanbanBoard = () => {
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { tasks, handleDragStart, handleDrop, getEmployeeTasks, setTasks } = useKanban();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingTask, setPendingTask] = useState(null);

  // Add new states for enhanced UX
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedClient, setSelectedClient] = useState('all');

  // Load data from localStorage
  useEffect(() => {
    const storedEmployees = getData(dataKeys.EMPLOYEES);
    const storedClients = getData(dataKeys.CLIENTS);

    if (storedEmployees) {
      setEmployees(storedEmployees);
    }
    if (storedClients) {
      setClients(storedClients);
    }
  }, []);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Complete':
        return 'bg-gradient-to-r from-green-600 to-emerald-600';
      case 'In Progress':
        return 'bg-gradient-to-r from-purple-600 to-fuchsia-600';
      case 'Not Started':
        return 'bg-gradient-to-r from-amber-600 to-yellow-600';
      default:
        return 'bg-gradient-to-r from-slate-600 to-slate-700';
    }
  };

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

  // Helper function to adjust color brightness
  const adjustColor = (color, amount) => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => 
      ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
    );
  };

  // Replace the existing handleStatusChange with the code below
  const handleStatusChange = (task, newStatus) => {
    if(newStatus === "Complete") {
      // Instead of window.confirm, open the modal and store the intended task update.
      setPendingTask(task);
      setIsConfirmOpen(true);
    } else {
      // Update status normally
      const updatedTasks = tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t);
      // For your app, ensure you call setTasks(updatedTasks) from context or via a prop.
      console.log("Task status updated to:", newStatus, "for task:", task.id);
    }
  };

  // Function to finalize the task from modal confirmation
  const confirmCompleteTask = () => {
    if(pendingTask) {
      const completedTask = { 
        ...pendingTask, 
        status: "Complete", 
        completedAt: new Date().toISOString() 
      };
      const taskHistory = getData(dataKeys.TASK_HISTORY) || [];
      const updatedHistory = [completedTask, ...taskHistory];
      setData(dataKeys.TASK_HISTORY, updatedHistory);

      // Remove the completed task from current tasks.
      const updatedTasks = tasks.filter(t => t.id !== pendingTask.id);
      setTasks(updatedTasks); // This will trigger a re-render and update localStorage
      console.log("Task finalized and moved to history:", completedTask);
    }
    setIsConfirmOpen(false);
    setPendingTask(null);
  };

  const cancelCompleteTask = () => {
    setIsConfirmOpen(false);
    setPendingTask(null);
  };

  // Enhanced drag handling with visual feedback
  const handleDragStartEnhanced = (e, task) => {
    e.target.style.opacity = '0.5';
    setSelectedTask(task);
    handleDragStart(e, task);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setSelectedTask(null);
  };

  const handleColumnHover = (employeeId) => {
    setHoveredColumn(employeeId);
  };

  // Add new function to render employee avatar
  const renderEmployeeAvatar = (employee) => {
    return employee.profile_picture ? (
        <img
            src={employee.profile_picture}
            alt={employee.name}
            className="w-10 h-10 rounded-full object-cover shadow-lg ring-2 ring-slate-700"
            onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.querySelector('.fallback-avatar').style.display = 'flex';
            }}
        />
    ) : (
        <div
            className="fallback-avatar w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
            style={{
                background: `linear-gradient(135deg, ${employee.color}, ${adjustColor(employee.color, -30)})`
            }}
        >
            <span className="text-white font-bold">{employee.name.charAt(0)}</span>
        </div>
    );
  };

  // Add this new function to filter tasks by client
  const getFilteredEmployeeTasks = (employeeId) => {
    const employeeTasks = getEmployeeTasks(employeeId);
    if (selectedClient === 'all') return employeeTasks;
    return employeeTasks.filter(task => 
      task.clientId === parseInt(selectedClient, 10) || 
      task.clientId === selectedClient
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 p-4 bg-slate-800/30 rounded-lg">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-slate-100">Quadro de Tarefas</h2>
          <div className="flex items-center space-x-2">
            <select 
              className="form-select bg-slate-700/50 border-slate-600 rounded-lg px-3 py-2 text-sm"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
            >
              <option value="all">Todos os Clientes</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>
        </div>
        <Link 
          to="/admin/tasks" 
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-lg text-white"
        >
          Nova Tarefa
        </Link>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto">
        {employees.map((employee) => (
          <motion.div
            key={employee.id}
            className={`kanban-column min-h-[500px] bg-slate-800/20 rounded-lg p-4 ${
              hoveredColumn === employee.id ? 'ring-2 ring-purple-500/50' : ''
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              handleColumnHover(employee.id);
            }}
            onDragLeave={() => handleColumnHover(null)}
            onDrop={(e) => {
              handleDrop(e, employee.id);
              handleColumnHover(null);
            }}
          >
            {/* Employee Header */}
            <div className="flex items-center mb-4 p-2 bg-slate-800/40 rounded-lg">
              {renderEmployeeAvatar(employee)}
              <div className="ml-3">
                <h2 className="text-lg font-semibold text-slate-100">{employee.name}</h2>
                <span className="text-sm text-slate-400">
                  {getFilteredEmployeeTasks(employee.id).length} tarefas
                </span>
              </div>
            </div>

            {/* Tasks Container */}
            <div className="space-y-3">
              <AnimatePresence>
                {getFilteredEmployeeTasks(employee.id).map((task) => (
                  <motion.div
                    key={task.id}
                    layoutId={`task-${task.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`task-card p-3 bg-slate-800/40 border border-slate-700/50 rounded-lg shadow-sm cursor-move
                      ${selectedTask?.id === task.id ? 'ring-2 ring-purple-500' : ''}
                      hover:bg-slate-800/60 transition-all duration-200`}
                    draggable
                    onDragStart={(e) => handleDragStartEnhanced(e, task)}
                    onDragEnd={handleDragEnd}
                    onClick={() => {
                      setSelectedTask(task);
                      setIsQuickViewOpen(true);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-medium text-slate-100 line-clamp-2">
                        {task.title}
                      </h3>
                      <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                        {task.status}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                      <span>{getClientInfo(task.clientId).name}</span>
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {getFilteredEmployeeTasks(employee.id).length === 0 && (
                <div className="empty-state p-4 text-center border border-dashed border-slate-700/30 rounded-lg">
                  <p className="text-slate-400 text-sm">
                    {selectedClient === 'all' 
                      ? 'Nenhuma tarefa atribuída' 
                      : 'Nenhuma tarefa deste cliente'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modals */}
      <ConfirmationModal 
        isOpen={isConfirmOpen}
        title="Finalizar Tarefa"
        message="Você tem certeza que deseja finalizar essa tarefa? Confirme para movê-la para o histórico."
        onConfirm={confirmCompleteTask}
        onCancel={cancelCompleteTask}
      />

      <TaskEditModal
        isOpen={isQuickViewOpen}
        task={selectedTask}
        onClose={() => {
          setIsQuickViewOpen(false);
          setSelectedTask(null);
        }}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default KanbanBoard;

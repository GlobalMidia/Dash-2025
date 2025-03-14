import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { getData, setData, dataKeys } from '../../data/localStorageUtils'; // Import necessary functions
import { Link } from 'react-router-dom';
import TaskManagementList from './TaskManagementList';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    employeeId: '',
    clientId: '',
    deadline: '',
    priority: 'Medium',
  });
  const [employees, setEmployees] = useState([]); // State for employees
  const [clients, setClients] = useState([]); // State for clients
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedTasks = getData(dataKeys.TASKS);
    const storedEmployees = getData(dataKeys.EMPLOYEES);
    const storedClients = getData(dataKeys.CLIENTS);

    if (storedTasks) {
      setTasks(storedTasks);
    }
    if (storedEmployees) {
      setEmployees(storedEmployees);
    }
    if (storedClients) {
      setClients(storedClients);
    }
  }, []);

  // Save tasks to localStorage whenever the tasks state changes
  useEffect(() => {
    setData(dataKeys.TASKS, tasks);
  }, [tasks]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const taskData = {
      ...formData,
      employeeId: parseInt(formData.employeeId),
      clientId: parseInt(formData.clientId),
      status: 'Not Started',
      deadline: formData.deadline, // Keep deadline as is
      priority: formData.priority, // Keep priority as is
    };

    if (editingTaskId) {
      // Update existing task
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTaskId
            ? { ...task, ...taskData, id: editingTaskId } // Preserve task ID
            : task
        )
      );
    } else {
      // Create new task
      const newTask = {
        id: Date.now(),
        ...taskData,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
    }

    // Reset form
    setFormData({
      title: '',
      description: '',
      employeeId: '',
      clientId: '',
      deadline: '',
      priority: 'Medium',
    });
    setEditingTaskId(null); // Clear editing task ID
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Get employee name by ID
  const getEmployeeName = (id) => {
    const employee = employees.find((emp) => emp.id === parseInt(id));
    return employee ? employee.name : 'Não atribuído';
  };

  // Get client name by ID
  const getClientName = (id) => {
    const client = clients.find((client) => client.id === parseInt(id));
    return client ? client.name : 'Cliente desconhecido';
  };

  // Helper function to adjust color brightness
  const adjustColor = (color, amount) => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => 
      ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
    );
  };

  // Get employee color by ID
  const getEmployeeColor = (id) => {
    const employee = employees.find((emp) => emp.id === parseInt(id));
    return employee ? employee.color || '#4B5563' : '#4B5563';
  };

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-gradient-to-r from-red-600/80 to-rose-600/80 text-white';
      case 'medium':
        return 'bg-gradient-to-r from-amber-600/80 to-yellow-600/80 text-white';
      case 'low':
        return 'bg-gradient-to-r from-green-600/80 to-emerald-600/80 text-white';
      default:
        return 'bg-gradient-to-r from-slate-600/80 to-slate-700/80 text-white';
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Complete':
        return 'bg-gradient-to-r from-green-600/80 to-emerald-600/80 text-white';
      case 'In Progress':
        return 'bg-gradient-to-r from-purple-600/80 to-fuchsia-600/80 text-white';
      case 'Not Started':
        return 'bg-gradient-to-r from-slate-600/80 to-slate-700/80 text-white';
      default:
        return 'bg-gradient-to-r from-slate-600/80 to-slate-700/80 text-white';
    }
  };

  // Handle task editing
  const handleEditTask = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      employeeId: task.employeeId.toString(),
      clientId: task.clientId.toString(),
      deadline: task.deadline,
      priority: task.priority,
    });
    setEditingTaskId(task.id);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Creation Form */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-6 gradient-text">
                {editingTaskId ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div>
                    <label className="form-label">
                      Título da Tarefa
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="form-input w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      Descrição
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="form-textarea w-full"
                      rows="3"
                    ></textarea>
                  </div>

                  <div>
                    <label className="form-label">
                      Funcionário
                    </label>
                    <select
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleChange}
                      className="form-select w-full"
                      required
                    >
                      <option value="">Selecionar um funcionário</option>
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} ({employee.role || 'Funcionário'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">
                      Cliente
                    </label>
                    <select
                      name="clientId"
                      value={formData.clientId}
                      onChange={handleChange}
                      className="form-select w-full"
                      required
                    >
                      <option value="">Selecionar cliente</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">
                      Prazo
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      className="form-input w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      Prioridade
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="form-select w-full"
                    >
                      <option value="Low">Baixa</option>
                      <option value="Medium">Média</option>
                      <option value="High">Alta</option>
                    </select>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                    >
                      {editingTaskId ? 'Atualizar Tarefa' : 'Criar Tarefa'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* TASK LIST minimalista com rolagem */}
          <div className="lg:col-span-2">
            <div className="glass-card p-4 shadow-lg">
              <h2 className="text-xl font-semibold mb-3">Tarefas</h2>
              <TaskManagementList 
                tasks={tasks.map(task => ({
                  ...task,
                  assignedToName: getEmployeeName(task.employeeId)
                }))}
                onTaskClick={handleEditTask}
                onDeleteTask={deleteTask}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default TaskManagement;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getData, setData, dataKeys } from '../../data/localStorageUtils'; // Import
import { Link } from 'react-router-dom';

const PlaybookManagement = () => {
  const [playbooks, setPlaybooks] = useState([]); // Initialize as empty array
  const [currentPlaybook, setCurrentPlaybook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tasks: []
  });
  const [currentTask, setCurrentTask] = useState({
    title: '',
    description: '',
    assignedEmployeeId: '', // Changed from assignedRole
    duration: 1,
    startOffset: 0
  });

  const [employees, setEmployees] = useState([]); // State for employees
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Load employees and playbooks from localStorage on component mount
  useEffect(() => {
    const storedPlaybooks = getData(dataKeys.PLAYBOOKS);
    const storedEmployees = getData(dataKeys.EMPLOYEES);
    if (storedPlaybooks) {
      setPlaybooks(storedPlaybooks);
    }
    if (storedEmployees) {
      setEmployees(storedEmployees);
    }
  }, []);

  // Save playbooks to localStorage whenever the playbooks state changes
  useEffect(() => {
    setData(dataKeys.PLAYBOOKS, playbooks);
  }, [playbooks]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle task form input changes
  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'startOffset' ? parseInt(value, 10) : value
    }));
  };

  // Add a task to the current playbook being created/edited
  const addTask = () => {
    if (!currentTask.title || !currentTask.assignedEmployeeId) return;
    
    const newTask = {
      ...currentTask,
      id: Date.now()
    };

    setFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));

    setCurrentTask({
      title: '',
      description: '',
      assignedEmployeeId: '',
      duration: 1,
      startOffset: 0
    });
  };

  // Remove a task from the current playbook being created/edited
  const removeTask = (taskId) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId)
    }));
  };

  // Start creating a new playbook
  const startNewPlaybook = () => {
    setCurrentPlaybook(null);
    setIsEditing(true);
    setFormData({
      name: '',
      description: '',
      tasks: []
    });
  };

 
  // Start editing an existing playbook
  const editPlaybook = (playbook) => {
    setCurrentPlaybook(playbook);
    setIsEditing(true);
    setFormData({
      name: playbook.name,
      description: playbook.description,
      tasks: [...playbook.tasks]
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentPlaybook(null);
    setFormData({
      name: '',
      description: '',
      tasks: []
    });
  };

  // Save playbook (create new or update existing)
  const savePlaybook = () => {
    if (!formData.name || formData.tasks.length === 0) return;

    if (currentPlaybook) {
      setPlaybooks(prev =>
        prev.map(p =>
          p.id === currentPlaybook.id
            ? { ...p, ...formData }
            : p
        )
      );
    } else {
      const newPlaybook = {
        ...formData,
        id: Date.now()
      };
      setPlaybooks(prev => [...prev, newPlaybook]);
    }

    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
      setIsEditing(false);
      setCurrentPlaybook(null);
      setFormData({
        name: '',
        description: '',
        tasks: []
      });
    }, 2000);
  };

  // Delete a playbook
  const deletePlaybook = (id) => {
    setPlaybooks(prev => prev.filter(p => p.id !== id));
  };

  // Get employee name by ID
  const getEmployeeName = (id) => {
    const employee = employees.find((emp) => emp.id === parseInt(id));
    return employee ? employee.name : 'Não atribuído';
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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-end mb-6">
          {!isEditing && (
            <button
              onClick={startNewPlaybook}
              className="btn btn-primary flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Novo Playbook</span>
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg mb-6"
            >
              Playbook salvo com sucesso!
            </motion.div>
          )}

          {isEditing ? (
            <motion.div
              key="edit-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass-card p-6 mb-8">
                <h2 className="text-xl font-semibold mb-6 gradient-text">
                  {currentPlaybook ? 'Editar Playbook' : 'Criar Novo Playbook'}
                </h2>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="form-label">Nome do Playbook</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input w-full"
                      placeholder="Digite o nome do playbook"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Descrição</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="form-textarea w-full"
                      rows="3"
                      placeholder="Descreva o objetivo deste playbook"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium gradient-text">Tarefas do Playbook</h3>
                  <span className="text-sm text-slate-400">{formData.tasks.length} tarefas</span>
                </div>

                {formData.tasks.length > 0 && (
                  <div className="mb-8">
                    <div className="space-y-4">
                      {formData.tasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="glass-card p-4 border border-slate-700/30"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <span className="text-purple-500 font-medium">#{index + 1}</span>
                                <h4 className="font-medium text-slate-100">{task.title}</h4>
                              </div>
                              {task.description && (
                                <p className="text-sm text-slate-300 mt-2">{task.description}</p>
                              )}
                              <div className="flex flex-wrap gap-4 text-xs text-slate-400 mt-3">
                                <span className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                  </svg>
                                  {getEmployeeName(task.assignedEmployeeId)}
                                </span>
                                <span className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                  </svg>
                                  {task.duration} semana(s)
                                </span>
                                <span className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                  </svg>
                                  Início: {task.startOffset} semana(s)
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeTask(task.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="glass-card p-6 border border-slate-700/30">
                  <h4 className="text-md font-medium mb-6 gradient-text">Adicionar Nova Tarefa</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="form-label">Título da Tarefa</label>
                      <input
                        type="text"
                        name="title"
                        value={currentTask.title}
                        onChange={handleTaskChange}
                        className="form-input w-full"
                        placeholder="Digite o título da tarefa"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="form-label">Descrição</label>
                      <textarea
                        name="description"
                        value={currentTask.description}
                        onChange={handleTaskChange}
                        className="form-textarea w-full"
                        rows="2"
                        placeholder="Descreva os detalhes da tarefa"
                      />
                    </div>

                    <div>
                      <label className="form-label">Funcionário Responsável</label>
                      <select
                        name="assignedEmployeeId"
                        value={currentTask.assignedEmployeeId}
                        onChange={handleTaskChange}
                        className="form-select w-full"
                      >
                        <option value="">Selecione o Funcionário</option>
                        {employees.map(employee => (
                          <option key={employee.id} value={employee.id}>{employee.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Duração (Semanas)</label>
                      <input
                        type="number"
                        name="duration"
                        value={currentTask.duration}
                        onChange={handleTaskChange}
                        min="1"
                        className="form-input w-full"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="form-label">Início (Semanas após início do projeto)</label>
                      <input
                        type="number"
                        name="startOffset"
                        value={currentTask.startOffset}
                        onChange={handleTaskChange}
                        min="0"
                        className="form-input w-full"
                      />
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                      <button
                        onClick={addTask}
                        className="btn btn-primary"
                        disabled={!currentTask.title || !currentTask.assignedEmployeeId}
                      >
                        Adicionar Tarefa
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={cancelEdit}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={savePlaybook}
                  className="btn btn-primary"
                  disabled={!formData.name || formData.tasks.length === 0}
                >
                  Salvar Playbook
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="playbook-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {playbooks.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {playbooks.map((playbook, index) => (
                    <motion.div
                      key={playbook.id}
                      className="glass-card p-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)' }}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-xl font-semibold gradient-text">{playbook.name}</h3>
                          <p className="text-slate-300 mt-2">{playbook.description}</p>
                          <div className="flex items-center space-x-2 mt-3">
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                              {playbook.tasks.length} tarefas
                            </span>
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                              {playbook.tasks.reduce((acc, task) => acc + task.duration, 0)} semanas
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => editPlaybook(playbook)}
                            className="btn btn-secondary text-sm"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => deletePlaybook(playbook.id)}
                            className="btn btn-danger text-sm"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-md font-medium mb-4 text-slate-200">Cronograma de Tarefas:</h4>
                        <div className="space-y-3">
                          {playbook.tasks.map((task, index) => (
                            <div
                              key={task.id}
                              className="glass-card p-4 border border-slate-700/30"
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-purple-500 font-medium">#{index + 1}</span>
                                <div className="flex-1">
                                  <h5 className="font-medium text-slate-100">{task.title}</h5>
                                  <div className="flex flex-wrap gap-4 text-xs text-slate-400 mt-2">
                                    <span className="flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                      </svg>
                                      {getEmployeeName(task.assignedEmployeeId)}
                                    </span>
                                    <span className="flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                      </svg>
                                      {task.duration} semana(s)
                                    </span>
                                    <span className="flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                      </svg>
                                      Início: {task.startOffset} semana(s)
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="glass-card p-12 text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    className="mx-auto h-16 w-16 text-slate-600 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <h3 className="text-xl font-medium text-slate-300 mb-2">
                    Nenhum Playbook Criado
                  </h3>
                  <p className="text-slate-400 mb-6">
                    Comece criando seu primeiro playbook para padronizar seus serviços
                  </p>
                  <button
                    onClick={startNewPlaybook}
                    className="btn btn-primary"
                  >
                    Criar Primeiro Playbook
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default PlaybookManagement;

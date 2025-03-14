import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getData, setData, dataKeys } from '../../data/localStorageUtils'; // Import
import { Link } from 'react-router-dom';

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    color: '#9333ea', // Default color updated to purple
    startDate: '',
    logo: null,
    logoPreview: null,
    contractDuration: '',
    playbookIds: []  // changed
  });
  const [isEditing, setIsEditing] = useState(false);
  const [playbooks, setPlaybooks] = useState([]);

  // Available colors for client color-coding - updated with our new palette
  const availableColors = [
    { name: 'Roxo', value: '#9333ea' },
    { name: 'Fúcsia', value: '#d946ef' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Rosa', value: '#ec4899' },
    { name: 'Verde', value: '#10b981' },
    { name: 'Âmbar', value: '#f59e0b' },
    { name: 'Vermelho', value: '#ef4444' },
    { name: 'Azul', value: '#3b82f6' },
    { name: 'Cinza', value: '#4b5563' },
  ];

  // Load clients and playbooks from localStorage on component mount
  useEffect(() => {
    const storedClients = getData(dataKeys.CLIENTS);
    const storedPlaybooks = getData(dataKeys.PLAYBOOKS);
    if (storedClients) {
      setClients(storedClients);
    }
    if(storedPlaybooks){
      setPlaybooks(storedPlaybooks)
    }
  }, []);

  // Save clients to localStorage whenever the clients state changes
  useEffect(() => {
    setData(dataKeys.CLIENTS, clients);
  }, [clients]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, multiple, options } = e.target;
    if(multiple) {
      const selectedValues = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      setFormData(prev => ({
        ...prev,
        [name]: selectedValues,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle logo file upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          logo: file,
          logoPreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Start editing an existing client
  const editClient = (client) => {
    setFormData({
      ...client,
      playbookIds: client.playbookIds || [], // Ensure playbookIds is always an array
    });
    setIsEditing(true);
  };

  // Cancel editing
  const cancelEdit = () => {
    setIsEditing(false);
  };

  // Save client (create new or update existing)
  const saveClient = () => {
    const { id, name, color, startDate, logoPreview, contractDuration, playbookIds } = formData;

    const clientData = {
      id: id || Date.now(), // Ensure ID is present for both new and existing clients
      name,
      color,
      startDate,
      logo: logoPreview,
      contractDuration,
      playbookIds: playbookIds || [], // Ensure playbookIds is always an array
    };

    if (id) {
      // Update existing client
      setClients((prev) =>
        prev.map((cli) =>
          cli.id === id ? { ...cli, ...clientData } : cli
        )
      );
    } else {
      // Create new client
      setClients((prev) => [...prev, clientData]);
    }

    // Debug log to verify data
    console.log('Saving client:', clientData);
    
    setIsEditing(false);
  };

  // Delete a client
  const deleteClient = (id) => {
    setClients((prev) => prev.filter((cli) => cli.id !== id));
  };

  const getPlaybookNames = (ids) => {
    if(!ids || !Array.isArray(ids) || ids.length === 0) return 'Nenhum playbook selecionado';
    const names = playbooks
      .filter(playbook => ids.includes(playbook.id.toString())) // assuming values are strings
      .map(playbook => playbook.name);
    return names.join(', ');
  };

  // Helper function to adjust color brightness
  const adjustColor = (color, amount) => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => 
      ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
    );
  };

  // Adicionar função para iniciar a criação de um novo cliente
  const startNewClient = () => {
    setFormData({
      id: null,
      name: '',
      color: '#9333ea',
      startDate: '',
      logo: null,
      logoPreview: null,
      contractDuration: '',
      playbookIds: []
    });
    setIsEditing(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="edit-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-6 gradient-text">
                Editar Cliente
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">
                    Nome
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input w-full"
                    required
                  />
                </div>
                <div>
                <label className="form-label">
                  Data de Início
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="form-input w-full"
                  required
                />
              </div>

              {/* Contract Duration */}
              <div>
                <label className="form-label">
                  Duração do Contrato
                </label>
                <select
                  name="contractDuration"
                  value={formData.contractDuration}
                  onChange={handleChange}
                  className="form-select w-full"
                  required
                >
                  <option value="3">3 Meses</option>
                  <option value="6">6 Meses</option>
                  <option value="12">12 Meses</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>

              {/* Playbook Selection - Dropdown with Tags */}
              <div>
                <label className="form-label">Playbooks</label>
                <div className="relative space-y-2">
                  <select
                    name="playbookIds"
                    value=""
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      if (selectedId && !formData.playbookIds.includes(selectedId)) {
                        setFormData(prev => ({
                          ...prev,
                          playbookIds: [...prev.playbookIds, selectedId]
                        }));
                      }
                    }}
                    className="form-select w-full"
                  >
                    <option value="">Selecionar playbook</option>
                    {playbooks
                      .filter(playbook => !formData.playbookIds.includes(playbook.id.toString()))
                      .map((playbook) => (
                        <option key={playbook.id} value={playbook.id.toString()}>
                          {playbook.name}
                        </option>
                      ))}
                  </select>

                  {formData.playbookIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 p-2 bg-slate-800/30 rounded-lg">
                      {formData.playbookIds.map(id => {
                        const playbook = playbooks.find(p => p.id.toString() === id);
                        return playbook ? (
                          <motion.span
                            key={id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-600/20 text-purple-300 border border-purple-500/30"
                          >
                            <span className="max-w-[150px] truncate">{playbook.name}</span>
                            <button
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                playbookIds: prev.playbookIds.filter(pid => pid !== id)
                              }))}
                              className="ml-1 p-0.5 hover:text-purple-100 rounded-full hover:bg-purple-500/20"
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </motion.span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Logo Upload */}
              <div className="col-span-2">
                <label className="form-label">
                  Logo da Empresa
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="btn btn-secondary"
                  >
                    Escolher Arquivo
                  </label>
                  <span className="text-sm text-slate-300">
                    {formData.logo ? formData.logo.name : 'Nenhum arquivo escolhido'}
                  </span>
                </div>

                {/* Logo Preview */}
                {formData.logoPreview && (
                  <div className="mt-4">
                    <label className="form-label">
                      Pré-visualização do Logo
                    </label>
                    <div className="w-24 h-24 rounded-full overflow-hidden border border-slate-700/30 shadow-lg">
                      <img
                        src={formData.logoPreview}
                        alt="Logo Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Color Selection */}
              <div className="col-span-2">
                <label className="form-label">
                  Selecione uma cor para o cliente
                </label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {availableColors.map((color) => (
                    <div
                      key={color.value}
                      className={`w-10 h-10 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 ${
                        formData.color === color.value
                          ? 'ring-2 ring-offset-2 ring-offset-slate-800 ring-white'
                          : ''
                      }`}
                      style={{ 
                        background: `linear-gradient(135deg, ${color.value}, ${adjustColor(color.value, -30)})`,
                        boxShadow: formData.color === color.value ? '0 0 15px rgba(255, 255, 255, 0.3)' : 'none'
                      }}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          color: color.value,
                        }))
                      }
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={cancelEdit}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveClient}
                  className="btn btn-primary"
                >
                  Atualizar Cliente
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="client-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {clients.map((client, index) => (
                  <motion.div
                    key={client.id}
                    className="glass-card p-3 shadow-sm" // further reduced padding
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -2, boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg overflow-hidden shadow-sm flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${client.color}, ${adjustColor(client.color, -30)})`,
                          padding: '1px'
                        }}
                      >
                        <img
                          src={client.logo || '/default-company.png'}
                          alt={client.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-slate-100 truncate">{client.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{client.contractDuration}m</span>
                          <span className="opacity-50">•</span>
                          <span className="truncate">{getPlaybookNames(client.playbookIds || [client.playbookId])}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => editClient(client)}
                          className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteClient(client.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                          title="Excluir"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {clients.length === 0 && (
                <div className="glass-card p-8 text-center shadow-lg">
                  <p className="text-slate-300 mb-6">Nenhum cliente encontrado</p>
                  <button
                    onClick={startNewClient}
                    className="btn btn-primary"
                  >
                    Adicionar Novo Cliente
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default ClientManagement;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getData, setData, dataKeys } from '../../data/localStorageUtils'; // Import
import { Link } from 'react-router-dom'; // Import Link

const ClientOnboarding = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    startDate: '',
    logo: null,
    logoPreview: null,
    contractDuration: '3',
    playbookId: '',
    color: '#9333ea' // Default color updated to purple
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [playbooks, setPlaybooks] = useState([]); // State for playbooks
  const [tasks, setTasks] = useState([]); // State for tasks
  const [taskHistory, setTaskHistory] = useState([]); // State for task history
  
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

  // Load playbooks and tasks from localStorage on component mount
  useEffect(() => {
    const storedPlaybooks = getData(dataKeys.PLAYBOOKS);
    const storedTasks = getData(dataKeys.TASKS);
    const storedTaskHistory = getData(dataKeys.TASK_HISTORY);
    if (storedPlaybooks) {
      setPlaybooks(storedPlaybooks);
    }
    if (storedTasks) {
      setTasks(storedTasks);
    }
    if (storedTaskHistory) {
      setTaskHistory(storedTaskHistory);
    }
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const storedClients = getData(dataKeys.CLIENTS) || []; // Get existing clients or empty array
    const selectedPlaybook = playbooks.find(playbook => playbook.id === parseInt(formData.playbookId));

    const newClient = {
      id: Date.now(), // Generate a unique ID
      name: formData.companyName,
      startDate: formData.startDate,
      logo: formData.logoPreview,
      contractDuration: formData.contractDuration,
      playbookId: formData.playbookId,
      color: formData.color
    };

    const updatedClients = [...storedClients, newClient];
    setData(dataKeys.CLIENTS, updatedClients);

    // Create new tasks based on the selected playbook
    if (selectedPlaybook && selectedPlaybook.tasks) {
      const newTasks = selectedPlaybook.tasks.map(playbookTask => ({
        id: Date.now() + Math.random(), // Generate a unique ID
        title: playbookTask.title,
        description: playbookTask.description,
        employeeId: playbookTask.assignedEmployeeId,
        clientId: newClient.id,
        deadline: new Date(formData.startDate).setDate(new Date(formData.startDate).getDate() + (playbookTask.startOffset * 7)),
        priority: 'Medium', // Default priority updated to match our other components
        status: 'Not Started', // Default status
        createdAt: new Date().toISOString(),
      }));

      // Update the tasks state and save to local storage
      const updatedTasks = [...tasks, ...newTasks];
      setTasks(updatedTasks);
      setData(dataKeys.TASKS, updatedTasks);

      // Add task history for each new task
      const newTaskHistory = newTasks.map(task => ({
        id: Date.now() + Math.random(),
        employeeId: task.employeeId,
        employeeName: '', // You might need to fetch the employee name here
        taskName: task.title,
        timestamp: new Date().toISOString(),
        action: 'created',
      }));

      const updatedTaskHistory = [...taskHistory, ...newTaskHistory];
      setTaskHistory(updatedTaskHistory);
      setData(dataKeys.TASK_HISTORY, updatedTaskHistory);
    }

    // Simulate API call to save client data
    setTimeout(() => {
      setSuccessMessage(
        `Cliente ${formData.companyName} foi adicionado com sucesso!`
      );
      setIsSubmitting(false);
      setCurrentStep(1);

      // Reset form after successful submission
      setFormData({
        companyName: '',
        startDate: '',
        logo: null,
        logoPreview: null,
        contractDuration: '3',
        playbookId: '',
        color: '#9333ea' // Default color
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    }, 1500);
  };

  // Next step handler
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  // Previous step handler
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Verificar se o formulário está válido
  const isFormValid = () => {
    if (currentStep === 1) {
      return formData.companyName && formData.startDate && formData.contractDuration;
    } else if (currentStep === 2) {
      return true; // Logo é opcional
    } else if (currentStep === 3) {
      return formData.playbookId && formData.color;
    }
    return false;
  };

  return (
    <>
      <div>
        {successMessage && (
          <div className="glass-card p-4 border-l-4 border-green-500 bg-green-500/10 text-green-400 mb-6 rounded-r-lg">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {successMessage}
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium transition-all duration-300 ${
                    currentStep === step 
                      ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 shadow-lg shadow-purple-500/30 scale-110' 
                      : currentStep > step 
                        ? 'bg-gradient-to-r from-purple-600/80 to-fuchsia-600/80' 
                        : 'bg-slate-700'
                  }`}
                >
                  {currentStep > step ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                <span className={`mt-2 text-sm ${currentStep === step ? 'text-white' : 'text-slate-400'}`}>
                  {step === 1 ? 'Informações Básicas' : step === 2 ? 'Logo' : 'Configurações'}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-[5%] right-[5%] h-1 bg-slate-700 rounded-full"></div>
            <div 
              className="absolute top-0 left-[5%] h-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep - 1) * 45}%` }}
            ></div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-card p-6 shadow-lg"
        >
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold mb-4 text-slate-200">Informações Básicas do Cliente</h2>
              
              {/* Company Name */}
              <div>
                <label className="form-label">
                  Nome da Empresa
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="form-input w-full pl-10"
                    placeholder="Digite o nome da empresa"
                    required
                  />
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="form-label">
                  Data de Início
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="form-input w-full pl-10"
                    required
                  />
                </div>
              </div>

              {/* Contract Duration */}
              <div>
                <label className="form-label">
                  Duração do Contrato
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <select
                    name="contractDuration"
                    value={formData.contractDuration}
                    onChange={handleChange}
                    className="form-select w-full pl-10"
                    required
                  >
                    <option value="3">3 meses</option>
                    <option value="6">6 meses</option>
                    <option value="12">12 meses</option>
                    <option value="custom">Personalizado</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Logo Upload */}
          {currentStep === 2 && (
            <div
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold mb-4 text-slate-200">Logo da Empresa</h2>
              
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700/50 rounded-lg">
                {formData.logoPreview ? (
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-purple-500/30 shadow-lg shadow-purple-500/20">
                      <img
                        src={formData.logoPreview}
                        alt="Logo Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-slate-300 mb-4">
                      {formData.logo ? formData.logo.name : 'Logo carregado com sucesso'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, logo: null, logoPreview: null }))}
                      className="btn btn-secondary"
                    >
                      Remover Logo
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-300 mb-4">
                      Arraste e solte um arquivo ou clique para selecionar
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="btn btn-primary"
                    >
                      Selecionar Logo
                    </label>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-slate-400 text-center">
                O logo será usado em relatórios e na interface do cliente. Formatos recomendados: PNG, JPG ou SVG.
              </p>
            </div>
          )}

          {/* Step 3: Playbook and Color */}
          {currentStep === 3 && (
            <div
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold mb-4 text-slate-200">Configurações do Cliente</h2>
              
              {/* Playbook Selection */}
              <div>
                <label className="form-label">
                  Selecione o Playbook
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <select
                    name="playbookId"
                    value={formData.playbookId}
                    onChange={handleChange}
                    className="form-select w-full pl-10"
                    required
                  >
                    <option value="">Selecionar um playbook</option>
                    {playbooks.map((playbook) => (
                      <option key={playbook.id} value={playbook.id}>
                        {playbook.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  O playbook define o conjunto de tarefas que serão criadas automaticamente para este cliente.
                </p>
              </div>
              
              {/* Color Selection */}
              <div>
                <label className="form-label">
                  Selecione uma cor para o cliente
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mt-2">
                  {availableColors.map((color) => (
                    <div
                      key={color.value}
                      className="flex flex-col items-center"
                    >
                      <div
                        className={`w-12 h-12 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 ${
                          formData.color === color.value
                            ? 'ring-2 ring-offset-2 ring-offset-slate-800 ring-white'
                            : ''
                        }`}
                        style={{ 
                          background: `linear-gradient(135deg, ${color.value}, ${color.value}dd)`,
                          boxShadow: formData.color === color.value ? `0 0 15px ${color.value}80` : 'none'
                        }}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            color: color.value,
                          }))
                        }
                      />
                      <span className="text-xs text-slate-300 mt-1">{color.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  Esta cor será usada para identificar visualmente o cliente em gráficos e listas.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="btn btn-secondary flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar
              </button>
            ) : (
              <div></div> // Empty div to maintain flex spacing
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="btn btn-primary flex items-center"
                disabled={!isFormValid()}
              >
                Próximo
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary flex items-center"
                disabled={isSubmitting || !isFormValid()}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adicionando...
                  </>
                ) : (
                  <>
                    Adicionar Cliente
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default ClientOnboarding;

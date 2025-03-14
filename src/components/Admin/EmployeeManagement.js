import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getData, setData, dataKeys } from '../../data/localStorageUtils'; // Import
import { Link } from 'react-router-dom';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]); // Initialize as empty array
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    role: '',
    contact: '',
    color: '#9333ea',
    profile_picture: null,
    profilePreview: null,
  });
  const [isEditing, setIsEditing] = useState(false);

  // Available colors for employee color-coding - updated with our new palette
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

  // Load employees from localStorage on component mount
  useEffect(() => {
    const storedEmployees = getData(dataKeys.EMPLOYEES);
    if (storedEmployees) {
      setEmployees(storedEmployees);
    }
  }, []);

  // Save employees to localStorage whenever the employees state changes
  useEffect(() => {
    setData(dataKeys.EMPLOYEES, employees);
  }, [employees]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle profile picture upload
  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profile_picture: file,
          profilePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Start creating a new employee
  const startNewEmployee = () => {
    setFormData({
      id: null,
      name: '',
      role: '',
      contact: '',
      color: '#9333ea',
      profile_picture: null,
      profilePreview: null,
    });
    setIsEditing(true);
  };

  // Start editing an existing employee
  const editEmployee = (employee) => {
    setFormData({
      ...employee,
      profilePreview: employee.profile_picture,
    });
    setIsEditing(true);
  };

  // Cancel editing
  const cancelEdit = () => {
    setIsEditing(false);
  };

  // Save employee (create new or update existing)
  const saveEmployee = () => {
    const { id, name, role, contact, color, profilePreview } = formData;

    // Create employee object without form-specific fields
    const employeeData = {
      name,
      role,
      contact,
      color,
      profile_picture: profilePreview,
    };

    if (id) {
      // Update existing employee
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === id ? { ...emp, ...employeeData } : emp
        )
      );
    } else {
      // Create new employee
      const newEmployee = {
        ...employeeData,
        id: Date.now(), // Use timestamp as ID
      };
      setEmployees((prev) => [...prev, newEmployee]);
    }

    setIsEditing(false);
  };

  // Delete an employee
  const deleteEmployee = (id) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  // Helper function to adjust color brightness
  const adjustColor = (color, amount) => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => 
      ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
    );
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
              onClick={startNewEmployee}
              className="btn btn-primary"
            >
              Adicionar Novo Funcionário
            </button>
          )}
        </div>

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
                {formData.id ? 'Editar Funcionário' : 'Adicionar Funcionário'}
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
                    Cargo
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="form-input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">
                    E-mail ou número de telefone
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="form-input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">
                    Escolha uma cor
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

                <div className="md:col-span-2">
                  <label className="form-label">
                    Foto de perfil
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileUpload}
                      className="hidden"
                      id="profile-upload"
                    />
                    <label
                      htmlFor="profile-upload"
                      className="btn btn-secondary"
                    >
                      Escolher arquivo
                    </label>
                    <span className="text-sm text-slate-300">
                      {formData.profile_picture
                        ? 'Imagem selecionada'
                        : 'Nenhum arquivo escolhido'}
                    </span>
                  </div>

                  {/* Profile Picture Preview */}
                  {formData.profilePreview && (
                    <div className="mt-4 flex justify-center">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-slate-700/30 shadow-lg">
                        <img
                          src={formData.profilePreview}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
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
                  onClick={saveEmployee}
                  className="btn btn-primary"
                  disabled={!formData.name || !formData.role}
                >
                  {formData.id ? 'Atualizar Funcionário' : 'Adicionar Funcionário'}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="employee-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {employees.map((employee, index) => (
                  <motion.div
                    key={employee.id}
                    className="glass-card p-6 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{
                      y: -5,
                      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-16 h-16 rounded-full overflow-hidden shadow-lg"
                        style={{ 
                          background: `linear-gradient(135deg, ${employee.color}, ${adjustColor(employee.color, -30)})`,
                          padding: '2px'
                        }}
                      >
                        <img
                          src={
                            employee.profile_picture ||
                            '/default-avatar.png'
                          }
                          alt={employee.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div className="flex-1">
                        <h3
                          className="text-xl font-semibold text-slate-100"
                        >
                          {employee.name}
                        </h3>
                        <p className="text-slate-300">{employee.role}</p>
                        <p className="text-sm text-slate-400 mt-1">
                          {employee.contact}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-5 pt-4 border-t border-slate-700/30">
                      <button
                        onClick={() => editEmployee(employee)}
                        className="btn btn-secondary text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteEmployee(employee.id)}
                        className="btn btn-danger text-sm"
                      >
                        Excluir
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {employees.length === 0 && (
                <div className="glass-card p-8 text-center shadow-lg">
                  <p className="text-slate-300 mb-6">Nenhum funcionário adicionado ainda</p>
                  <button
                    onClick={startNewEmployee}
                    className="btn btn-primary"
                  >
                    Adicione seu primeiro funcionário!
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

export default EmployeeManagement;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getData, setData, dataKeys } from '../../data/localStorageUtils';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const MeetingManagement = () => {
  console.log('MeetingManagement component rendered');
  
  const [meetings, setMeetings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    description: '',
    datetime: '',
    duration: 30,
    participants: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  // Load meetings and employees from localStorage on component mount
  useEffect(() => {
    console.log('Loading data from localStorage');
    const storedMeetings = getData(dataKeys.MEETINGS) || [];
    const storedEmployees = getData(dataKeys.EMPLOYEES) || [];
    
    console.log('Stored meetings:', storedMeetings);
    console.log('Stored employees:', storedEmployees);
    
    setMeetings(storedMeetings);
    setEmployees(storedEmployees);
  }, []);

  // Save meetings to localStorage whenever the meetings state changes
  useEffect(() => {
    if (meetings.length > 0 || meetings.length === 0) {
      console.log('Saving meetings to localStorage:', meetings);
      setData(dataKeys.MEETINGS, meetings);
    }
  }, [meetings]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle participant selection
  const toggleParticipant = (employeeId) => {
    setSelectedParticipants(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  // Start creating a new meeting
  const startNewMeeting = () => {
    setFormData({
      id: null,
      title: '',
      description: '',
      datetime: '',
      duration: 30,
      participants: []
    });
    setSelectedParticipants([]);
    setIsEditing(true);
  };

  // Start editing an existing meeting
  const editMeeting = (meeting) => {
    setFormData({
      ...meeting
    });
    setSelectedParticipants(meeting.participants || []);
    setIsEditing(true);
  };

  // Cancel editing
  const cancelEdit = () => {
    setIsEditing(false);
  };

  // Save meeting (create new or update existing)
  const saveMeeting = () => {
    const { id, title, description, datetime, duration } = formData;

    // Create meeting object with selected participants
    const meetingData = {
      title,
      description,
      datetime,
      duration,
      participants: selectedParticipants
    };

    if (id) {
      // Update existing meeting
      setMeetings((prev) =>
        prev.map((meeting) =>
          meeting.id === id ? { ...meeting, ...meetingData } : meeting
        )
      );
    } else {
      // Create new meeting
      const newMeeting = {
        ...meetingData,
        id: Date.now(), // Use timestamp as ID
      };
      setMeetings((prev) => [...prev, newMeeting]);
    }

    setIsEditing(false);
  };

  // Delete a meeting
  const deleteMeeting = (id) => {
    setMeetings((prev) => prev.filter((meeting) => meeting.id !== id));
  };

  // Helper function to adjust color brightness
  const adjustColor = (color, amount) => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => 
      ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
    );
  };

  // Format date for display
  const formatDateTime = (dateTimeStr) => {
    try {
      return format(new Date(dateTimeStr), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return 'Data inválida';
    }
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
              onClick={startNewMeeting}
              className="btn btn-primary"
            >
              Nova Reunião
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
                {formData.id ? 'Editar Reunião' : 'Nova Reunião'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="form-label">
                    Título da Reunião
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

                <div className="col-span-2">
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
                    Data e Hora
                  </label>
                  <input
                    type="datetime-local"
                    name="datetime"
                    value={formData.datetime}
                    onChange={handleChange}
                    className="form-input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">
                    Duração (minutos)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="form-input w-full"
                    min="5"
                    step="5"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="form-label">
                    Participantes
                  </label>
                  <div className="glass-card p-4 border border-slate-700/30 max-h-60 overflow-y-auto">
                    {employees.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {employees.map((employee) => (
                          <div 
                            key={employee.id}
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                              selectedParticipants.includes(employee.id)
                                ? 'bg-purple-900/30 border border-purple-500/50'
                                : 'hover:bg-slate-800/50 border border-transparent'
                            }`}
                            onClick={() => toggleParticipant(employee.id)}
                          >
                            <div
                              className="w-10 h-10 rounded-full overflow-hidden shadow-lg mr-3"
                              style={{ 
                                background: `linear-gradient(135deg, ${employee.color || '#6B7280'}, ${adjustColor(employee.color || '#6B7280', -30)})`,
                                padding: '2px'
                              }}
                            >
                              <img
                                src={employee.profile_picture || '/default-avatar.png'}
                                alt={employee.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-200">{employee.name}</p>
                              <p className="text-xs text-slate-400">{employee.role}</p>
                            </div>
                            {selectedParticipants.includes(employee.id) && (
                              <div className="ml-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-slate-400 py-4">Nenhum funcionário cadastrado</p>
                    )}
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
                  onClick={saveMeeting}
                  className="btn btn-primary"
                  disabled={!formData.title || !formData.datetime}
                >
                  {formData.id ? 'Atualizar Reunião' : 'Criar Reunião'}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="meeting-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {meetings && meetings.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {meetings.map((meeting, index) => (
                    <motion.div
                      key={meeting.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-lg border border-slate-700/30 hover:border-purple-500/30 transition-all duration-300"
                    >
                      <div className="flex items-center">
                        {/* Enhanced Date and Time Display */}
                        <div className="w-40 bg-gradient-to-br from-purple-500/30 to-fuchsia-500/30 p-6 flex flex-col items-center justify-center text-center rounded-l-lg border-r border-purple-500/20">
                          <div className="text-3xl font-bold text-purple-300">
                            {format(new Date(meeting.datetime), 'dd')}
                          </div>
                          <div className="text-sm font-medium text-purple-200 uppercase tracking-wider">
                            {format(new Date(meeting.datetime), 'MMM yyyy')}
                          </div>
                          <div className="mt-2 text-xl font-semibold text-purple-100 tracking-wider">
                            {format(new Date(meeting.datetime), 'HH:mm')}
                          </div>
                          <div className="mt-1 text-xs text-purple-300">
                            {meeting.duration} min
                          </div>
                        </div>
                        
                        {/* Rest of the meeting content */}
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-100">{meeting.title}</h3>
                              <p className="text-sm text-slate-400 mt-1">{meeting.description}</p>
                              
                              {/* Participantes em linha */}
                              <div className="flex items-center mt-3 flex-wrap gap-2">
                                <div className="flex -space-x-2 mr-2">
                                  {meeting.participants && meeting.participants.slice(0, 3).map((participantId) => {
                                    const employee = employees.find(emp => emp.id === participantId);
                                    if (!employee) return null;
                                    return (
                                      <div
                                        key={participantId}
                                        className="w-6 h-6 rounded-full border-2 border-slate-800 overflow-hidden"
                                        style={{ 
                                          background: `linear-gradient(135deg, ${employee.color || '#6B7280'}, ${adjustColor(employee.color || '#6B7280', -30)})`
                                        }}
                                      >
                                        <img
                                          src={employee.profile_picture || '/default-avatar.png'}
                                          alt={employee.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                                {meeting.participants && meeting.participants.length > 0 && (
                                  <span className="text-xs text-slate-400">
                                    {meeting.participants.length} participante{meeting.participants.length !== 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Ações */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => editMeeting(meeting)}
                                className="p-2 rounded-lg bg-slate-700/30 hover:bg-purple-500/30 transition-colors duration-200"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => deleteMeeting(meeting.id)}
                                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors duration-200"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="glass-card p-8 text-center shadow-lg">
                  <p className="text-slate-300 mb-6">Nenhuma reunião agendada</p>
                  <button
                    onClick={startNewMeeting}
                    className="btn btn-primary"
                  >
                    Agendar Nova Reunião
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

export default MeetingManagement;
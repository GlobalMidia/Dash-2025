import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// Dashboard components
import EmployeeTaskGrid from './EmployeeTaskGrid';
import ClientCarousel from './ClientCarousel';
import TaskHistoryFeed from './TaskHistoryFeed';
import DeadlinesSection from './DeadlinesSection';
import UpcomingMeetings from './UpcomingMeetings';

// Data utilities
import { getData, dataKeys } from '../../data/localStorageUtils';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskHistory, setTaskHistory] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  
  const navigate = useNavigate();
  
  // Ref for the menu dropdown
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  
  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      setEmployees(getData(dataKeys.EMPLOYEES) || []);
      setClients(getData(dataKeys.CLIENTS) || []);
      setTasks(getData(dataKeys.TASKS) || []);
      setTaskHistory(getData(dataKeys.TASK_HISTORY) || []);
      setMeetings(getData(dataKeys.MEETINGS) || []);
    };
    
    // Load data initially
    loadData();
    
    // Set up auto-refresh every 1 minute
    const refreshInterval = setInterval(loadData, 1 * 60 * 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(refreshInterval);
  }, []);
  
  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showMenu && 
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);
  
  // Get employee color by ID
  const getEmployeeColor = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.color : '#6B7280';
  };
  
  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Handle navigation
  const handleNavigation = (section) => {
    if (section === 'dashboard') {
      setActiveSection('dashboard');
      navigate('/dashboard');
    } else if (section === 'admin') {
      setActiveSection('admin');
      navigate('/admin');
    } else if (section === 'logout') {
      // Implementar lógica de logout
      localStorage.removeItem('authToken');
      navigate('/login');
    }
    setShowMenu(false);
  };
  
  return (
    <div className="dashboard bg-gradient-to-br from-gray-900 to-[#1a1a22] text-slate-200 w-full min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1920px] mx-auto relative h-screen"
      >
        {/* Floating Menu Button (Right Side) */}
        <div className="fixed top-4 right-4 z-50">
          <button 
            ref={menuButtonRef}
            onClick={() => setShowMenu(!showMenu)}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1 menu-button menu-button-pulse"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          
          {showMenu && (
            <motion.div 
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute top-16 right-0 glass-card p-3 min-w-[220px] shadow-xl menu-dropdown"
            >
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => handleNavigation('dashboard')}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 menu-item ${activeSection === 'dashboard' ? 'active' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => handleNavigation('admin')}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 menu-item ${activeSection === 'admin' ? 'active' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Admin</span>
                </button>
                <button
                  onClick={() => {
                    toggleFullscreen();
                    setShowMenu(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 menu-item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isFullscreen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9L4 4m0 0l5 0m-5 0l0 5M15 9l5-5m0 0l-5 0m5 0l0 5M9 15l-5 5m0 0l5 0m-5 0l0 -5M15 15l5 5m0 0l-5 0m5 0l0 -5" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    )}
                  </svg>
                  <span>{isFullscreen ? 'Sair da Tela Cheia' : 'Tela Cheia'}</span>
                </button>
                <div className="border-t border-gray-700/30 my-1"></div>
                <button 
                  onClick={() => handleNavigation('logout')}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 menu-item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sair</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Main Content - Full screen for cards */}
        <div className="flex h-screen box-border overflow-hidden p-2 gap-4">
          {/* Left side: Employee Tasks and Clients */}
          <div className="w-2/3 flex flex-col gap-4">
            {/* Employee Task Grid - 80% height */}
            <div className="glass-cardemp p-5 shadow-lg ">
              <h2 className="text-xl font-bold gradient-text mb-4">Tarefas dos Funcionários</h2>
              <div className="h-full">
                <EmployeeTaskGrid employees={employees} tasks={tasks} />
              </div>
            </div>
            
            {/* Clients Carousel - 20% height */}
            <div className="glass-cardcli p-4 shadow-lg flex-grow">
              <h2 className="text-xl font-bold gradient-text mb-2">Clientes Ativos</h2>
              <div className="h-full">
                <ClientCarousel clients={clients} />
              </div>
              <p className="text-sm text-slate-400 mt-2">Total de clientes: {clients.length}</p>
            </div>
          </div>
          
          {/* Right side: Task History, Deadlines, and Meetings */}
          <div className="w-1/3 flex flex-col gap-4">
            {/* Task History Feed */}
            <div className="glass-cardhist p-5 shadow-lg flex-grow">
              <h2 className="text-xl font-bold gradient-text mb-4">Histórico</h2>
              <div className="h-full">
                <TaskHistoryFeed taskHistory={taskHistory} getEmployeeColor={getEmployeeColor} />
              </div>
            </div>
            
            {/* Deadlines Section */}
            <div className="glass-carddead p-5 shadow-lg flex-grow">
              <h2 className="text-xl font-bold gradient-text mb-4">Prazos</h2>
              <div className="h-full">
                <DeadlinesSection tasks={tasks} employees={employees} />
              </div>
            </div>
            
            {/* Upcoming Meetings */}
            <div className="glass-cardmeet p-5 shadow-lg flex-grow">
              <h2 className="text-xl font-bold gradient-text mb-4">Reuniões</h2>
              <div className="h-full grid grid-cols-2 gap-4 overflow-y-auto">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-purple-300 uppercase tracking-wider">Hoje</h3>
                  <UpcomingMeetings 
                    meetings={meetings.filter(m => 
                      format(new Date(m.datetime), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                    )} 
                    employees={employees}
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-purple-300 uppercase tracking-wider">Próximas</h3>
                  <UpcomingMeetings 
                    meetings={meetings.filter(m => 
                      format(new Date(m.datetime), 'yyyy-MM-dd') > format(new Date(), 'yyyy-MM-dd')
                    )} 
                    employees={employees}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ClientOnboarding from './ClientOnboarding';
import PlaybookManagement from './PlaybookManagement';
import TaskManagement from './TaskManagement';
import EmployeeManagement from './EmployeeManagement';
import KanbanBoard from './KanbanBoard';
import ClientManagement from './ClientManagement';
import MeetingManagement from './MeetingManagement';
import ArchivedTasks from './ArchivedTasks';
import { KanbanProvider } from '../../contexts/KanbanContext';

const Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Refs para os menus dropdown
  const userMenuRef = useRef(null);
  const userMenuButtonRef = useRef(null);

  // Itens de navegação para a barra lateral
  const navItems = [
    { 
      path: '/admin', 
      label: 'Onboarding de Cliente', 
      exact: true, 
      icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      description: 'Cadastre novos clientes e configure seus serviços iniciais'
    },
    { 
      path: '/admin/clients', 
      label: 'Clientes', 
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      description: 'Gerencie a base de clientes da sua agência'
    },
    { 
      path: '/admin/playbooks', 
      label: 'Playbooks', 
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      description: 'Crie fluxos de trabalho padronizados para seus serviços'
    },
    { 
      path: '/admin/tasks', 
      label: 'Tarefas', 
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
      description: 'Gerencie as tarefas da sua equipe'
    },
    { 
      path: '/admin/employees', 
      label: 'Funcionários', 
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      description: 'Administre sua equipe e atribua responsabilidades'
    },
    { 
      path: '/admin/kanban', 
      label: 'Kanban', 
      icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
      description: 'Visualize e gerencie o fluxo de trabalho em tempo real'
    },
    { 
      path: '/admin/meetings', 
      label: 'Reuniões', 
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      description: 'Agende e gerencie reuniões com clientes e equipe'
    },
    { 
      path: '/admin/archived', 
      label: 'Arquivados', 
      icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
      description: 'Visualize tarefas arquivadas'
    },
  ];
  
  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showUserMenu && 
        userMenuRef.current && 
        !userMenuRef.current.contains(event.target) &&
        userMenuButtonRef.current &&
        !userMenuButtonRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);
  
  // Alternar modo tela cheia
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Monitorar mudanças no estado de tela cheia
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Navegação
  const handleNavigation = (section) => {
    if (section === 'dashboard') {
      navigate('/dashboard');
    } else if (section === 'admin') {
      navigate('/admin');
    } else if (section === 'logout') {
      localStorage.removeItem('authToken');
      navigate('/login');
    }
    setShowUserMenu(false);
  };

  // Obter o título da página atual
  const getCurrentPageTitle = () => {
    console.log("Pathname atual:", location.pathname);
    const currentItem = navItems.find(item => 
      item.exact 
        ? location.pathname === item.path 
        : location.pathname.startsWith(item.path)
    );
    return currentItem?.label || 'Admin';
  };

  // Obter a descrição da página atual
  const getCurrentPageDescription = () => {
    const currentItem = navItems.find(item => 
      item.exact 
        ? location.pathname === item.path 
        : location.pathname.startsWith(item.path)
    );
    return currentItem?.description || '';
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-[#1a1a22] text-slate-200 min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-20' : 'w-64'} h-screen bg-[#1c1923] border-r border-slate-700/30 transition-all duration-300 fixed left-0 top-0 z-10`}>
          <div className="flex flex-col h-full">
            {/* Logo e Toggle */}
            <div className="p-4 border-b border-slate-700/30 flex items-center justify-between">
              {!sidebarCollapsed && (
                <div>
                  <h2 className="text-xl font-bold gradient-text">Admin</h2>
                  <p className="text-xs text-slate-400">Global Mídia Digital</p>
                </div>
              )}
              <button 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            </div>

            {/* Navegação */}
            <nav className="flex-1 overflow-y-auto py-6 px-3">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.exact}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/20'
                            : 'hover:bg-slate-800/70 hover:translate-x-1'
                        }`
                      }
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      {!sidebarCollapsed && (
                        <span className="ml-3 whitespace-nowrap">{item.label}</span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700/30">
              <button
                onClick={() => handleNavigation('dashboard')}
                className="flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 hover:bg-slate-800/70 hover:translate-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {!sidebarCollapsed && <span className="ml-3">Dashboard</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          {/* Header */}
          <header className="p-4 border-b border-slate-700/30">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold gradient-text">{getCurrentPageTitle()}</h1>
                <p className="text-slate-400 mt-1">{getCurrentPageDescription()}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-lg bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isFullscreen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9L4 4m0 0l5 0m-5 0l0 5M15 9l5-5m0 0l-5 0m5 0l0 5M9 15l-5 5m0 0l5 0m-5 0l0 -5M15 15l5 5m0 0l-5 0m5 0l0 -5" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    )}
                  </svg>
                </button>
                
                <div className="relative">
                  <button
                    ref={userMenuButtonRef}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 flex items-center justify-center">
                      <span className="text-white font-bold">A</span>
                    </div>
                    <span className="text-sm font-medium">Admin</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        ref={userMenuRef}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-2 w-56 bg-[#1c1923]/90 backdrop-blur-md border border-slate-700/30 rounded-lg shadow-xl z-50"
                      >
                        <div className="p-3">
                          <div className="px-4 py-3 border-b border-slate-700/30">
                            <p className="text-sm font-medium text-slate-200">Admin</p>
                            <p className="text-xs text-slate-400">admin@globalmidiadigital.com</p>
                          </div>
                          <div className="mt-2">
                            <button
                              onClick={() => handleNavigation('logout')}
                              className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-800/50 rounded-lg"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              <span>Sair</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </header>

          {/* Conteúdo das Rotas */}
          <div className="p-6">
            {location.pathname === '/admin/kanban' ? (
              <div className="p-6 shadow-lg mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Routes>
                      <Route index element={<ClientOnboarding />} />
                      <Route path="clients" element={<ClientManagement />} />
                      <Route path="playbooks" element={<PlaybookManagement />} />
                      <Route path="tasks" element={<TaskManagement />} />
                      <Route path="employees" element={<EmployeeManagement />} />
                      <Route path="kanban" element={
                        <KanbanProvider>
                          <KanbanBoard />
                        </KanbanProvider>
                      } />
                      <Route path="meetings" element={<MeetingManagement />} />
                      <Route path="archived" element={<ArchivedTasks />} />
                    </Routes>
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              <div className="glass-card p-6 shadow-lg max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Routes>
                      <Route index element={<ClientOnboarding />} />
                      <Route path="clients" element={<ClientManagement />} />
                      <Route path="playbooks" element={<PlaybookManagement />} />
                      <Route path="tasks" element={<TaskManagement />} />
                      <Route path="employees" element={<EmployeeManagement />} />
                      <Route path="kanban" element={
                        <KanbanProvider>
                          <KanbanBoard />
                        </KanbanProvider>
                      } />
                      <Route path="meetings" element={<MeetingManagement />} />
                      <Route path="archived" element={<ArchivedTasks />} />
                    </Routes>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

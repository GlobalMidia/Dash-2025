import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Dashboard components
import Dashboard from './Dashboard/Dashboard';

// Admin components
import Admin from './Admin/Admin';

// Data utilities
import { initializeLocalStorage } from '../data/localStorageUtils';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already authenticated
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setIsAuthenticated(true);
    }
    
    initializeLocalStorage();
  }, []);
  
  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simple password check - in a real app, this would be more secure
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
      // Store auth token in localStorage
      localStorage.setItem('authToken', 'authenticated');
    } else {
      setError('Senha inválida');
    }
  };
  
  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    return children;
  };
  
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="min-h-screen bg-[#0c0c0f] text-slate-200">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/login" element={
            !isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md mx-auto glass-card p-8 shadow-lg mt-16"
              >
                <h2 className="text-2xl font-bold gradient-text mb-6">Login de Administrador</h2>
                
                {error && (
                  <div className="glass-card p-4 border border-red-500/30 text-red-400 mb-6">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleLogin}>
                  <div className="mb-6">
                    <label className="form-label" htmlFor="password">
                      Senha
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input w-full"
                      placeholder="Digite a senha de admin"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      Entrar
                    </button>
                  </div>
                  
                  <div className="mt-4 text-sm text-slate-400">
                    <p>Senha padrão: admin123</p>
                  </div>
                </form>
              </motion.div>
            ) : (
              <Navigate to="/admin" />
            )
          } />
          
          {/* Todas as rotas administrativas são tratadas pelo componente Admin */}
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

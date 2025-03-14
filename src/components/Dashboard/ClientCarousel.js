import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getData, dataKeys } from '../../data/localStorageUtils'; // Import dataKeys

const ClientCarousel = () => {
  const [clients, setClients] = useState([]); // Initialize as an empty array

  // Load clients from localStorage on component mount
  useEffect(() => {
    const storedClients = getData(dataKeys.CLIENTS);
    console.log('Clientes carregados:', storedClients); // Adicionar log
    if (storedClients) {
      setClients(storedClients);
    } else {
      setClients([]);
    }
  }, []);

  // Handle empty clients array
  if (clients.length === 0) {
    return (
      <div className="glass-card p-8 flex items-center justify-center h-[200px]">
        <p className="text-slate-400 text-center text-lg">Nenhum cliente cadastrado.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="glass-card p-4 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-wrap gap-x-6 gap-y-4 items-start">
        {clients.map((client, index) => (
          <motion.div
            key={client.id}
            className={`flex-shrink-0 flex flex-col items-center space-y-2 ${
              index >= 10 ? 'mt-4' : ''
            }`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 flex items-center justify-center"
              style={{ borderColor: client.color }}
            >
              {client.logo ? (
                <img
                  src={client.logo}
                  alt={client.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full rounded-full flex items-center justify-center"
                  style={{ backgroundColor: client.color }}
                >
                  <span className="text-xl font-bold text-white">
                    {client.name.charAt(0) || '?'}
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-300 text-center max-w-[80px] truncate">
              {client.name}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ClientCarousel;
